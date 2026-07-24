import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as path from 'path';

const DOMAIN = 'sometimescreekventures.com';
const WWW = `www.${DOMAIN}`;
const GITHUB_REPO = 'sometimescreekventures/sometimescreekventures.com';
// GitHub also issues OIDC tokens with immutable owner/repo IDs embedded in the
// sub claim (see the repo's actions/oidc/customization/sub endpoint). Trust
// both forms so deploys keep working whichever format GitHub sends — the
// ID-stamped one is the stronger match (a renamed or recreated repo with the
// same name cannot inherit it).
const GITHUB_REPO_IMMUTABLE =
  'sometimescreekventures@132377848/sometimescreekventures.com@1311236429';

export class ScvSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: DOMAIN,
    });

    // Site bucket. Name is generated (never `sometimescreekventures.com`) so
    // it cannot collide with the old stack's bucket during cutover.
    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      enforceSSL: true,
      autoDeleteObjects: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: DOMAIN,
      subjectAlternativeNames: [WWW],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    // Viewer-request function: www -> apex redirect + extensionless-URL
    // rewrite for Astro's directory-style output.
    const viewerRequestFn = new cloudfront.Function(this, 'ViewerRequestFn', {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, '..', 'functions', 'viewer-request.js'),
      }),
      comment: 'www->apex redirect and extensionless URL rewrite',
    });

    const responseHeaders = new cloudfront.ResponseHeadersPolicy(
      this,
      'SecurityHeaders',
      {
        comment: 'Security headers for sometimescreekventures.com',
        securityHeadersBehavior: {
          strictTransportSecurity: {
            accessControlMaxAge: cdk.Duration.days(365),
            includeSubdomains: true,
            override: true,
          },
          contentTypeOptions: { override: true },
          referrerPolicy: {
            referrerPolicy:
              cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
            override: true,
          },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          contentSecurityPolicy: {
            // Fully static site, no third-party origins. 'unsafe-inline'
            // styles only, for the scoped style tags Astro emits.
            contentSecurityPolicy: [
              "default-src 'self'",
              "img-src 'self' data:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
            override: true,
          },
        },
        customHeadersBehavior: {
          customHeaders: [
            {
              header: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
              override: true,
            },
          ],
        },
      },
    );

    const siteOrigin = origins.S3BucketOrigin.withOriginAccessControl(bucket);

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: DOMAIN,
      domainNames: [DOMAIN, WWW],
      certificate,
      defaultRootObject: 'index.html',
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      defaultBehavior: {
        origin: siteOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: responseHeaders,
        functionAssociations: [
          {
            function: viewerRequestFn,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      // Hashed assets: same caching policy at the edge (freshness comes from
      // the immutable cache-control metadata set at upload), but keep the
      // www-redirect function on the path.
      additionalBehaviors: {
        '/_astro/*': {
          origin: siteOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          compress: true,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          responseHeadersPolicy: responseHeaders,
          functionAssociations: [
            {
              function: viewerRequestFn,
              eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            },
          ],
        },
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    for (const [recordId, recordName] of [
      ['Apex', DOMAIN],
      ['Www', WWW],
    ] as const) {
      new route53.ARecord(this, `${recordId}ARecord`, {
        zone,
        recordName,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution),
        ),
      });
      new route53.AaaaRecord(this, `${recordId}AaaaRecord`, {
        zone,
        recordName,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution),
        ),
      });
    }

    // GitHub OIDC: set `-c createGithubOidcProvider=false` if the account
    // already has the token.actions.githubusercontent.com provider.
    const createProvider =
      this.node.tryGetContext('createGithubOidcProvider') !== false &&
      this.node.tryGetContext('createGithubOidcProvider') !== 'false';

    const oidcProviderArn = `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`;
    const oidcProvider = createProvider
      ? new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
        })
      : iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'GithubOidcProvider',
          oidcProviderArn,
        );

    const deployRole = new iam.Role(this, 'GithubDeployRole', {
      roleName: 'scv-site-github-deploy',
      description: `Deploys ${DOMAIN} from GitHub Actions (${GITHUB_REPO}, main only)`,
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(
        oidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            'token.actions.githubusercontent.com:sub': [
              `repo:${GITHUB_REPO}:ref:refs/heads/main`,
              `repo:${GITHUB_REPO_IMMUTABLE}:ref:refs/heads/main`,
            ],
          },
        },
      ),
    });

    deployRole.attachInlinePolicy(
      new iam.Policy(this, 'GithubDeployPolicy', {
        statements: [
          new iam.PolicyStatement({
            sid: 'SyncSiteBucket',
            actions: [
              's3:ListBucket',
              's3:GetObject',
              's3:PutObject',
              's3:DeleteObject',
            ],
            resources: [bucket.bucketArn, bucket.arnForObjects('*')],
          }),
          new iam.PolicyStatement({
            sid: 'InvalidateDistribution',
            actions: ['cloudfront:CreateInvalidation'],
            resources: [
              `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
            ],
          }),
        ],
      }),
    );

    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, 'DeployRoleArn', { value: deployRole.roleArn });
  }
}
