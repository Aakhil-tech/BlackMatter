/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CarbonLogEntry,
  DepartmentESG,
  CSRAllocation,
  EcoChallenge,
  CarbonOffsetOffering,
  EcoBadge,
  ComplianceItem,
  GovernanceIncident,
  SocialMetrics,
  ESGThresholdSettings
} from './types';

export const INITIAL_CARBON_LOGS: CarbonLogEntry[] = [
  {
    id: 'log-1',
    date: '2026-01-15',
    department: 'Operations',
    activityType: 'Electricity',
    amount: 120000,
    unit: 'kWh',
    tco2e: 48.5,
    notes: 'Main plant assembly line operations.'
  },
  {
    id: 'log-2',
    date: '2026-02-10',
    department: 'Logistics',
    activityType: 'Fuel/Gas',
    amount: 4500,
    unit: 'Gallons',
    tco2e: 39.8,
    notes: 'Fleet delivery fuel consumption.'
  },
  {
    id: 'log-3',
    date: '2026-03-05',
    department: 'Facilities',
    activityType: 'Waste Management',
    amount: 12.5,
    unit: 'Tons',
    tco2e: 25.2,
    notes: 'Quarterly facility landfill disposal.'
  },
  {
    id: 'log-4',
    date: '2026-04-12',
    department: 'Corporate',
    activityType: 'Business Travel',
    amount: 85000,
    unit: 'Miles',
    tco2e: 18.9,
    notes: 'Global executive summits.'
  },
  {
    id: 'log-5',
    date: '2026-05-18',
    department: 'Operations',
    activityType: 'Electricity',
    amount: 110000,
    unit: 'kWh',
    tco2e: 44.2,
    notes: 'Optimization of cooling towers reduced draw.'
  },
  {
    id: 'log-6',
    date: '2026-06-20',
    department: 'Logistics',
    activityType: 'Fuel/Gas',
    amount: 3800,
    unit: 'Gallons',
    tco2e: 33.6,
    notes: 'Transitioned 3 delivery vans to hybrid engines.'
  },
  {
    id: 'log-7',
    date: '2026-07-02',
    department: 'Facilities',
    activityType: 'Water Consumption',
    amount: 320000,
    unit: 'Gallons',
    tco2e: 8.4,
    notes: 'Water recycling plant backwash cycle.'
  }
];

export const INITIAL_DEPARTMENTS: DepartmentESG[] = [
  {
    id: 'dept-ops',
    name: 'Operations',
    overallScore: 92,
    environmentalScore: 94,
    socialScore: 90,
    governanceScore: 92,
    headCount: 340,
    emissionsYTD: 142.5,
    targetProgress: 92
  },
  {
    id: 'dept-log',
    name: 'Logistics',
    overallScore: 78,
    environmentalScore: 72,
    socialScore: 81,
    governanceScore: 81,
    headCount: 180,
    emissionsYTD: 112.4,
    targetProgress: 78
  },
  {
    id: 'dept-corp',
    name: 'Corporate',
    overallScore: 64,
    environmentalScore: 58,
    socialScore: 65,
    governanceScore: 69,
    headCount: 95,
    emissionsYTD: 42.8,
    targetProgress: 64
  },
  {
    id: 'dept-fac',
    name: 'Facilities',
    overallScore: 45,
    environmentalScore: 38,
    socialScore: 48,
    governanceScore: 49,
    headCount: 65,
    emissionsYTD: 84.1,
    targetProgress: 45
  }
];

export const INITIAL_CSR_ALLOCATIONS: CSRAllocation[] = [
  {
    name: 'Community Outreach',
    percentage: 45,
    amountUSD: 1080000,
    color: '#cba6f7' // Mauve
  },
  {
    name: 'Reforestation',
    percentage: 35,
    amountUSD: 840000,
    color: '#74c7ec' // Sapphire
  },
  {
    name: 'Clean Energy Ed.',
    percentage: 20,
    amountUSD: 480000,
    color: '#fab387' // Peach
  }
];

export const INITIAL_CHALLENGES: EcoChallenge[] = [
  {
    id: 'chal-1',
    title: 'Zero Waste Week',
    description: 'Reduce corporate office paper and landfill waste to less than 1kg per employee.',
    points: 250,
    progress: 0.85,
    target: 1.0,
    unit: 'weeks',
    completed: false,
    category: 'environmental',
    rewardBadge: 'Zero Waste Pioneer'
  },
  {
    id: 'chal-2',
    title: 'E-Learning Campaign',
    description: 'Engage 95% of active staff in completing the ESG Code of Ethical Conduct modules.',
    points: 180,
    progress: 95,
    target: 95,
    unit: '% complete',
    completed: true,
    category: 'governance',
    rewardBadge: 'Ethics Ambassador'
  },
  {
    id: 'chal-3',
    title: 'Diverse Mentorship Link',
    description: 'Introduce structured peer mentorship sessions matching minority graduates with Senior VPs.',
    points: 300,
    progress: 8,
    target: 10,
    unit: 'matches',
    completed: false,
    category: 'social',
    rewardBadge: 'Inclusion Catalyst'
  },
  {
    id: 'chal-4',
    title: 'Renewable Upgrade Phase 1',
    description: 'Install and activate solar panels on operations hangar bay B.',
    points: 500,
    progress: 0.6,
    target: 1.0,
    unit: 'activation',
    completed: false,
    category: 'environmental',
    rewardBadge: 'Solar Pioneer'
  }
];

