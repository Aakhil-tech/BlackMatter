/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CarbonLogEntry {
  id: string;
  date: string;
  department: string;
  activityType: 'Electricity' | 'Fuel/Gas' | 'Business Travel' | 'Waste Management' | 'Water Consumption';
  amount: number; // Raw amount
  unit: string; // e.g. kWh, Gallons, Miles, Tons
  tco2e: number; // Calculated carbon equivalent
  notes: string;
}

export interface DepartmentESG {
  id: string;
  name: string;
  overallScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  headCount: number;
  emissionsYTD: number; // tCO2e YTD
  targetProgress: number; // % score or completion
}

export interface CSRAllocation {
  name: string;
  percentage: number;
  amountUSD: number;
  color: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  target: number;
  unit: string;
  completed: boolean;
  category: 'environmental' | 'social' | 'governance';
  rewardBadge?: string;
}

export interface CarbonOffsetOffering {
  id: string;
  project: string;
  location: string;
  costPerTonne: number; // USD
  tco2eAvailable: number;
  description: string;
  type: 'Forestry' | 'Wind Power' | 'Solar Farm' | 'Methane Capture';
}

export interface EcoBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  category: 'Ethics' | 'Financial' | 'Health & Safety' | 'Data Privacy' | 'Environmental Compliance';
  status: 'Compliant' | 'In Progress' | 'Action Required';
  dueDate: string;
  responsibleOfficer: string;
}

export interface GovernanceIncident {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'Investigating' | 'Resolved' | 'Action Taken';
  severity: 'Low' | 'Medium' | 'High';
}

export interface SocialMetrics {
  genderDiversity: {
    female: number;
    male: number;
    nonbinary: number;
  };
  minorityRepresentation: number; // percentage
  employeeSatisfaction: number; // percentage index
  trainingHoursPerEmployee: number;
  communityInvestmentUSD: number;
  workplaceSafetyIncidents: number;
}

export interface ESGThresholdSettings {
  targetCarbonYTD: number; // tCO2e
  governanceComplianceTarget: number; // %
  socialSatisfactionTarget: number; // %
  alertNotifications: boolean;
  weeklySummaries: boolean;
  riskWarningThreshold: number; // %
}
