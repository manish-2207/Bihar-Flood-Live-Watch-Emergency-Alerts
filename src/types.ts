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

export interface BarrageInflow {
  id: string;
  name: string;
  nameHi: string;
  river: string;
  location: string;
  currentDischargeCusec: number;
  dangerDischargeCusec: number;
  trend: TrendDirection;
  gatesOpen: number;
  totalGates: number;
  downstreamImpactHours: number;
  status: 'critical' | 'alert' | 'normal';
  advisory: string;
  advisoryHi: string;
}

export interface WeatherForecastDistrict {
  id: string;
  district: string;
  districtHi: string;
  alertLevel: 'red' | 'orange' | 'yellow' | 'green';
  rainfallMm24h: number;
  prediction: string;
  predictionHi: string;
  windSpeedKmph: number;
}

export interface RoadBreachReport {
  id: string;
  highwayOrRoad: string;
  locationDetails: string;
  district: string;
  status: 'closed_submerged' | 'diverted' | 'caution_open' | 'normal';
  waterDepthCm: number;
  reportedBy: string;
  reportedAt: string;
  description: string;
  descriptionHi: string;
  verified: boolean;
}

export interface MissingPersonEntry {
  id: string;
  personName: string;
  age: number;
  gender: string;
  hometownVillage: string;
  district: string;
  lastSeenLocation: string;
  status: 'missing' | 'found_safe_in_camp' | 'rescued';
  currentCampLocation?: string;
  contactNumber: string;
  reportedAt: string;
  additionalInfo: string;
}

export interface ReliefSupplyInventory {
  id: string;
  district: string;
  dryRationKits: number;
  chlorineHalazoneTablets: number;
  babyFoodPackets: number;
  orsPackets: number;
  tarpaulinSheets: number;
  lastUpdated: string;
}

export interface VolunteerApplication {
  id: string;
  name: string;
  phone: string;
  district: string;
  role: 'boat_operator' | 'medical_volunteer' | 'ration_packer' | 'field_rescuer';
  availableFrom: string;
  notes: string;
}

export interface MapsPlaceResult {
  title: string;
  uri: string;
  address?: string;
  snippets?: string[];
  category?: string;
}

export interface MapsGroundingResponse {
  answer: string;
  mapsPlaces: MapsPlaceResult[];
  source: string;
  locationUsed?: { lat: number; lng: number; district: string };
  timestamp: string;
}

