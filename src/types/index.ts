export type Language = 'am' | 'en';

export interface ProjectMilestone {
  id: string;
  titleAm: string;
  titleEn: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  code: string;
  nameAm: string;
  nameEn: string;
  client: string;
  location: string;
  contractValue: number; // in ETB
  budgetSpent: number;
  startDate: string;
  plannedEndDate: string;
  status: 'active' | 'on_hold' | 'completed' | 'delayed';
  progressPercentage: number;
  projectManager: string;
  siteEngineer: string;
  image?: string;
  description: string;
  milestones: ProjectMilestone[];
}

export interface StockTransaction {
  id: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  voucherNo: string;
  projectId?: string;
  receivedOrIssuedBy: string;
  notes?: string;
}

export interface Material {
  id: string;
  itemCode: string;
  nameAm: string;
  nameEn: string;
  category: 'cement' | 'steel' | 'aggregates' | 'blocks' | 'finishing' | 'fuel' | 'chemicals';
  unit: string;
  currentStock: number;
  minAlertStock: number;
  unitCost: number; // in ETB
  warehouseLocation: string;
  supplier: string;
  transactions: StockTransaction[];
}

export interface Machinery {
  id: string;
  code: string;
  nameAm: string;
  nameEn: string;
  type: 'excavator' | 'mixer' | 'crane' | 'loader' | 'roller' | 'dump_truck' | 'generator';
  plateNumber: string;
  assignedProjectId: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'idle';
  operatorName: string;
  dailyOperatingHours: number;
  totalOperatingHours: number;
  fuelConsumptionLph: number; // liters per hour
  lastServiceDate: string;
  nextServiceHours: number;
}

export interface Worker {
  id: string;
  empCode: string;
  fullNameAm: string;
  fullNameEn: string;
  role: string;
  employmentType: 'permanent' | 'contract' | 'daily_labor';
  dailyRate: number; // in ETB
  assignedProjectId: string;
  phone: string;
  status: 'active' | 'on_leave';
  nationalId: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  workerId: string;
  projectId: string;
  hoursWorked: number;
  overtimeHours: number;
  dailyPay: number;
  paidStatus: 'pending' | 'approved' | 'paid';
}

export interface BOQItem {
  id: string;
  itemNo: string;
  descriptionAm: string;
  descriptionEn: string;
  unit: string;
  contractQty: number;
  contractRate: number;
  executedQty: number;
  projectId: string;
}

export interface InterimPaymentCertificate {
  id: string;
  ipcNumber: string;
  projectId: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  retentionDeduction: number; // typically 5%
  advanceDeduction: number;
  vatAmount: number; // 15%
  netPayable: number;
  status: 'draft' | 'submitted' | 'certified' | 'paid';
  submissionDate: string;
  certificationDate?: string;
}

export interface SiteDailyLog {
  id: string;
  date: string;
  projectId: string;
  weather: 'sunny' | 'rainy' | 'cloudy' | 'heavy_rain';
  siteConditions: string;
  workforceHeadcount: {
    engineers: number;
    foremen: number;
    masons: number;
    carpenters: number;
    barBenders: number;
    dailyLaborers: number;
    operators: number;
  };
  machineryActiveCount: number;
  workExecutedAm: string;
  workExecutedEn: string;
  materialsReceivedAm: string;
  materialsReceivedEn: string;
  safetyIncidentsAm: string;
  safetyIncidentsEn: string;
  preparedBy: string;
  inspectedBy: string;
}

export interface QualityTest {
  id: string;
  testCode: string;
  projectId: string;
  structuralElementAm: string;
  structuralElementEn: string;
  castDate: string;
  testDate: string;
  testType: 'concrete_cube' | 'soil_compaction' | 'steel_tensile' | 'slump_test';
  targetStrengthMpa: number;
  achievedStrengthMpa: number;
  status: 'passed' | 'pending_28d' | 'failed';
  technician: string;
  remarks: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'projects'
  | 'materials'
  | 'machinery'
  | 'labor'
  | 'finance'
  | 'dailylog'
  | 'quality'
  | 'reports';
