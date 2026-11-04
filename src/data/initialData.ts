import { 
  Project, 
  Material, 
  Machinery, 
  Worker, 
  AttendanceRecord, 
  BOQItem, 
  InterimPaymentCertificate, 
  SiteDailyLog, 
  QualityTest 
} from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    code: 'PRJ-AA-01',
    nameAm: 'ቦሌ አትላንቲክ ህንጻ ፕሮጀክት (B+G+18)',
    nameEn: 'Bole Atlantic Mixed-Use Highrise (B+G+18)',
    client: 'አትላንቲክ ሪል እስቴት ኃ/የተ/የግ/ማ',
    location: 'አዲስ አበባ፣ ቦሌ መድኃኔዓለም',
    contractValue: 485000000, // 485M ETB
    budgetSpent: 265000000,
    startDate: '2025-01-15',
    plannedEndDate: '2027-04-30',
    status: 'active',
    progressPercentage: 62,
    projectManager: 'ኢ/ር አለማየሁ በቀለ',
    siteEngineer: 'ኢ/ር ትዕግስት ሃይሉ',
    image: '/src/assets/images/construction_site_hero_1793174257913.jpg',
    description: 'የ 18 ፎቅ ባለ ብዙ አገልግሎት ህንጻ (የንግድ ማዕከል፣ ቢሮዎች እና ዘመናዊ አፓርታማዎች)',
    milestones: [
      { id: 'm1', titleAm: 'የመሰረት ቁፋሮና ካስማ ስራዎች', titleEn: 'Substructure Excavation & Piling', dueDate: '2025-04-10', completed: true },
      { id: 'm2', titleAm: 'የከርሰ-ምድር (Basement) ኮንክሪት ስራ', titleEn: 'Basement RC Structure', dueDate: '2025-09-20', completed: true },
      { id: 'm3', titleAm: 'እስከ 10ኛ ፎቅ የሰሌዳና አምድ ኮንክሪት', titleEn: 'Superstructure Slab up to 10th Floor', dueDate: '2026-03-15', completed: true },
      { id: 'm4', titleAm: 'የ 18ኛ ፎቅ ጣሪያ ሰሌዳ ማጠናቀቅ', titleEn: 'Roof Top Slab Casting (18th Floor)', dueDate: '2026-11-30', completed: false },
      { id: 'm5', titleAm: 'የኤሌክትሮ-ሜካኒካልና አጨራረስ ስራ', titleEn: 'Electro-mechanical & Finishing Works', dueDate: '2027-03-31', completed: false }
    ]
  },
  {
    id: 'prj-2',
    code: 'PRJ-HW-02',
    nameAm: 'ሃዋሳ ኢንዱስትሪያል ሎጂስቲክስ ሼዶች',
    nameEn: 'Hawassa Industrial Logistics Sheds',
    client: 'የኢትዮጵያ ኢንዱስትሪ ፓርኮች ልማት ኮርፖሬሽን',
    location: 'ሲዳማ ክልል፣ ሃዋሳ',
    contractValue: 240000000,
    budgetSpent: 195000000,
    startDate: '2025-06-01',
    plannedEndDate: '2026-12-15',
    status: 'active',
    progressPercentage: 81,
    projectManager: 'ኢ/ር ዳዊት መኮንን',
    siteEngineer: 'ኢ/ር ዮናስ ተስፋዬ',
    image: '/src/assets/images/construction_machinery_1793174258556.jpg',
    description: 'ባለከፍተኛ ደረጃ የብረት መዋቅር (Steel Structure) ማከማቻ መጋዘኖች እና አስፋልት ኮንክሪት መንገዶች',
    milestones: [
      { id: 'm21', titleAm: 'የመሬት ዝግጅትና የኮንክሪት ፉቲንግ', titleEn: 'Site Clearing & Pad Footings', dueDate: '2025-08-30', completed: true },
      { id: 'm22', titleAm: 'የብረት ትረስ መዋቅር ተከላ (Steel Truss)', titleEn: 'Structural Steel Truss Erection', dueDate: '2026-02-28', completed: true },
      { id: 'm23', titleAm: 'የኢፖክሲ ወለልና ጣሪያ ቆርቆሮ ገጠማ', titleEn: 'Epoxy Flooring & Roof Cladding', dueDate: '2026-08-15', completed: true },
      { id: 'm24', titleAm: 'የውጪ ግቢ አስፋልትና መብራት', titleEn: 'External Pavement & High-Mast Lighting', dueDate: '2026-12-10', completed: false }
    ]
  },
  {
    id: 'prj-3',
    code: 'PRJ-BD-03',
    nameAm: 'ባሕር ዳር ጣና ሌክቪው ኮንቬንሽን ሴንተር',
    nameEn: 'Bahir Dar Lakeview Convention Center',
    client: 'የአማራ ክልል የከተማና መሰረተ ልማት ቢሮ',
    location: 'ባሕር ዳር፣ ጣና ሐይቅ ዳርቻ',
    contractValue: 350000000,
    budgetSpent: 85000000,
    startDate: '2026-02-01',
    plannedEndDate: '2027-10-30',
    status: 'active',
    progressPercentage: 28,
    projectManager: 'ኢ/ር ሰላማዊት ታደሰ',
    siteEngineer: 'ኢ/ር ጌታቸው አበበ',
    description: '3,000 ሰዎችን የሚያስተናግድ ዘመናዊ የስብሰባ አዳራሽ፣ ኤግዚቢሽን ማዕከል እና ፓርኪንግ',
    milestones: [
      { id: 'm31', titleAm: 'ጥልቅ ቁፋሮና የከርሰ ምድር ውሃ ማስወጣት', titleEn: 'Deep Excavation & Dewatering', dueDate: '2026-04-30', completed: true },
      { id: 'm32', titleAm: 'የራፍት ፋውንዴሽን ኮንክሪት (Raft Foundation)', titleEn: 'Mass Raft Foundation Concreting', dueDate: '2026-08-15', completed: true },
      { id: 'm33', titleAm: 'የአዳራሽ ረጅም ስፓን የብረት መዋቅር', titleEn: 'Auditorium Long Span Truss', dueDate: '2027-02-20', completed: false }
    ]
  },
  {
    id: 'prj-4',
    code: 'PRJ-DD-04',
    nameAm: 'ድሬዳዋ - መኢሶ የጭነት መተላለፊያ መንገድ',
    nameEn: 'Dire Dawa - Meiso Heavy Freight Corridor',
    client: 'የኢትዮጵያ መንገዶች ባለስልጣን (ERA)',
    location: 'ድሬዳዋ አስተዳደር',
    contractValue: 620000000,
    budgetSpent: 510000000,
    startDate: '2024-09-10',
    plannedEndDate: '2026-11-20',
    status: 'delayed',
    progressPercentage: 88,
    projectManager: 'ኢ/ር ክፍሌ ገብሬ',
    siteEngineer: 'ኢ/ር መሐመድ ኑር',
    description: '42 ኪ.ሜ የከባድ መኪና አስፋልት መንገድና 3 የኮንክሪት ድልድዮች ግንባታ',
    milestones: [
      { id: 'm41', titleAm: 'የመንገድ ጠረጋና የመሬት ሙሌት', titleEn: 'Earthwork & Sub-base Formation', dueDate: '2025-05-15', completed: true },
      { id: 'm42', titleAm: 'የአስፋልት ቤዝ ኮርስ (Binder Course)', titleEn: 'Asphalt Binder Layer Laying', dueDate: '2026-01-30', completed: true },
      { id: 'm43', titleAm: 'የድልድይ ዴክ ሰሌዳዎች ማጠናቀቅ', titleEn: 'Bridge Deck Superstructure', dueDate: '2026-07-30', completed: true },
      { id: 'm44', titleAm: 'የመጨረሻ የመልበሻ አስፋልት (Wearing Course)', titleEn: 'Wearing Course & Road Markings', dueDate: '2026-11-15', completed: false }
    ]
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    itemCode: 'MAT-CEM-01',
    nameAm: 'ዳንጎቴ ኦፒሲ ሲሚንቶ 42.5N',
    nameEn: 'Dangote OPC Cement 42.5N',
    category: 'cement',
    unit: 'ኩንታል (Qtl)',
    currentStock: 2450,
    minAlertStock: 600,
    unitCost: 1850,
    warehouseLocation: 'ዋና መጋዘን - ቃሊቲ',
    supplier: 'ዳንጎቴ ሲሚንቶ ኢትዮጵያ',
    transactions: [
      { id: 'tx-1', type: 'in', quantity: 1000, date: '2026-10-22', voucherNo: 'GRN-9021', receivedOrIssuedBy: 'ተሾመ ካሳ', notes: 'ከፋብሪካ ቀጥታ ገቢ' },
      { id: 'tx-2', type: 'out', quantity: 350, date: '2026-10-25', voucherNo: 'SIV-4012', projectId: 'prj-1', receivedOrIssuedBy: 'ኢ/ር ትዕግስት', notes: 'ለ 11ኛ ፎቅ አምድ ኮንክሪት' }
    ]
  },
  {
    id: 'mat-2',
    itemCode: 'MAT-CEM-02',
    nameAm: 'ሙገር ፖርትላንድ ፖዞላና ሲሚንቶ (PPC)',
    nameEn: 'Mugher PPC Cement',
    category: 'cement',
    unit: 'ኩንታል (Qtl)',
    currentStock: 420,
    minAlertStock: 500, // Trigger low stock alert!
    unitCost: 1650,
    warehouseLocation: 'ቦሌ ሳይት መጋዘን',
    supplier: 'ሙገር ሲሚንቶ ኢንተርፕራይዝ',
    transactions: [
      { id: 'tx-3', type: 'in', quantity: 600, date: '2026-10-18', voucherNo: 'GRN-8940', receivedOrIssuedBy: 'ተሾመ ካሳ' },
      { id: 'tx-4', type: 'out', quantity: 180, date: '2026-10-26', voucherNo: 'SIV-4033', projectId: 'prj-1', receivedOrIssuedBy: 'ፎርማን ታደሰ', notes: 'ለግድግዳ ፕላስተር ስራ' }
    ]
  },
  {
    id: 'mat-3',
    itemCode: 'MAT-STL-16',
    nameAm: 'ሪብድ የብረት አርማታ Ø16mm (Grade 60)',
    nameEn: 'Deformed Reinforcement Bar Ø16mm',
    category: 'steel',
    unit: 'ቶን (Ton)',
    currentStock: 85,
    minAlertStock: 25,
    unitCost: 145000,
    warehouseLocation: 'ዋና መጋዘን - ቃሊቲ',
    supplier: 'አቃቂ መሰረታዊ የብረታ ብረት ኢንዱስትሪ',
    transactions: [
      { id: 'tx-5', type: 'in', quantity: 40, date: '2026-10-10', voucherNo: 'GRN-8812', receivedOrIssuedBy: 'ተሾመ ካሳ' },
      { id: 'tx-6', type: 'out', quantity: 12, date: '2026-10-24', voucherNo: 'SIV-3998', projectId: 'prj-1', receivedOrIssuedBy: 'ኢ/ር ትዕግስት', notes: 'ለሰሌዳ ዋና ብረት ዝርጋታ' }
    ]
  },
  {
    id: 'mat-4',
    itemCode: 'MAT-STL-12',
    nameAm: 'ሪብድ የብረት አርማታ Ø12mm (Grade 60)',
    nameEn: 'Deformed Reinforcement Bar Ø12mm',
    category: 'steel',
    unit: 'ቶን (Ton)',
    currentStock: 64,
    minAlertStock: 20,
    unitCost: 146000,
    warehouseLocation: 'ዋና መጋዘን - ቃሊቲ',
    supplier: 'ኮሜት ብረታ ብረት ማኑፋክቸሪንግ',
    transactions: [
      { id: 'tx-7', type: 'in', quantity: 30, date: '2026-10-15', voucherNo: 'GRN-8870', receivedOrIssuedBy: 'ተሾመ ካሳ' }
    ]
  },
  {
    id: 'mat-5',
    itemCode: 'MAT-SND-01',
    nameAm: 'የወንዝ ንጹህ አሸዋ (Washed River Sand)',
    nameEn: 'Washed River Sand for Concreting',
    category: 'aggregates',
    unit: 'ሜትር ኩብ (m³)',
    currentStock: 680,
    minAlertStock: 200,
    unitCost: 2800,
    warehouseLocation: 'ቦሌ ሳይት ክፍት ሜዳ',
    supplier: 'መቂ-ዝዋይ አሸዋ አቅራቢዎች ህብረት ስራ',
    transactions: [
      { id: 'tx-8', type: 'in', quantity: 180, date: '2026-10-26', voucherNo: 'GRN-9104', receivedOrIssuedBy: 'ሳይት ክለርክ ኤፍሬም' }
    ]
  },
  {
    id: 'mat-6',
    itemCode: 'MAT-AGG-02',
    nameAm: 'የተፈጨ ባሳልት ኮረት ቁጥር 02 (19mm)',
    nameEn: 'Crushed Basalt Aggregate 02 (19mm)',
    category: 'aggregates',
    unit: 'ሜትር ኩብ (m³)',
    currentStock: 920,
    minAlertStock: 250,
    unitCost: 2400,
    warehouseLocation: 'ቃሊቲ ክሬሸር ሳይት',
    supplier: 'ዘመን ኳሪ እና ክሬሸር ፕላንት',
    transactions: []
  },
  {
    id: 'mat-7',
    itemCode: 'MAT-BLK-20',
    nameAm: 'ባለ 20 ሳ.ሜ ሆሎው ኮንክሪት ብሎኬት (HCB Class A)',
    nameEn: '20cm Hollow Concrete Block (Class A)',
    category: 'blocks',
    unit: 'ፍሬ (Pcs)',
    currentStock: 18500,
    minAlertStock: 5000,
    unitCost: 58,
    warehouseLocation: 'ቦሌ ሳይት ግቢ',
    supplier: 'ዘመን ብሎኬት ማምረቻ',
    transactions: [
      { id: 'tx-9', type: 'out', quantity: 2400, date: '2026-10-26', voucherNo: 'SIV-4040', projectId: 'prj-1', receivedOrIssuedBy: 'ፎርማን ታደሰ', notes: 'ለውስጥ ክፍልፋይ ግድግዳ' }
    ]
  },
  {
    id: 'mat-8',
    itemCode: 'MAT-FUL-DSL',
    nameAm: 'ናፍጣ ለከባድ ማሽነሪዎች (Automotive Diesel)',
    nameEn: 'Heavy Equipment Diesel Fuel',
    category: 'fuel',
    unit: 'ሊትር (Liter)',
    currentStock: 4800,
    minAlertStock: 2000,
    unitCost: 118,
    warehouseLocation: 'ተንቀሳቃሽ ታንከር - ቦሌና ሃዋሳ',
    supplier: 'ቶታል ኢነርጂስ ኢትዮጵያ',
    transactions: [
      { id: 'tx-10', type: 'out', quantity: 650, date: '2026-10-26', voucherNo: 'SIV-4045', receivedOrIssuedBy: 'ኢ/ር ዳዊት', notes: 'ለኤክስካቫተር እና ክሬን' }
    ]
  }
];