export const INITIAL_OFFSET_OFFERINGS: CarbonOffsetOffering[] = [
  {
    id: 'offset-1',
    project: 'Amazonian Canopy Protection',
    location: 'Acre, Brazil',
    costPerTonne: 15.0,
    tco2eAvailable: 45000,
    description: 'Halting illegal deforestation and supporting sustainable local agriculture through certified community protection programs.',
    type: 'Forestry'
  },
  {
    id: 'offset-2',
    project: 'Patagonian Wind Grid Integration',
    location: 'Chubut, Argentina',
    costPerTonne: 12.5,
    tco2eAvailable: 75000,
    description: 'Supplying zero-emission energy to rural power networks, offsetting regional diesel generators.',
    type: 'Wind Power'
  },
  {
    id: 'offset-3',
    project: 'Thar Desert Solar Initiative',
    location: 'Rajasthan, India',
    costPerTonne: 11.0,
    tco2eAvailable: 120000,
    description: 'Promoting carbon-neutral local industry with utility-scale photovoltaic expansion.',
    type: 'Solar Farm'
  },
  {
    id: 'offset-4',
    project: 'Appalachian Landfill Methane Capture',
    location: 'Kentucky, USA',
    costPerTonne: 18.0,
    tco2eAvailable: 28000,
    description: 'Extracting waste methane directly from decomposing landfills and converting it to electricity.',
    type: 'Methane Capture'
  }
];

export const INITIAL_BADGES: EcoBadge[] = [
  {
    id: 'badge-1',
    title: 'Carbon Cutter',
    description: 'Log and reduce corporate emissions for 3 consecutive months.',
    icon: 'Zap',
    unlocked: true,
    unlockedAt: '2026-03-12'
  },
  {
    id: 'badge-2',
    title: 'Ethics Ambassador',
    description: 'Achieve 95% compliance training completion across all departments.',
    icon: 'ShieldCheck',
    unlocked: true,
    unlockedAt: '2026-04-10'
  },
  {
    id: 'badge-3',
    title: 'Green Investor',
    description: 'Purchase your first 50 tonnes of verified high-integrity carbon offsets.',
    icon: 'Leaf',
    unlocked: false
  },
  {
    id: 'badge-4',
    title: 'Inclusion Catalyst',
    description: 'Establish and hit target social outreach and mentorship matching scores.',
    icon: 'HeartHandshake',
    unlocked: false
  }
];

export const INITIAL_COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: 'comp-1',
    title: 'Anti-Bribery & Corruption Audit',
    description: 'Annual certification of anti-money laundering and client due-diligence protocols.',
    category: 'Ethics',
    status: 'Compliant',
    dueDate: '2026-11-30',
    responsibleOfficer: 'Sarah Chen (Chief Compliance Officer)'
  },
  {
    id: 'comp-2',
    title: 'Scope 1 & 2 Emissions Audit',
    description: 'External validation of carbon footprints across industrial assets.',
    category: 'Environmental Compliance',
    status: 'In Progress',
    dueDate: '2026-08-15',
    responsibleOfficer: 'Marcus Vance (VP Sustainability)'
  },
  {
    id: 'comp-3',
    title: 'Factory Health & Air Quality Safety',
    description: 'Recertification of warehouse ventilation and physical particulate emissions guidelines.',
    category: 'Health & Safety',
    status: 'Action Required',
    dueDate: '2026-07-28',
    responsibleOfficer: 'Danielle Kross (Facilities Director)'
  },
  {
    id: 'comp-4',
    title: 'GDPR & Global Data Privacy Audit',
    description: 'Verification of server encryption protocols and staff client-data handler access logs.',
    category: 'Data Privacy',
    status: 'Compliant',
    dueDate: '2026-12-10',
    responsibleOfficer: 'Liam Murphy (Chief Information Officer)'
  }
];

export const INITIAL_INCIDENTS: GovernanceIncident[] = [
  {
    id: 'inc-1',
    date: '2026-05-14',
    title: 'HVAC Air Filter Fault',
    description: 'Transient dust leak on Sector C filter block. Promptly resolved and staff evacuated safely with zero casualties.',
    status: 'Resolved',
    severity: 'Medium'
  },
  {
    id: 'inc-2',
    date: '2026-06-29',
    title: 'Conflict of Interest Check',
    description: 'Internal audit identified supplier bidding similarity. Vendor replaced and guidelines updated.',
    status: 'Resolved',
    severity: 'Low'
  },
  {
    id: 'inc-3',
    date: '2026-07-08',
    title: 'Anomalous Carbon Log Alert',
    description: 'High standard variance detected on Logistics fleet reports. Investigating calibration values.',
    status: 'Investigating',
    severity: 'Low'
  }
];

export const INITIAL_SOCIAL_METRICS: SocialMetrics = {
  genderDiversity: {
    female: 42,
    male: 53,
    nonbinary: 5
  },
  minorityRepresentation: 28,
  employeeSatisfaction: 84,
  trainingHoursPerEmployee: 36,
  communityInvestmentUSD: 1080000,
  workplaceSafetyIncidents: 1
};

export const INITIAL_SETTINGS: ESGThresholdSettings = {
  targetCarbonYTD: 500, // max target tons
  governanceComplianceTarget: 100,
  socialSatisfactionTarget: 85,
  alertNotifications: true,
  weeklySummaries: false,
  riskWarningThreshold: 80
};
