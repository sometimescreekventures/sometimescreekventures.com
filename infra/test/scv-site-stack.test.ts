import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { ScvSiteStack } from '../lib/scv-site-stack';

const TEST_ACCOUNT = '111111111111';

function synth(): Template {
  const app = new cdk.App({
    context: {
      // Pre-seeded hosted-zone lookup so tests never call AWS.
      [`hosted-zone:account=${TEST_ACCOUNT}:domainName=sometimescreekventures.com:region=us-east-1`]:
        {
          Id: '/hostedzone/Z0000000TESTZONE',
          Name: 'sometimescreekventures.com.',
        },
    },
  });
  const stack = new ScvSiteStack(app, 'ScvSiteStack', {
    env: { account: TEST_ACCOUNT, region: 'us-east-1' },
  });
  return Template.fromStack(stack);
}

describe('ScvSiteStack', () => {
  const template = synth();

  test('matches snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

  test('bucket is private, versioned, encrypted, and retained', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      VersioningConfiguration: { Status: 'Enabled' },
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          { ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } },
        ],
      },
    });
    template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
    // No website-hosting configuration on the bucket.
    template.hasResourceProperties('AWS::S3::Bucket', {
      WebsiteConfiguration: Match.absent(),
    });
  });

  test('distribution serves both aliases over modern TLS via OAC', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        Aliases: ['sometimescreekventures.com', 'www.sometimescreekventures.com'],
        DefaultRootObject: 'index.html',
        HttpVersion: 'http2and3',
        ViewerCertificate: Match.objectLike({
          MinimumProtocolVersion: 'TLSv1.2_2021',
        }),
      }),
    });
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
  });

  test('custom error responses map S3 denials to the 404 page', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        CustomErrorResponses: Match.arrayWith([
          Match.objectLike({
            ErrorCode: 403,
            ResponseCode: 404,
            ResponsePagePath: '/404.html',
          }),
        ]),
      }),
    });
  });

  test('deploy role trusts exactly this repo on main', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: [
          Match.objectLike({
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              StringEquals: {
                'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
                'token.actions.githubusercontent.com:sub': [
                  'repo:sometimescreekventures/sometimescreekventures.com:ref:refs/heads/main',
                  'repo:sometimescreekventures@132377848/sometimescreekventures.com@1311236429:ref:refs/heads/main',
                ],
              },
            },
          }),
        ],
      }),
    });
  });

  test('deploy policy is scoped to the bucket and invalidations only', () => {
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: [
          Match.objectLike({
            Action: [
              's3:ListBucket',
              's3:GetObject',
              's3:PutObject',
              's3:DeleteObject',
            ],
          }),
          Match.objectLike({
            Action: 'cloudfront:CreateInvalidation',
          }),
        ],
      }),
    });
  });

  test('records exist for apex and www, A and AAAA', () => {
    template.resourceCountIs('AWS::Route53::RecordSet', 4);
  });
});
