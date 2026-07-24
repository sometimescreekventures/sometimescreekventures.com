/**
 * Single source of truth for site-wide facts and copy fragments.
 * The contact email is defined here and nowhere else.
 */

export const site = {
  name: 'Sometimes Creek Ventures',
  legalName: 'Sometimes Creek Ventures LLC',
  url: 'https://sometimescreekventures.com',
  description:
    'Cloud & AI solutions architecture for regulated, data-intensive platforms — architected and shipped end to end by Sean Denton, Sometimes Creek Ventures LLC.',
} as const;

export const person = {
  name: 'Sean Denton',
  title: 'Cloud & AI Solutions Architect',
  location: 'Georgetown, TX · remote-first',
  thesis:
    'Full-stack, infrastructure-deep engineering for regulated, data-intensive platforms — architected and shipped end to end.',
  education: 'The University of Texas at Austin — B.S., Petroleum Engineering',
  patent:
    'US 8,887,290 B1 — Method And System For Content Protection For A Browser Based Content Viewer',
} as const;

export const contact = {
  email: 'sean@sometimescreekventures.com',
  github: 'https://github.com/sometimescreekventures',
  linkedin: 'https://www.linkedin.com/in/sean-denton-ba02433/',
} as const;

/** All nine clients, presented as format-identical peers. */
export const clients = [
  'CVS Health',
  'Blue Origin',
  'Comcast',
  'Chick-fil-A',
  'Amtrak',
  'Clear',
  'Kubota',
  'Cardio',
  'Zonal',
] as const;

export const engagements = [
  {
    name: 'Architecture & strategy',
    detail:
      'System design, data modeling, cloud architecture, security & compliance review',
  },
  {
    name: 'Build & ship',
    detail:
      'Production services, cloud IaC, frontends — delivered, deployed, and documented',
  },
  {
    name: 'Rescue & optimize',
    detail:
      'Performance diagnosis, cost reduction, reliability and observability hardening',
  },
  {
    name: 'Fractional senior engineer',
    detail: 'Ongoing end-to-end ownership of a platform or critical subsystem',
  },
] as const;
