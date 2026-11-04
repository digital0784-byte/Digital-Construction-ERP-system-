import React, { useState } from 'react';
import { Printer, X, FileText, CheckCircle, HardHat } from 'lucide-react';
import { Project, InterimPaymentCertificate, SiteDailyLog, Material, Worker, AttendanceRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  ipcs: InterimPaymentCertificate[];
  dailyLogs: SiteDailyLog[];
  materials: Material[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  initialDocType?: 'daily_diary' | 'ipc_voucher' | 'siv_voucher' | 'payroll_sheet';
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  projects,
  ipcs,
  dailyLogs,
  materials,
  workers,
  attendance,
  initialDocType = 'daily_diary'
}) => {
  const { t, language } = useLanguage();
  const [docType, setDocType] = useState<'daily_diary' | 'ipc_voucher' | 'siv_voucher' | 'payroll_sheet'>(initialDocType);

  if (!isOpen) return null;

  const currentProject = projects[0];
  const currentIpc = ipcs[ipcs.length - 1];
  const currentLog = dailyLogs[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Toolbar (hidden during print) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between no-print bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'am' ? 'የሰነድ አይነት ምረጥ:' : 'Select Document:'}
            </span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setDocType('daily_diary')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  docType === 'daily_diary' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'am' ? 'የሳይት ዳይሪ' : 'Site Diary'}
              </button>
              <button
                onClick={() => setDocType('ipc_voucher')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  docType === 'ipc_voucher' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'am' ? 'IPC ሰርተፍኬት' : 'IPC Certificate'}
              </button>
              <button
                onClick={() => setDocType('payroll_sheet')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  docType === 'payroll_sheet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'am' ? 'የቀን ደመወዝ ሮስተር' : 'Labor Wage Sheet'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'አትም (Print/PDF)' : 'Print Document'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (Styled for crisp paper printing) */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950 sm:p-10 text-slate-900">
          <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-slate-300 text-slate-900 print:shadow-none print:border-none print:p-0">
            {/* Enterprise Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    ዘመን ኮንስትራክሽንና ኢንጂነሪንግ ኃ/የተ/የግ/ማህበር
                  </h1>
                  <h2 className="text-xs font-bold text-slate-600 tracking-wider">
                    ZEMEN CONSTRUCTION & ENGINEERING GENERAL CONTRACTOR (GC-1)
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ቦሌ ኪዳነምህረት አደባባይ፣ ዘመን ታወር 7ኛ ፎቅ | ስልክ: +251 116 678900 | አዲስ አበባ፣ ኢትዮጵያ
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-xl ml-auto">
                    Z
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">ISO 9001:2015</span>
                </div>
              </div>
            </div>

            {/* DOCUMENT 1: SITE DAILY DIARY */}
            {docType === 'daily_diary' && currentLog && (
              <div className="space-y-6 text-xs">
                <div className="text-center border-b border-slate-300 pb-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase">
                    የሳይት ዕለታዊ ስራ ሪፖርት (SITE DAILY DIARY)
                  </h3>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    ሪፖርት ቁጥር: SDR-{currentLog.date.replace(/-/g, '')}-01
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">የፕሮጀክት ስም:</span>
                    <span className="font-semibold text-slate-900">{currentProject.nameAm}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">ቀንና የአየር ሁኔታ:</span>
                    <span className="font-mono text-slate-900">
                      {currentLog.date} · {currentLog.weather === 'sunny' ? 'ጸሃያማ (Sunny)' : 'ደመናማ'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">አሰሪ (ክላይንት):</span>
                    <span className="text-slate-900">{currentProject.client}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">ሳይት መገኛ:</span>
                    <span className="text-slate-900">{currentProject.location}</span>
                  </div>
                </div>

                {/* Manpower deployed */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
                    1. በሳይቱ ላይ የተሰማራ የሰው ኃይል (Manpower Headcount)
                  </h4>
                  <table className="w-full text-left border border-slate-300">
                    <thead className="bg-slate-100 text-[11px]">
                      <tr>
                        <th className="p-1.5 border border-slate-300">መሃንዲስ</th>
                        <th className="p-1.5 border border-slate-300">ፎርማን</th>
                        <th className="p-1.5 border border-slate-300">ግንበኛ</th>
                        <th className="p-1.5 border border-slate-300">አናጺ</th>
                        <th className="p-1.5 border border-slate-300">ብረት አሳሪ</th>
                        <th className="p-1.5 border border-slate-300">የቀን ሰራተኛ</th>
                        <th className="p-1.5 border border-slate-300 font-bold">ጠቅላላ ድምር</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-center">
                      <tr>
                        <td className="p-1.5 border border-slate-300">{currentLog.workforceHeadcount.engineers}</td>
                        <td className="p-1.5 border border-slate-300">{currentLog.workforceHeadcount.foremen}</td>
                        <td className="p-1.5 border border-slate-300">{currentLog.workforceHeadcount.masons}</td>
                        <td className="p-1.5 border border-slate-300">{currentLog.workforceHeadcount.carpenters}</td>
                        <td className="p-1.5 border border-slate-300">{currentLog.workforceHeadcount.barBenders}</td>
                        <td className="p-1.5 border border-slate-300 font-bold text-amber-700">{currentLog.workforceHeadcount.dailyLaborers}</td>
                        <td className="p-1.5 border border-slate-300 font-bold text-slate-900">
                          {Object.values(currentLog.workforceHeadcount).reduce((a, b) => a + b, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Activities Completed */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 border-b border-slate-200 pb-1">
                    2. የተከናወኑ ዋና ዋና የግንባታ ስራዎች (Activities Executed)
                  </h4>
                  <p className="text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                    {currentLog.workExecutedAm}
                  </p>
                </div>

                {/* Materials Received */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 border-b border-slate-200 pb-1">
                    3. ዛሬ ወደ ሳይት የገቡ እቃዎችና ቁሳቁስ (Materials Delivered)
                  </h4>
                  <p className="text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200">
                    {currentLog.materialsReceivedAm}
                  </p>
                </div>

                {/* Safety & Remarks */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 border-b border-slate-200 pb-1">
                    4. የስራ ላይ ደህንነትና ክስተቶች (Safety & HSE Remarks)
                  </h4>
                  <p className="text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200">
                    {currentLog.safetyIncidentsAm}
                  </p>
                </div>

                {/* Signatures Strip */}
                <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300">
                  <div>
                    <span className="text-[11px] text-slate-500 block">ያዘጋጀው (የሳይት መሃንዲስ):</span>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-2 flex items-end">
                      <span className="font-semibold text-slate-800">{currentLog.preparedBy}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">ፊርማና ቀን</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">ያረጋገጠው (የፕሮጀክት ስራ አስኪያጅ):</span>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-2 flex items-end">
                      <span className="font-semibold text-slate-800">{currentLog.inspectedBy}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">ፊርማና ቀን</span>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 2: INTERIM PAYMENT CERTIFICATE (IPC) */}
            {docType === 'ipc_voucher' && currentIpc && (
              <div className="space-y-6 text-xs">
                <div className="text-center border-b border-slate-300 pb-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase">
                    ጊዜያዊ የክፍያ ማረጋገጫ ሰርተፍኬት (INTERIM PAYMENT CERTIFICATE)
                  </h3>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    የሰርተፍኬት ቁጥር: {currentIpc.ipcNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">ፕሮጀክት:</span>
                    <span className="font-semibold text-slate-900">{currentProject.nameAm}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">የክፍለ ጊዜ ማጠቃለያ:</span>
                    <span className="font-mono text-slate-900">{currentIpc.periodStart} እስከ {currentIpc.periodEnd}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">የውል ጠቅላላ ዋጋ:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {new Intl.NumberFormat('en-US').format(currentProject.contractValue)} ETB
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">አሰሪ (Client):</span>
                    <span className="text-slate-900">{currentProject.client}</span>
                  </div>
                </div>

                {/* Financial Computation Table */}
                <table className="w-full text-left border border-slate-300">
                  <thead className="bg-slate-100 text-[11px]">
                    <tr>
                      <th className="p-2 border border-slate-300">ተ.ቁ</th>
                      <th className="p-2 border border-slate-300">የሂሳብ ዝርዝር መግለጫ</th>
                      <th className="p-2 border border-slate-300 text-right">የገንዘብ መጠን (ETB)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 border border-slate-300 text-center">1</td>
                      <td className="p-2 border border-slate-300 font-sans">የተከናወነ ጠቅላላ ስራ ዋጋ (Gross Valuation Claimed)</td>
                      <td className="p-2 border border-slate-300 text-right font-bold text-slate-900">
                        {currentIpc.grossAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300 text-center">2</td>
                      <td className="p-2 border border-slate-300 font-sans text-rose-700">ቅነሳ፡ የ 5% የዋስትና ተቀናሽ (Retention Deduction)</td>
                      <td className="p-2 border border-slate-300 text-right text-rose-700">
                        -{currentIpc.retentionDeduction.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300 text-center">3</td>
                      <td className="p-2 border border-slate-300 font-sans text-rose-700">ቅነሳ፡ የቅድመ ክፍያ ተመላሽ (Advance Mobilization Recovery)</td>
                      <td className="p-2 border border-slate-300 text-right text-rose-700">
                        -{currentIpc.advanceDeduction.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300 text-center">4</td>
                      <td className="p-2 border border-slate-300 font-sans text-blue-700">ተጨማሪ፡ 15% የተጨማሪ እሴት ታክስ (15% VAT)</td>
                      <td className="p-2 border border-slate-300 text-right text-blue-700 font-bold">
                        +{currentIpc.vatAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-slate-100 font-bold text-sm">
                      <td className="p-2 border border-slate-300 text-center" colSpan={2}>
                        ለክፍያ የተረጋገጠ የተጣራ ድምር (NET CERTIFIED PAYABLE)
                      </td>
                      <td className="p-2 border border-slate-300 text-right text-slate-900 underline decoration-double">
                        {currentIpc.netPayable.toLocaleString()} ETB
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Consultant & Client Certification Signatures */}
                <div className="grid grid-cols-3 gap-4 pt-10 mt-6 border-t border-slate-300 text-center">
                  <div>
                    <span className="text-[11px] text-slate-500 block">የኮንትራክተር ተወካይ</span>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                    <span className="text-[10px] text-slate-400 block mt-1">ኢ/ር አለማየሁ በቀለ</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">የአማካሪ መሃንዲስ ማረጋገጫ</span>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                    <span className="text-[10px] text-slate-400 block mt-1">የነዋሪ መሃንዲስ ማህተም/ፊርማ</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">የክላይንት የክፍያ ፈቃድ</span>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                    <span className="text-[10px] text-slate-400 block mt-1">የፋይናንስ ዳይሬክተር</span>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 3: LABOR PAYROLL SHEET */}
            {docType === 'payroll_sheet' && (
              <div className="space-y-6 text-xs">
                <div className="text-center border-b border-slate-300 pb-3">
                  <h3 className="text-base font-bold text-slate-900 uppercase">
                    የሳይት የቀን ሰራተኞች ደመወዝ መክፈያ ሮስተር (DAILY LABOR PAYROLL)
                  </h3>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    የክፍያ ሮስተር ቁጥር: PAY-2026-W43 · {currentProject.nameAm}
                  </p>
                </div>

                <table className="w-full text-left border border-slate-300">
                  <thead className="bg-slate-100 text-[11px]">
                    <tr>
                      <th className="p-2 border border-slate-300">ተ.ቁ</th>
                      <th className="p-2 border border-slate-300">የሰራተኛ ስም</th>
                      <th className="p-2 border border-slate-300">የስራ መደብ</th>
                      <th className="p-2 border border-slate-300 text-center">የስራ ሰዓት</th>
                      <th className="p-2 border border-slate-300 text-right">የቀን ሂሳብ</th>
                      <th className="p-2 border border-slate-300 text-right">የተጣራ ክፍያ</th>
                      <th className="p-2 border border-slate-300 text-center">የተቀባይ ፊርማ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {workers.slice(0, 6).map((w, idx) => (
                      <tr key={w.id}>
                        <td className="p-2 border border-slate-300 font-mono text-center">{idx + 1}</td>
                        <td className="p-2 border border-slate-300 font-semibold">{w.fullNameAm}</td>
                        <td className="p-2 border border-slate-300 text-slate-600">{w.role}</td>
                        <td className="p-2 border border-slate-300 text-center font-mono">8 ሰዓት</td>
                        <td className="p-2 border border-slate-300 text-right font-mono">{w.dailyRate}</td>
                        <td className="p-2 border border-slate-300 text-right font-mono font-bold text-slate-900">
                          {w.dailyRate} ETB
                        </td>
                        <td className="p-2 border border-slate-300 text-center text-slate-400 font-mono text-[10px]">
                          [ ____________ ]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300">
                  <div>
                    <span className="text-[11px] text-slate-500 block">ክፍያ የፈጸመው ገንዘብ ያዥ (Cashier):</span>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                    <span className="text-[10px] text-slate-400 block mt-1">ሙሉ ስም፣ ፊርማና ቀን</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">ያረጋገጠው ሳይት ፎርማን/መሃንዲስ:</span>
                    <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                    <span className="text-[10px] text-slate-400 block mt-1">ሙሉ ስም፣ ፊርማና ቀን</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
