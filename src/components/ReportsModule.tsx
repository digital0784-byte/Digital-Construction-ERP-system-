import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Building2, 
  Truck, 
  Users, 
  Package, 
  Printer,
  Calendar
} from 'lucide-react';
import { Project, Material, Machinery, Worker, InterimPaymentCertificate } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ReportsModuleProps {
  projects: Project[];
  materials: Material[];
  machinery: Machinery[];
  workers: Worker[];
  ipcs: InterimPaymentCertificate[];
  onOpenPrintModal: () => void;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  projects,
  materials,
  machinery,
  workers,
  ipcs,
  onOpenPrintModal
}) => {
  const { t, language } = useLanguage();

  const totalContract = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.budgetSpent, 0);
  const totalBilled = ipcs.reduce((acc, i) => acc + i.netPayable, 0);

  const formatMillions = (val: number) => {
    return (val / 1000000).toFixed(1) + (language === 'am' ? ' ሚሊዮን ብር' : 'M ETB');
  };

  const handleExportCSV = () => {
    const headers = ["Project Code", "Project Name", "Client", "Contract Value (ETB)", "Budget Spent (ETB)", "Progress (%)"];
    const rows = projects.map(p => [
      p.code,
      `"${p.nameEn}"`,
      `"${p.client}"`,
      p.contractValue,
      p.budgetSpent,
      p.progressPercentage
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zemen_construction_erp_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>{language === 'am' ? 'የማኔጅመንት ሪፖርቶችና የፋይናንስ ትንተና' : 'Executive Reports & Analytics'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'am'
              ? 'የፕሮጀክት ወጪ፣ የክፍያ ሰርተፍኬት (IPC)፣ የማሽነሪ ነዳጅ ፍጆታ እና የሰው ኃይል ማጠቃለያ'
              : 'Financial performance, IPC certified claims, fleet fuel consumption, and labor allocation.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{language === 'am' ? 'ኤክሴል (CSV) አውርድ' : 'Export CSV'}</span>
          </button>
          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'am' ? 'ይፋዊ ሪፖርት አትም' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{language === 'am' ? 'ጠቅላላ የፖርትፎሊዮ ውል ዋጋ' : 'Total Portfolio Contract'}</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatMillions(totalContract)}
          </div>
          <p className="text-[11px] text-slate-400">
            {projects.length} {language === 'am' ? 'ዋና ዋና የመንግስትና የግል ኮንትራቶች' : 'Active Contracts'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{language === 'am' ? 'የወጣ ጠቅላላ ወጪ (Actual Incurred)' : 'Actual Cost Incurred'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatMillions(totalSpent)}
          </div>
          <p className="text-[11px] text-slate-400">
            {Math.round((totalSpent / totalContract) * 100)}% {language === 'am' ? 'ከጠቅላላ በጀቱ ስራ ላይ ውሏል' : 'of total budget utilized'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{language === 'am' ? 'የተረጋገጠ የክፍያ ሰርተፍኬት (Billed IPC)' : 'Certified IPC Billing'}</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
            {formatMillions(totalBilled)}
          </div>
          <p className="text-[11px] text-slate-400">
            {ipcs.length} {language === 'am' ? 'ጊዜያዊ የክፍያ ሰርተፍኬቶች' : 'Interim Certificates Submitted'}
          </p>
        </div>
      </div>

      {/* Projects Variance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">
            {language === 'am' ? 'የሳይቶች አፈፃፀምና የበጀት ቁጥጥር ዝርዝር' : 'Site Performance & Budget Variance'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">ኮድ</th>
                <th className="py-3 px-4">የፕሮጀክት ስም</th>
                <th className="py-3 px-4 text-right">የውል ዋጋ</th>
                <th className="py-3 px-4 text-right">የወጣ ወጪ</th>
                <th className="py-3 px-4 text-right">የቀረ በጀት</th>
                <th className="py-3 px-4 text-center">አፈፃፀም</th>
                <th className="py-3 px-4 text-center">ሁኔታ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {projects.map((p) => {
                const remaining = p.contractValue - p.budgetSpent;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-amber-400">
                      {p.code}
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-white">
                      {language === 'am' ? p.nameAm : p.nameEn}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-200 tabular-nums">
                      {formatMillions(p.contractValue)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400 tabular-nums">
                      {formatMillions(p.budgetSpent)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 tabular-nums">
                      {formatMillions(remaining)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-amber-300 tabular-nums">
                        {p.progressPercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                        p.status === 'delayed' ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.status === 'active' ? (language === 'am' ? 'በስራ ላይ' : 'Active') :
                         p.status === 'delayed' ? (language === 'am' ? 'የዘገየ' : 'Delayed') :
                         (language === 'am' ? 'የታገደ' : 'On Hold')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet & Resource Efficiency Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fleet Fuel Consumption Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-400" />
              <span>{language === 'am' ? 'የማሽነሪዎች የነዳጅ ፍጆታና የስራ ሰዓት' : 'Fleet Utilization & Fuel Consumption'}</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">{machinery.length} ክፍሎች</span>
          </div>
          <div className="space-y-2 text-xs">
            {machinery.map((eqp) => (
              <div key={eqp.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white truncate max-w-[200px]">
                    {language === 'am' ? eqp.nameAm : eqp.nameEn}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {eqp.plateNumber} · ኦፕሬተር: {eqp.operatorName}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <div className="text-amber-400 font-bold">{eqp.totalOperatingHours} hrs</div>
                  <div className="text-slate-400">{eqp.fuelConsumptionLph} L/hr</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Material Stock Balances */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>{language === 'am' ? 'ዋና ዋና የግንባታ እቃዎች ክምችት' : 'Key Materials Stock Balance'}</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">{materials.length} እቃዎች</span>
          </div>
          <div className="space-y-2 text-xs">
            {materials.slice(0, 5).map((mat) => {
              const isLow = mat.currentStock <= mat.minAlertStock;
              return (
                <div key={mat.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">
                      {language === 'am' ? mat.nameAm : mat.nameEn}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {mat.warehouseLocation}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className={`font-bold ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {mat.currentStock.toLocaleString()} {mat.unit}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ገደብ: {mat.minAlertStock}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