export const INITIAL_MACHINERY: Machinery[] = [
  {
    id: 'eqp-1',
    code: 'EQP-EXC-01',
    nameAm: 'ካት 330D ሃይድሮሊክ ኤክስካቫተር (CAT 330D)',
    nameEn: 'CAT 330D Hydraulic Excavator',
    type: 'excavator',
    plateNumber: 'ኮድ 3-A1208',
    assignedProjectId: 'prj-3',
    status: 'operational',
    operatorName: 'ሙሉጌታ አያሌው',
    dailyOperatingHours: 7.5,
    totalOperatingHours: 4210,
    fuelConsumptionLph: 24,
    lastServiceDate: '2026-09-15',
    nextServiceHours: 4500
  },
  {
    id: 'eqp-2',
    code: 'EQP-CRN-02',
    nameAm: 'ዞምሊዮን 50 ቶን ተንቀሳቃሽ ክሬን (Zoomlion 50T)',
    nameEn: 'Zoomlion 50T Rough Terrain Mobile Crane',
    type: 'crane',
    plateNumber: 'ኮድ 3-B4590',
    assignedProjectId: 'prj-1',
    status: 'operational',
    operatorName: 'በርሃኑ ወንድሙ',
    dailyOperatingHours: 6.0,
    totalOperatingHours: 2980,
    fuelConsumptionLph: 18,
    lastServiceDate: '2026-10-02',
    nextServiceHours: 3200
  },
  {
    id: 'eqp-3',
    code: 'EQP-MIX-03',
    nameAm: 'ካርሚክስ 3.5m³ ተንቀሳቃሽ ኮንክሪት ሚክሰር (Carmix 3.5)',
    nameEn: 'Carmix 3.5m³ Self-Loading Concrete Mixer',
    type: 'mixer',
    plateNumber: 'ኮድ 3-C8814',
    assignedProjectId: 'prj-2',
    status: 'operational',
    operatorName: 'ሰለሞን አስፋው',
    dailyOperatingHours: 8.0,
    totalOperatingHours: 3640,
    fuelConsumptionLph: 16,
    lastServiceDate: '2026-08-20',
    nextServiceHours: 3800
  },
  {
    id: 'eqp-4',
    code: 'EQP-TRK-04',
    nameAm: 'ሲኖትራክ ሆዎ 16m³ ዳምፕ ትራክ (Sinotruk HOWO)',
    nameEn: 'Sinotruk HOWO 16m³ Heavy Dump Truck',
    type: 'dump_truck',
    plateNumber: 'ኮድ 3-78234',
    assignedProjectId: 'prj-4',
    status: 'maintenance',
    operatorName: 'ደረጀ በቀለ',
    dailyOperatingHours: 0,
    totalOperatingHours: 6120,
    fuelConsumptionLph: 32,
    lastServiceDate: '2026-10-25',
    nextServiceHours: 6200
  },
  {
    id: 'eqp-5',
    code: 'EQP-LDR-05',
    nameAm: 'ኮማትሱ WA380 ዊል ሎደር (Komatsu Loader)',
    nameEn: 'Komatsu WA380 Wheel Loader',
    type: 'loader',
    plateNumber: 'ኮድ 3-D3109',
    assignedProjectId: 'prj-4',
    status: 'operational',
    operatorName: 'ግርማ ዘውዴ',
    dailyOperatingHours: 7.0,
    totalOperatingHours: 5100,
    fuelConsumptionLph: 22,
    lastServiceDate: '2026-09-28',
    nextServiceHours: 5300
  },
  {
    id: 'eqp-6',
    code: 'EQP-GEN-06',
    nameAm: 'ፐርኪንስ 150 kVA ጸጥተኛ ጀነሬተር (Perkins Generator)',
    nameEn: 'Perkins 150 kVA Silent Standby Generator',
    type: 'generator',
    plateNumber: 'መሳሪያ-GEN-06',
    assignedProjectId: 'prj-1',
    status: 'idle',
    operatorName: 'ኤሌክትሪሻን ወርቁ',
    dailyOperatingHours: 2.0,
    totalOperatingHours: 1140,
    fuelConsumptionLph: 19,
    lastServiceDate: '2026-09-01',
    nextServiceHours: 1300
  }
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'w-1',
    empCode: 'EMP-001',
    fullNameAm: 'አለማየሁ በቀለ',
    fullNameEn: 'Alemayehu Bekele',
    role: 'Project Manager (ሲቪል መሃንዲስ)',
    employmentType: 'permanent',
    dailyRate: 3200,
    assignedProjectId: 'prj-1',
    phone: '+251 911 234567',
    status: 'active',
    nationalId: 'ET-AA-098231'
  },
  {
    id: 'w-2',
    empCode: 'EMP-002',
    fullNameAm: 'ትዕግስት ሃይሉ',
    fullNameEn: 'Tigist Hailu',
    role: 'Site Engineer (የሳይት መሃንዲስ)',
    employmentType: 'permanent',
    dailyRate: 2400,
    assignedProjectId: 'prj-1',
    phone: '+251 912 345678',
    status: 'active',
    nationalId: 'ET-AA-112344'
  },
  {
    id: 'w-3',
    empCode: 'EMP-003',
    fullNameAm: 'ታደሰ ወርቁ',
    fullNameEn: 'Tadesse Worku',
    role: 'General Foreman (ዋና ፎርማን)',
    employmentType: 'permanent',
    dailyRate: 1800,
    assignedProjectId: 'prj-1',
    phone: '+251 920 445566',
    status: 'active',
    nationalId: 'ET-OR-441209'
  },
  {
    id: 'w-4',
    empCode: 'EMP-014',
    fullNameAm: 'ገብረእግዚአብሔር ሃብቴ',
    fullNameEn: 'Gebreigziabher Habte',
    role: 'Master Mason (ዋና ግንበኛ)',
    employmentType: 'contract',
    dailyRate: 950,
    assignedProjectId: 'prj-1',
    phone: '+251 933 556677',
    status: 'active',
    nationalId: 'ET-TG-993210'
  },
  {
    id: 'w-5',
    empCode: 'EMP-021',
    fullNameAm: 'ተክሌ አበራ',
    fullNameEn: 'Tekle Abera',
    role: 'Head Bar Bender (የብረት አሳሪ መሪ)',
    employmentType: 'contract',
    dailyRate: 900,
    assignedProjectId: 'prj-1',
    phone: '+251 944 667788',
    status: 'active',
    nationalId: 'ET-AA-558291'
  },
  {
    id: 'w-6',
    empCode: 'EMP-035',
    fullNameAm: 'አብዱራህማን ሰይድ',
    fullNameEn: 'Abdurahman Seyid',
    role: 'Shuttering Carpenter (የፎርምዎርክ አናጺ)',
    employmentType: 'contract',
    dailyRate: 850,
    assignedProjectId: 'prj-2',
    phone: '+251 915 778899',
    status: 'active',
    nationalId: 'ET-SD-881230'
  },
  {
    id: 'w-7',
    empCode: 'EMP-108',
    fullNameAm: 'ጫላ ደምሴ',
    fullNameEn: 'Chala Demissie',
    role: 'Daily Laborer (ረዳት ሰራተኛ)',
    employmentType: 'daily_labor',
    dailyRate: 450,
    assignedProjectId: 'prj-1',
    phone: '+251 966 112233',
    status: 'active',
    nationalId: 'ET-OR-102938'
  },
  {
    id: 'w-8',
    empCode: 'EMP-109',
    fullNameAm: 'ብርሃኔ መኮንን',
    fullNameEn: 'Birhane Mekonnen',
    role: 'Daily Laborer (ረዳት ሰራተኛ)',
    employmentType: 'daily_labor',
    dailyRate: 450,
    assignedProjectId: 'prj-1',
    phone: '+251 977 223344',
    status: 'active',
    nationalId: 'ET-AM-667788'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', date: '2026-10-27', workerId: 'w-1', projectId: 'prj-1', hoursWorked: 8, overtimeHours: 1, dailyPay: 3600, paidStatus: 'approved' },
  { id: 'att-2', date: '2026-10-27', workerId: 'w-2', projectId: 'prj-1', hoursWorked: 8, overtimeHours: 0, dailyPay: 2400, paidStatus: 'approved' },
  { id: 'att-3', date: '2026-10-27', workerId: 'w-3', projectId: 'prj-1', hoursWorked: 8, overtimeHours: 2, dailyPay: 2250, paidStatus: 'approved' },
  { id: 'att-4', date: '2026-10-27', workerId: 'w-4', projectId: 'prj-1', hoursWorked: 8, overtimeHours: 1, dailyPay: 1070, paidStatus: 'approved' },
  { id: 'att-5', date: '2026-10-27', workerId: 'w-5', projectId: 'prj-1', hoursWorked: 8, overtimeHours: 2, dailyPay: 1125, paidStatus: 'approved' },
  { id: 'att-6', date: '2026-10-27', workerId: 'w-7', projectId: 'prj-1', hoursWorked: 8, overtimeHours: 0, dailyPay: 450, paidStatus: 'paid' },
  { id: 'att-7', date: '2026-10-27', workerId: 'w-8', projectId: 'prj-1', hoursWorked: 8, overtimeHours: 1, dailyPay: 510, paidStatus: 'paid' }
];

