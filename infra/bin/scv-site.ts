#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ScvSiteStack } from '../lib/scv-site-stack';

const app = new cdk.App();

new ScvSiteStack(app, 'ScvSiteStack', {
  env: {
    // Falls back to a placeholder account so `cdk synth` works without AWS
    // credentials (CI); the hosted-zone lookup for the placeholder is
    // pre-seeded in cdk.context.json. Real deploys resolve the real account
    // from the active AWS profile.
    account: process.env.CDK_DEFAULT_ACCOUNT ?? '111111111111',
    // Single-region deployment in us-east-1: CloudFront requires its ACM
    // certificate there, so keeping the whole stack in us-east-1 removes the
    // cross-region reference problem entirely.
    region: 'us-east-1',
  },
  description:
    'sometimescreekventures.com — static site: S3 + CloudFront (OAC) + Route53 + GitHub OIDC deploy role',
});
