import React from 'react';
import { 
  Building2, 
  Layers, 
  Users, 
  Truck, 
  AlertTriangle, 
  ChevronRight, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight,
  HardHat,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Project, Material, Machinery, SiteDailyLog, QualityTest, ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DashboardOverviewProps {
  projects: Project[];
  materials: Material[];
  machinery: Machinery[];
  dailyLogs: SiteDailyLog[];
  qcTests: QualityTest[];
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedProjectId: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  materials,
  machinery,
  dailyLogs,
  qcTests,
  setActiveTab,
  setSelectedProjectId
}) => {
  const { t, language } = useLanguage();

  const totalContractValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalBudgetSpent = projects.reduce((acc, p) => acc + p.budgetSpent, 0);
  const lowStockItems = materials.filter(m => m.currentStock <= m.minAlertStock);
  const operationalMachinery = machinery.filter(m => m.status === 'operational').length;
  const machineryUtilizationRate = Math.round((operationalMachinery / machinery.length) * 100);

  const formatCurrency = (val: number) => {
    return (val / 1000000).toFixed(1) + (language === 'am' ? ' ሚሊዮን ብር' : 'M ETB');
  };

  const latestLog = dailyLogs[0];

  return (
    <div className="space-y-6">
      {/* Low Stock Warning Banner if applicable */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-300">
                {language === 'am' ? 'አነስተኛ የግንባታ እቃ ክምችት ማስጠንቀቂያ' : 'Low Stock Material Alert'}
              </h4>
              <p className="text-xs text-amber-200/80">
                {language === 'am'
                  ? `${lowStockItems.map(m => m.nameAm).join(', ')} ከተቀመጠው ዝቅተኛ ገደብ በታች ደርሷል። አስቸኳይ ግዢ ያስፈልጋል።`
                  : `${lowStockItems.map(m => m.nameEn).join(', ')} is below the minimum threshold. Reorder recommended.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('materials')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            {language === 'am' ? 'ስቶክ ተመልከት' : 'View Stock'}
          </button>
        </div>
      )}

      {/* Hero Strip with Project Site Visual */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="relative h-56 sm:h-64 w-full">
          <img
            src="/src/assets/images/construction_site_hero_1793174257913.jpg"
            alt="Construction Site Hero"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <span className="uppercase tracking-wider">
                  {language === 'am' ? 'የዋና መ/ቤት ኦፕሬሽን ማዕከል' : 'Central Enterprise Operations'}
                </span>
                <span>·</span>
                <span className="text-slate-300 font-normal">
                  {projects.length} {language === 'am' ? 'ዋና ዋና ሳይቶች በሂደት ላይ' : 'Active Megaprojects'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {language === 'am'
                  ? 'የኢትዮጵያ ግንባታና ኢንጂነሪንግ ስራዎች አጠቃላይ ሁኔታ'
                  : 'Ethiopia Construction Operations Overview'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
                {language === 'am'
                  ? 'የቦሌ አትላንቲክ ህንጻ፣ ሃዋሳ ሎጂስቲክስ፣ ጣና ኮንቬንሽን ሴንተር እና ድሬዳዋ ኮሪደር የመስክ ስራዎች የቀን መከታተያ'
                  : 'Real-time tracking of Bole Atlantic, Hawassa Logistics, Tana Convention, and Dire Dawa corridor.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('site_inspections')}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>{language === 'am' ? 'የሳይት ኢንስፔክሽን' : 'Site Inspection'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('task_orders')}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>{language === 'am' ? 'የስራ ትዕዛዞች' : 'Task Orders'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>{language === 'am' ? 'ሳይቶች' : 'Sites'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">
              {language === 'am' ? 'የውል ጠቅላላ ዋጋ (Portfolio)' : 'Total Contract Value'}
            </span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {formatCurrency(totalContractValue)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <span className="text-emerald-400 font-semibold">{formatCurrency(totalBudgetSpent)}</span>
              <span>{language === 'am' ? 'ወጪ ሆኗል' : 'spent'}</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full" 
              style={{ width: `${Math.round((totalBudgetSpent / totalContractValue) * 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">
              {language === 'am' ? 'በስራ ላይ ያሉ ፕሮጀክቶች' : 'Active Projects'}
            </span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {projects.length} <span className="text-sm font-normal text-slate-400">{language === 'am' ? 'ሳይቶች' : 'Sites'}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              3 {language === 'am' ? 'በሰዓቱ የሚሄዱ' : 'on schedule'} · 1 {language === 'am' ? 'የዘገየ' : 'delayed'}
            </div>
          </div>
          <div className="text-xs text-blue-400 font-medium flex items-center gap-1">
            <span>{language === 'am' ? 'አማካይ አፈፃፀም: 65%' : 'Average Progress: 65%'}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">
              {language === 'am' ? 'የሳይት የሰው ኃይል (ዛሬ)' : 'On-Site Workforce Today'}
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              104 <span className="text-sm font-normal text-slate-400">{language === 'am' ? 'ሰራተኞች' : 'Workers'}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              42 {language === 'am' ? 'የቀን ሰራተኛ' : 'Daily Labor'} · 48 {language === 'am' ? 'ሙያተኛ' : 'Skilled'} · 14 {language === 'am' ? 'መሃንዲሶች' : 'Staff'}
            </div>
          </div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <HardHat className="w-3.5 h-3.5" />
            <span>{language === 'am' ? '100% የደህንነት መሳሪያ የለበሱ' : '100% PPE Compliant'}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">
              {language === 'am' ? 'የማሽነሪ ዝግጁነት' : 'Fleet Utilization'}
            </span>
            <Truck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {machineryUtilizationRate}% <span className="text-sm font-normal text-slate-400">({operationalMachinery}/{machinery.length})</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {operationalMachinery} {language === 'am' ? 'በስራ ላይ' : 'Active'} · 1 {language === 'am' ? 'ጥገና' : 'Maintenance'}
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full rounded-full" 
              style={{ width: `${machineryUtilizationRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Section: Active Projects Breakdown & Site Operations Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects Overview (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'am' ? 'በሂደት ላይ ያሉ የኮንስትራክሽን ሳይቶች' : 'Active Project Sites'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'am' ? 'የኮንትራት ዋጋና የአፈፃፀም ደረጃ' : 'Progress status, contract value and site engineers'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'am' ? 'ሁሉንም ተመልከት' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => {
              const spentPercent = Math.round((project.budgetSpent / project.contractValue) * 100);
              return (
                <div 
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('projects');
                  }}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-amber-400 font-semibold">{project.code}</span>
                      <span className={`text-[11px] font-medium ${
                        project.status === 'active' ? 'text-emerald-400' :
                        project.status === 'delayed' ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {project.status === 'active' ? (language === 'am' ? 'በስራ ላይ' : 'Active') :
                         project.status === 'delayed' ? (language === 'am' ? 'የዘገየ' : 'Delayed') :
                         (language === 'am' ? 'የታገደ' : 'On Hold')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {language === 'am' ? project.nameAm : project.nameEn}
                    </h4>

                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>

                    <div className="mt-3 text-xs text-slate-400">
                      <span>{language === 'am' ? 'የውል ዋጋ:' : 'Value:'} </span>
                      <span className="font-mono font-semibold text-slate-200">
                        {formatCurrency(project.contractValue)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">
                        {language === 'am' ? 'አፈፃፀም' : 'Progress'}
                      </span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">
                        {project.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${project.progressPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span className="truncate">{project.siteEngineer}</span>
                      <span className="font-mono shrink-0">{project.plannedEndDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Site Diary & Quality Quick Highlights (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {language === 'am' ? 'የዛሬ ሳይት ዳይሪ' : 'Today\'s Site Diary'}
            </h3>
            <button
              onClick={() => setActiveTab('dailylog')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'am' ? 'ዳይሪ ክፈት' : 'Open Diary'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestLog ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-mono text-slate-300">{latestLog.date}</span>
                <span className="text-amber-400 font-medium">
                  {latestLog.weather === 'sunny' ? (language === 'am' ? '☀️ ጸሃያማ' : '☀️ Sunny') : (language === 'am' ? '☁️ ደመናማ' : '☁️ Cloudy')}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {language === 'am' ? 'የተከናወነ ዋና ስራ' : 'Work Executed'}
                </span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {language === 'am' ? latestLog.workExecutedAm : latestLog.workExecutedEn}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {language === 'am' ? 'የገቡ እቃዎች' : 'Materials Received'}
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  {language === 'am' ? latestLog.materialsReceivedAm : latestLog.materialsReceivedEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{language === 'am' ? 'ያዘጋጀው:' : 'Prepared by:'}</span>
                <span className="text-slate-200 truncate">{latestLog.preparedBy}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
              {language === 'am' ? 'ምንም ሪፖርት የለም' : 'No logs recorded today.'}
            </div>
          )}

          {/* Quick Quality Control Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">
                  {language === 'am' ? 'የኮንክሪት ጥራት ፈተና (QC)' : 'Concrete QC Tests'}
                </h4>
              </div>
              <button
                onClick={() => setActiveTab('quality')}
                className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                {language === 'am' ? 'ዝርዝር' : 'Details'}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {qcTests.slice(0, 2).map((test) => (
                <div key={test.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] text-slate-400">{test.testCode}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      test.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {test.status === 'passed' ? 'PASSED (114%)' : 'PENDING 28D'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium truncate">
                    {language === 'am' ? test.structuralElementAm : test.structuralElementEn}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span>{language === 'am' ? 'የተገኘ ጥንካሬ:' : 'Achieved:'} <b className="text-emerald-400">{test.achievedStrengthMpa} MPa</b></span>
                    <span>{language === 'am' ? 'ዒላማ:' : 'Target:'} {test.targetStrengthMpa} MPa</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
