export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'info';

export type RiverStatus = 'severe' | 'danger' | 'warning' | 'normal';

export type TrendDirection = 'rising' | 'falling' | 'steady';

export interface RiverStation {
  id: string;
  name: string;
  hindiName: string;
  river: string;
  riverHindi: string;
  district: string;
  districtHindi: string;
  currentLevel: number; // in meters
  dangerLevel: number; // in meters
  warningLevel: number; // in meters
  highestFloodLevel: number; // record HFL in meters
  highestFloodYear: number;
  trend: TrendDirection;
  trendRateCmPerHour: number;
  dischargeCusec: number;
  status: RiverStatus;
  lastUpdated: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  history24h: {
    time: string;
    level: number;
  }[];
  notes?: string;
  notesHindi?: string;
}

export interface UrgentAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  titleHi: string;
  river: string;
  districtsAffected: string[];
  message: string;
  messageHi: string;
  issuedAt: string;
  actionRequired: string;
  actionRequiredHi: string;
  isFlashAlert: boolean;
}

export interface ReliefCamp {
  id: string;
  name: string;
  nameHi: string;
  district: string;
  block: string;
  address: string;
  capacity: number;
  occupied: number;
  status: 'open' | 'near_capacity' | 'full';
  foodAvailable: boolean;
  medicalAid: boolean;
  cleanWater: boolean;
  boatRescueStation: boolean;
  contactPerson: string;
  contactPhone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyContact {
  category: string;
  categoryHi: string;
  title: string;
  titleHi: string;
  phone: string;
  description: string;
  descriptionHi: string;
  availableHours: string;
}

export interface SOSDistressReport {
  id: string;
  name: string;
  phone: string;
  district: string;
  blockOrVillage: string;
  landmark: string;
  peopleCount: number;
  hasChildrenOrElderly: boolean;
  waterLevelCurrent: 'knee_level' | 'waist_level' | 'chest_level' | 'roof_top';
  urgency: 'critical_rescue' | 'food_water_needed' | 'medical_emergency' | 'safe_marked';
  notes: string;
  submittedAt: string;
  status: 'pending' | 'dispatched' | 'rescued';
}

export interface AIAdvisoryRequest {
  query: string;
  language: 'en' | 'hi';
  district?: string;
  currentSituation?: string;
}

export interface AIAdvisoryResponse {
  answer: string;
  keyUrgentActions: string[];
  safePrecautions: string[];
  emergencyContacts: string[];
  disclaimer: string;
}