export const INITIAL_BOQ: BOQItem[] = [
  {
    id: 'boq-1',
    itemNo: '1.01',
    descriptionAm: 'የአፈርና አለት ቁፋሮ እስከ 4.5 ሜትር ጥልቀት (Bulk excavation)',
    descriptionEn: 'Bulk excavation in all classes of soil down to 4.5m depth',
    unit: 'm³',
    contractQty: 18500,
    contractRate: 380,
    executedQty: 18500,
    projectId: 'prj-1'
  },
  {
    id: 'boq-2',
    itemNo: '2.03',
    descriptionAm: 'የተጠናከረ ኮንክሪት C-25 ለመሰረትና አምዶች (RC Grade C-25)',
    descriptionEn: 'Reinforced Concrete Grade C-25 for foundations and columns',
    unit: 'm³',
    contractQty: 6200,
    contractRate: 14500,
    executedQty: 4100,
    projectId: 'prj-1'
  },
  {
    id: 'boq-3',
    itemNo: '2.08',
    descriptionAm: 'የተዛነፈ የብረት አርማታ Grade 60 መቁረጥና ማሰር (High yield rebar)',
    descriptionEn: 'High yield deformed steel reinforcement Grade 60 (All sizes)',
    unit: 'Ton',
    contractQty: 740,
    contractRate: 165000,
    executedQty: 490,
    projectId: 'prj-1'
  },
  {
    id: 'boq-4',
    itemNo: '3.02',
    descriptionAm: 'ባለ 20 ሳ.ሜ HCB የውጪና የውስጥ ግድግዳ ግንባታ (Blockwork)',
    descriptionEn: '200mm thick Hollow Concrete Block masonry in cement mortar 1:3',
    unit: 'm²',
    contractQty: 14000,
    contractRate: 1850,
    executedQty: 6200,
    projectId: 'prj-1'
  },
  {
    id: 'boq-5',
    itemNo: '4.01',
    descriptionAm: 'የውስጥ ግድግዳና ጣሪያ ሲሚንቶ ፕላስተር (Internal Plastering)',
    descriptionEn: 'Two-coat internal cement-sand plaster to walls and ceilings',
    unit: 'm²',
    contractQty: 28000,
    contractRate: 720,
    executedQty: 4500,
    projectId: 'prj-1'
  }
];

