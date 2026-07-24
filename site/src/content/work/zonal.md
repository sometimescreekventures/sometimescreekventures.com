---
title: 'An embedded performance rescue, proven on dashboards'
client: 'Zonal'
slug: 'zonal'
role: 'Senior engineer, AI-augmented performance pod'
summary: 'Diagnosed thread-pool and DB-connection-pool starvation in a mobile-ordering API; p95 latency under load fell ~99% on core endpoints, with every gain proven against baselines before merge.'
stats:
  - label: 'p95 reduction on core endpoints, under load'
    value: '~99%'
  - label: 'auth-check p95 under load'
    value: '36.0s → 95ms'
  - label: 'venue-tables p95 under load'
    value: '44.7s → 169ms'
  - label: 'venue-summary p95 under load'
    value: '11.0s → 528ms'
  - label: 'request timeouts eliminated'
    value: '~1 in 10'
stack:
  - k6
  - TypeScript
  - esbuild
  - Grafana
  - InfluxDB
  - Azure DevOps
  - ColdFusion (legacy)
order: 3
---

## Context

Zonal's mobile-ordering API runs on a legacy ColdFusion platform. Under load, core endpoints were collapsing into multi-second tail latency, and roughly one request in ten was timing out. Sean joined a two-person, AI-augmented performance pod embedded to fix it.

## Role

Senior engineer on the pod, engaged through Sometimes Creek Ventures. The pod's mandate was not just to make the system faster but to *prove* every improvement — no change promoted on intuition.

## What was built

Before touching the API, the pod built the instruments to measure it. From scratch:

- A **k6 load-testing framework** in TypeScript with an esbuild pipeline — weighted traffic profiles that mirror real usage, three-bucket error classification, and safety gates so a test can't take down a shared environment.
- A **live observability stack** on Grafana and InfluxDB, so every run renders as dashboards the whole team can read.
- **Azure DevOps pipelines** to deploy and run self-hosted k6, making load tests a repeatable, one-click operation rather than a bespoke event.

With baselines established, the diagnosis followed the data: thread-pool and DB-connection-pool starvation was causing tail collapse under load. Requests weren't slow because the work was slow — they were queuing for threads and connections that never freed up fast enough.

## Results

Measured in the load-test environment under a realistic weighted traffic profile, p95 latency on core endpoints fell by roughly 99%, validated against the recorded baselines:

- **auth-check:** 36.0s → 95ms
- **venue-tables:** 44.7s → 169ms
- **venue-summary:** 11.0s → 528ms

The ~1-in-10 request timeouts were eliminated under the same test conditions.

## The methodology is the product

Every change followed the same loop: baseline → change (with AI in the loop) → deploy → measure → prove against the baseline → promote. Nothing merged until the dashboards showed the gain. The framework, the observability stack, and the discipline stayed with Zonal — the rescue left behind the machinery to keep the system honest.
