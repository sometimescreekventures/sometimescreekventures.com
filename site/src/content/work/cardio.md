---
title: 'A HIPAA remote patient-monitoring platform, built solo'
client: 'Cardio'
slug: 'cardio'
role: 'Sole architect & engineer'
summary: 'Sole architect and engineer of a production HIPAA-sensitive cardiovascular remote-monitoring platform — from device telemetry ingestion to multi-tenant clinical dashboards.'
stats:
  - label: 'of the repo — ~513 commits over ~13 months'
    value: '99%'
  - label: 'Go microservices, ~51,000 lines'
    value: '13'
  - label: 'AWS CDK stacks (TypeScript), ~5,800 lines of IaC'
    value: '11+'
  - label: 'React/Next.js clinical apps'
    value: '3'
stack:
  - Go
  - AWS CDK (TypeScript)
  - DynamoDB
  - Redis
  - S3
  - MQTT
  - Fargate
  - Cognito
  - React / Next.js
order: 2
---

## Context

Cardio operates a cardiovascular remote patient-monitoring platform: medical devices stream telemetry that clinicians watch in real time on multi-tenant dashboards. The data is PHI, the users are clinical staff, and the monitoring is live — the system has to be correct, secure, and continuously available.

## Role

Sean was the sole architect and engineer of the production platform, engaged through Sometimes Creek Ventures. The numbers describe the scope: **~513 commits — 99% of the repository — over roughly 13 months**, spanning backend, infrastructure, and frontend. **13 Go microservices (~51,000 lines)**, **11+ AWS CDK stacks in TypeScript (~5,800 lines of IaC)**, and **3 React/Next.js clinical applications**, backed by **16+ DynamoDB tables** plus a Redis hot store, S3 cold archive, and MQTT ingestion.

## What was built

The data plane is three-tiered. Device telemetry arrives over MQTT and lands in a Redis real-time hot store; an hourly job compresses it into time-partitioned S3 archives. Reads fall through transparently from hot to cold, so dashboards and reports query one interface regardless of where the data lives.

Security and tenancy are designed in, not bolted on: dual Cognito user pools, JWTs validated locally in each service, multi-tenant RBAC across Tenant, Supplier, and Practice roles, PHI gating on what each role can see, and least-privilege IAM throughout the infrastructure.

The real-time tier runs on Fargate, multiplexing WebSocket and SSE connections to live dashboards. Because clinicians may be actively monitoring patients during a release, deploys are engineered to be "zero-blip": live monitoring sessions never drop across a deployment.

## Results

The platform runs in production with clinical users. Beyond shipping it, the performance work was measured, not guessed:

- Eliminated full-table DynamoDB scans by migrating hot queries onto GSIs.
- Bounded async fan-out so burst load degrades gracefully instead of cascading.
- Added adaptive time-series downsampling so charts stay responsive over long ranges.
- Diagnosed and fixed a CPU-pegging report job by moving it from a 45-second cadence to 5 minutes.

The larger result is the shape of the engagement itself: one engineer carried a HIPAA-sensitive platform from architecture through IaC, services, frontends, and operations — the "fractional senior engineer" model at full depth.