export const INITIAL_IPCS: InterimPaymentCertificate[] = [
  {
    id: 'ipc-1',
    ipcNumber: 'IPC-01',
    projectId: 'prj-1',
    periodStart: '2025-01-15',
    periodEnd: '2025-04-30',
    grossAmount: 42000000,
    retentionDeduction: 2100000,
    advanceDeduction: 8400000,
    vatAmount: 4725000,
    netPayable: 36225000,
    status: 'paid',
    submissionDate: '2025-05-05',
    certificationDate: '2025-05-20'
  },
  {
    id: 'ipc-2',
    ipcNumber: 'IPC-02',
    projectId: 'prj-1',
    periodStart: '2025-05-01',
    periodEnd: '2025-09-30',
    grossAmount: 78000000,
    retentionDeduction: 3900000,
    advanceDeduction: 15600000,
    vatAmount: 8775000,
    netPayable: 67275000,
    status: 'paid',
    submissionDate: '2025-10-04',
    certificationDate: '2025-10-25'
  },
  {
    id: 'ipc-3',
    ipcNumber: 'IPC-03',
    projectId: 'prj-1',
    periodStart: '2025-10-01',
    periodEnd: '2026-03-31',
    grossAmount: 95000000,
    retentionDeduction: 4750000,
    advanceDeduction: 19000000,
    vatAmount: 10687500,
    netPayable: 81937500,
    status: 'paid',
    submissionDate: '2026-04-06',
    certificationDate: '2026-04-28'
  },
  {
    id: 'ipc-4',
    ipcNumber: 'IPC-04',
    projectId: 'prj-1',
    periodStart: '2026-04-01',
    periodEnd: '2026-09-30',
    grossAmount: 52000000,
    retentionDeduction: 2600000,
    advanceDeduction: 10400000,
    vatAmount: 5850000,
    netPayable: 44850000,
    status: 'certified',
    submissionDate: '2026-10-05',
    certificationDate: '2026-10-22'
  }
];

