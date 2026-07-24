---
title: 'Cloud platform automation at Fortune-5 scale'
client: 'CVS Health'
slug: 'cvs-health'
role: 'Cloud Platform Automation Lead'
summary: 'Leading the platform-automation workstream of a Fortune-5 Google Cloud transformation — a self-service IaC platform that provisions GCP managed services end-to-end with zero manual steps.'
stats:
  - label: 'engineers in the cross-functional squad'
    value: '15+'
  - label: 'manual steps to provision a managed service'
    value: '0'
  - label: 'onboarding pattern reused across GCP services'
    value: '1'
stack:
  - Google Cloud
  - Terraform
  - terratest
  - GitHub Actions
  - Temporal
  - OPA
  - OpenTelemetry
  - GKE
  - Vertex AI
order: 1
---

## Context

CVS Health is a Fortune-5 healthcare company running a large-scale Google Cloud transformation under HIPAA regulation. At that scale, cloud adoption lives or dies on one question: can application teams get the services they need without waiting on a platform team — and without being able to configure them insecurely? The platform-automation workstream exists to make the answer yes.

## Role

Sean leads the platform-automation workstream through Sometimes Creek Ventures. He owns the internal IaC and automation platform, leads a cross-functional squad of 15+ engineers, and owns the commercial mechanics of the workstream inside a multi-million-dollar program: capacity planning, SOW scoping, estimates, and change requests.

## What was built

The core of the platform is end-to-end provisioning of GCP managed services with zero manual steps. An application team requests a service through a self-service interface; the platform provisions it policy-gated and secure by default — CMEK encryption, private networking, least-privilege IAM, and mandatory tagging — with PR-based approval gating on every change.

Rather than automating services one at a time, Sean defined a standardized service-onboarding pattern that is reused for every GCP service the platform supports. PubSub, Dataproc, GKE, Vertex AI, and Cloud Functions run through it today; BigQuery, Gemini, Cloud Run, Dataflow, and the Cloud Healthcare API are in the pipeline. The pattern is the product: each new service is an instantiation, not a new project.

Around the provisioning core, the squad built the machinery that makes a platform trustworthy at enterprise scale:

- **Test automation** — end-to-end API and regression testing with terratest, so provisioning behavior is proven, not assumed.
- **CI/CD** — GitHub Actions pipelines run as GitOps, with the PR as the unit of change and approval.
- **Observability** — OpenTelemetry instrumentation across the platform.
- **Disaster recovery** — cross-region failover design with defined RTO/RPO targets and validated failover/failback procedures.

On top of that foundation, the team shipped platform capabilities of its own: **Resource Import**, which onboards existing Terraform-managed resources under tiered governance; **Fleets**, a system-of-record built on Temporal, OPA, and RBAC; and **Cloud 2.0** migration automation.

## Results

Provisioning that formerly required manual coordination now runs self-service with zero manual steps, and every service added to the platform inherits the same security posture — CMEK, private networking, least-privilege IAM — by default rather than by review. One onboarding pattern covers every service the platform supports, which is what lets a 15+ engineer squad keep pace with a Fortune-5 program's demand.