export const INITIAL_DAILY_LOGS: SiteDailyLog[] = [
  {
    id: 'log-1',
    date: '2026-10-27',
    projectId: 'prj-1',
    weather: 'sunny',
    siteConditions: 'ደረቅና ለስራ ምቹ የአየር ሁኔታ፤ የንፋስ ፍጥነት መደበኛ',
    workforceHeadcount: {
      engineers: 3,
      foremen: 4,
      masons: 18,
      carpenters: 14,
      barBenders: 16,
      dailyLaborers: 42,
      operators: 5
    },
    machineryActiveCount: 4,
    workExecutedAm: 'በ 11ኛ ፎቅ የሰሌዳ ኮንክሪት ማፍሰስ (C-25: 140 m³ ተጠናቀቀ)፤ በ 8ኛ ፎቅ የብሎኬት ግድግዳ ግንባታ ተካሂዷል',
    workExecutedEn: 'Concreting of 11th floor suspended slab (C-25: 140 m³ casted); HCB partition masonry on 8th floor',
    materialsReceivedAm: '1000 ኩንታል ዳንጎቴ ሲሚንቶ፣ 180 m³ የወንዝ አሸዋ ገቢ ተደርጓል',
    materialsReceivedEn: '1000 bags Dangote cement, 180 m³ river sand received at store',
    safetyIncidentsAm: 'ምንም አይነት የአካል ጉዳት ወይም አደጋ አልተመዘገበም፤ የጠዋት የደህንነት ውይይት (Toolbox meeting) ተካሂዷል',
    safetyIncidentsEn: 'Zero incidents; morning 15-min safety toolbox meeting held on working at height harness usage',
    preparedBy: 'ኢ/ር ትዕግስት ሃይሉ (የሳይት መሃንዲስ)',
    inspectedBy: 'ኢ/ር አለማየሁ በቀለ (የፕሮጀክት ስራ አስኪያጅ)'
  },
  {
    id: 'log-2',
    date: '2026-10-26',
    projectId: 'prj-1',
    weather: 'cloudy',
    siteConditions: 'መጠነኛ ደመናማ፤ ከሰዓት በኋላ የቀለለ ዝናብ ነበረ',
    workforceHeadcount: {
      engineers: 3,
      foremen: 4,
      masons: 16,
      carpenters: 16,
      barBenders: 18,
      dailyLaborers: 38,
      operators: 4
    },
    machineryActiveCount: 4,
    workExecutedAm: 'የ 11ኛ ፎቅ የብረት አርማታ ማሰርና የፎርምዎርክ ዝግጅት፤ የአማካሪ መሃንዲስ ቼክሊስት ፈቃድ ተሰጥቷል',
    workExecutedEn: 'Rebar tying and formwork leveling for 11th floor slab; consultant inspection approval received',
    materialsReceivedAm: '12 ቶን Ø16mm ብረት ከቃሊቲ መጋዘን ተቀብሏል',
    materialsReceivedEn: '12 Tons Ø16mm deformed bar received from Kality warehouse',
    safetyIncidentsAm: 'አንድ ሰራተኛ የመከላከያ ጓንት ባለማድረጉ ማስጠንቀቂያ ተሰጥቶ አዲስ ጓንት ታድሏል',
    safetyIncidentsEn: 'One worker cautioned for missing safety gloves; issued new pair',
    preparedBy: 'ኢ/ር ትዕግስት ሃይሉ',
    inspectedBy: 'ኢ/ር አለማየሁ በቀለ'
  }
];

export const INITIAL_QC_TESTS: QualityTest[] = [
  {
    id: 'qc-1',
    testCode: 'QC-CUB-2026-104',
    projectId: 'prj-1',
    structuralElementAm: '10ኛ ፎቅ ዋና አምዶች (Columns C1-C8)',
    structuralElementEn: '10th Floor Structural Columns C1-C8',
    castDate: '2026-09-29',
    testDate: '2026-10-27',
    testType: 'concrete_cube',
    targetStrengthMpa: 25.0,
    achievedStrengthMpa: 28.6,
    status: 'passed',
    technician: 'ላብራቶሪ ቴክኒሽያን ዳዊት ከበደ',
    remarks: 'የ 28-ቀን የኮንክሪት ኪውብ የመጨፍለቅ ጥንካሬ ፈተና ከሚጠበቀው በላይ 28.6 MPa በማምጣት አልፏል (Passed with 114%)'
  },
  {
    id: 'qc-2',
    testCode: 'QC-CUB-2026-112',
    projectId: 'prj-1',
    structuralElementAm: '11ኛ ፎቅ የሰሌዳና ቢም ኮንክሪት (Slab & Beams)',
    structuralElementEn: '11th Floor Slab & Beams Concrete',
    castDate: '2026-10-20',
    testDate: '2026-10-27',
    testType: 'concrete_cube',
    targetStrengthMpa: 25.0,
    achievedStrengthMpa: 19.8,
    status: 'pending_28d',
    technician: 'ዳዊት ከበደ',
    remarks: 'የ 7-ቀን ጥንካሬ 19.8 MPa አስመዝግቧል (የ 28-ቀኑን 79%)፤ የ 28 ቀን ውጤት በ 2026-11-17 ይጠበቃል'
  },
  {
    id: 'qc-3',
    testCode: 'QC-SLM-2026-089',
    projectId: 'prj-1',
    structuralElementAm: '11ኛ ፎቅ ሰሌዳ ትኩስ ኮንክሪት ዝለት (Slump)',
    structuralElementEn: '11th Floor Slab Fresh Concrete Slump',
    castDate: '2026-10-27',
    testDate: '2026-10-27',
    testType: 'slump_test',
    targetStrengthMpa: 100, // slump mm target
    achievedStrengthMpa: 95, // 95mm slump
    status: 'passed',
    technician: 'ዳዊት ከበደ',
    remarks: 'ትክክለኛ የኮንክሪት ዝለት (95mm)፤ የውሃ-ሲሚንቶ ምጣኔ (W/C ratio: 0.45) ተረጋግጧል'
  },
  {
    id: 'qc-4',
    testCode: 'QC-STL-2026-045',
    projectId: 'prj-2',
    structuralElementAm: 'የአቃቂ ብረት Ø16mm የመሳብ ጥንካሬ (Tensile Yield)',
    structuralElementEn: 'Akaki Steel Ø16mm Tensile Yield Strength',
    castDate: '2026-10-12',
    testDate: '2026-10-14',
    testType: 'steel_tensile',
    targetStrengthMpa: 460, // Grade 60 (460 MPa)
    achievedStrengthMpa: 512,
    status: 'passed',
    technician: 'የኢትዮጵያ ኮንስትራክሽን ባለስልጣን ላብራቶሪ',
    remarks: 'Yield strength 512 MPa, Elongation 16.5% - ASTM A615 መስፈርትን ያሟላል'
  }
];
