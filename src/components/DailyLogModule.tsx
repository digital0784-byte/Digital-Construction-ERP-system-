import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Sun, 
  CloudRain, 
  Cloud, 
  Plus, 
  Users, 
  Truck, 
  ShieldAlert, 
  Printer, 
  X,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';
import { SiteDailyLog, Project } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DailyLogModuleProps {
  dailyLogs: SiteDailyLog[];
  setDailyLogs: React.Dispatch<React.SetStateAction<SiteDailyLog[]>>;
  projects: Project[];
  onPrintLog: (log: SiteDailyLog) => void;
}

export const DailyLogModule: React.FC<DailyLogModuleProps> = ({
  dailyLogs,
  setDailyLogs,
  projects,
  onPrintLog
}) => {
  const { t, language } = useLanguage();
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SiteDailyLog>(dailyLogs[0]);

  // Form State
  const [newLogForm, setNewLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    projectId: projects[0]?.id || '',
    weather: 'sunny' as SiteDailyLog['weather'],
    siteConditions: 'ደረቅና ለስራ ምቹ የአየር ሁኔታ',
    engineers: 3,
    foremen: 4,
    masons: 16,
    carpenters: 14,
    barBenders: 16,
    dailyLaborers: 40,
    operators: 5,
    machineryActiveCount: 4,
    workExecutedAm: '',
    materialsReceivedAm: '',
    safetyIncidentsAm: 'ምንም አይነት አደጋ አልተመዘገበም፤ የጠዋት 15 ደቂቃ Toolbox meeting ተካሂዷል',
    preparedBy: 'ኢ/ር ትዕግስት ሃይሉ (የሳይት መሃንዲስ)',
    inspectedBy: 'ኢ/ር አለማየሁ በቀለ (የፕሮጀክት ስራ አስኪያጅ)'
  });

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogForm.workExecutedAm) return;

    const newLog: SiteDailyLog = {
      id: `log-${Date.now()}`,
      date: newLogForm.date,
      projectId: newLogForm.projectId,
      weather: newLogForm.weather,
      siteConditions: newLogForm.siteConditions,
      workforceHeadcount: {
        engineers: Number(newLogForm.engineers),
        foremen: Number(newLogForm.foremen),
        masons: Number(newLogForm.masons),
        carpenters: Number(newLogForm.carpenters),
        barBenders: Number(newLogForm.barBenders),
        dailyLaborers: Number(newLogForm.dailyLaborers),
        operators: Number(newLogForm.operators)
      },
      machineryActiveCount: Number(newLogForm.machineryActiveCount),
      workExecutedAm: newLogForm.workExecutedAm,
      workExecutedEn: newLogForm.workExecutedAm,
      materialsReceivedAm: newLogForm.materialsReceivedAm || 'ምንም አልገባም',
      materialsReceivedEn: newLogForm.materialsReceivedAm || 'None',
      safetyIncidentsAm: newLogForm.safetyIncidentsAm,
      safetyIncidentsEn: newLogForm.safetyIncidentsAm,
      preparedBy: newLogForm.preparedBy,
      inspectedBy: newLogForm.inspectedBy
    };

    setDailyLogs([newLog, ...dailyLogs]);
    setSelectedLog(newLog);
    setIsAddLogOpen(false);
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            {language === 'am' ? 'የግንባታ ሳይት ዕለታዊ ሪፖርት (Site Daily Diary)' : 'Construction Site Daily Diary'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'am'
              ? 'የአየር ሁኔታ፣ የሰው ኃይል፣ ማሽነሪዎች፣ የተከናወኑ ስራዎች እና የደህንነት ክስተቶች'
              : 'Log daily weather, workforce headcount, active fleet, executed works, and safety inspections.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddLogOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newDailyLog')}</span>
        </button>
      </div>

      {/* Grid: Left log list selector + Right full diary details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Diary entries history */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {language === 'am' ? 'የቅርብ የቀን ሪፖርቶች' : 'Recent Daily Logs'}
          </span>
          <div className="space-y-2">
            {dailyLogs.map((log) => {
              const proj = getProject(log.projectId);
              const isSelected = selectedLog?.id === log.id;
              const totalWorkers = Object.values(log.workforceHeadcount).reduce((a, b) => a + b, 0);

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/50 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white">{log.date}</span>
                    <span className="text-xs">
                      {log.weather === 'sunny' ? '☀️ ጸሃያማ' : '☁️ ደመናማ'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-amber-300 truncate">
                    {proj ? (language === 'am' ? proj.nameAm : proj.nameEn) : 'Project Site'}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    {language === 'am' ? log.workExecutedAm : log.workExecutedEn}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80 font-mono">
                    <span>{totalWorkers} ሰራተኞች</span>
                    <span>{log.machineryActiveCount} ማሽነሪዎች</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Full Detail Document View of Selected Log */}
        {selectedLog && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {getProject(selectedLog.projectId)?.code || 'PRJ-AA-01'}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {language === 'am' ? 'ዕለታዊ የሳይት ዳይሪ ሪፖርት' : 'Daily Site Diary Log'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {language === 'am' ? 'ቀን:' : 'Date:'} {selectedLog.date} · {getProject(selectedLog.projectId)?.nameAm}
                </p>
              </div>

              <button
                onClick={() => onPrintLog(selectedLog)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'am' ? 'ሪፖርቱን አትም (Print)' : 'Print Diary Sheet'}</span>
              </button>
            </div>

            {/* Weather & Site Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">{t('weather')}</span>
                <span className="font-semibold text-white">
                  {selectedLog.weather === 'sunny' ? '☀️ ጸሃያማና ምቹ (Sunny)' : '☁️ ደመናማ (Cloudy)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{t('siteCondition')}</span>
                <span className="text-slate-200">{selectedLog.siteConditions}</span>
              </div>
            </div>

            {/* Workforce Deployment Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{language === 'am' ? 'የተሰማራ የሰው ኃይል በሙያ (Manpower Headcount)' : 'Manpower Headcount'}</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">መሃንዲሶች</span>
                  <span className="font-mono font-bold text-white">{selectedLog.workforceHeadcount.engineers}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">ፎርማኖች</span>
                  <span className="font-mono font-bold text-white">{selectedLog.workforceHeadcount.foremen}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">ግንበኞች (Masons)</span>
                  <span className="font-mono font-bold text-white">{selectedLog.workforceHeadcount.masons}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">አናጺዎች (Carpenters)</span>
                  <span className="font-mono font-bold text-white">{selectedLog.workforceHeadcount.carpenters}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">ብረት አሳሪዎች</span>
                  <span className="font-mono font-bold text-white">{selectedLog.workforceHeadcount.barBenders}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">የቀን ሰራተኞች</span>
                  <span className="font-mono font-bold text-amber-400">{selectedLog.workforceHeadcount.dailyLaborers}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">ኦፕሬተሮች</span>
                  <span className="font-mono font-bold text-white">{selectedLog.workforceHeadcount.operators}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">ማሽነሪዎች</span>
                  <span className="font-mono font-bold text-purple-400">{selectedLog.machineryActiveCount} በስራ ላይ</span>
                </div>
              </div>
            </div>

            {/* Works Executed & Deliveries */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('executedWorks')}</span>
                </span>
                <p className="text-slate-200 leading-relaxed pt-1">
                  {language === 'am' ? selectedLog.workExecutedAm : selectedLog.workExecutedEn}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-blue-400" />
                  <span>{t('materialsReceivedToday')}</span>
                </span>
                <p className="text-slate-300 pt-1">
                  {language === 'am' ? selectedLog.materialsReceivedAm : selectedLog.materialsReceivedEn}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>{t('safetyIssues')}</span>
                </span>
                <p className="text-slate-300 pt-1">
                  {language === 'am' ? selectedLog.safetyIncidentsAm : selectedLog.safetyIncidentsEn}
                </p>
              </div>
            </div>

            {/* Verification Sign-offs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">{t('preparedBy')}</span>
                <span className="font-semibold text-white">{selectedLog.preparedBy}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">{t('inspectedBy')}</span>
                <span className="font-semibold text-white">{selectedLog.inspectedBy}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Daily Log Modal */}
      {isAddLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{t('newDailyLog')}</span>
              </h3>
              <button
                onClick={() => setIsAddLogOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('date')} *</label>
                  <input
                    type="date"
                    required
                    value={newLogForm.date}
                    onChange={(e) => setNewLogForm({ ...newLogForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('projects')} *</label>
                  <select
                    value={newLogForm.projectId}
                    onChange={(e) => setNewLogForm({ ...newLogForm, projectId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {language === 'am' ? p.nameAm : p.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('weather')}</label>
                  <select
                    value={newLogForm.weather}
                    onChange={(e) => setNewLogForm({ ...newLogForm, weather: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="sunny">☀️ ጸሃያማ (Sunny)</option>
                    <option value="cloudy">☁️ ደመናማ (Cloudy)</option>
                    <option value="rainy">🌧️ ዝናባማ (Rainy)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">የሳይት አጠቃላይ ሁኔታ</label>
                <input
                  type="text"
                  value={newLogForm.siteConditions}
                  onChange={(e) => setNewLogForm({ ...newLogForm, siteConditions: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              {/* Headcounts */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-300 block mb-2">የሰራተኛ ብዛት በሳይት ላይ (Headcount)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block">መሃንዲስ</label>
                    <input
                      type="number"
                      value={newLogForm.engineers}
                      onChange={(e) => setNewLogForm({ ...newLogForm, engineers: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">ፎርማን</label>
                    <input
                      type="number"
                      value={newLogForm.foremen}
                      onChange={(e) => setNewLogForm({ ...newLogForm, foremen: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">ግንበኞች</label>
                    <input
                      type="number"
                      value={newLogForm.masons}
                      onChange={(e) => setNewLogForm({ ...newLogForm, masons: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">አናጺዎች</label>
                    <input
                      type="number"
                      value={newLogForm.carpenters}
                      onChange={(e) => setNewLogForm({ ...newLogForm, carpenters: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">ብረት አሳሪዎች</label>
                    <input
                      type="number"
                      value={newLogForm.barBenders}
                      onChange={(e) => setNewLogForm({ ...newLogForm, barBenders: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">የቀን ሰራተኞች</label>
                    <input
                      type="number"
                      value={newLogForm.dailyLaborers}
                      onChange={(e) => setNewLogForm({ ...newLogForm, dailyLaborers: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono text-amber-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">ኦፕሬተሮች</label>
                    <input
                      type="number"
                      value={newLogForm.operators}
                      onChange={(e) => setNewLogForm({ ...newLogForm, operators: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">በስራ ላይ ያሉ ማሽኖች</label>
                    <input
                      type="number"
                      value={newLogForm.machineryActiveCount}
                      onChange={(e) => setNewLogForm({ ...newLogForm, machineryActiveCount: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono text-purple-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('executedWorks')} *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="ዛሬ በሳይቱ ላይ የተሰሩ ዋና ዋና ተግባራት..."
                  value={newLogForm.workExecutedAm}
                  onChange={(e) => setNewLogForm({ ...newLogForm, workExecutedAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('materialsReceivedToday')}</label>
                <input
                  type="text"
                  placeholder="ምሳሌ፡ 800 ኩንታል ዳንጎቴ ሲሚንቶ፣ 15 ቶን ብረት"
                  value={newLogForm.materialsReceivedAm}
                  onChange={(e) => setNewLogForm({ ...newLogForm, materialsReceivedAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('safetyIssues')}</label>
                <input
                  type="text"
                  value={newLogForm.safetyIncidentsAm}
                  onChange={(e) => setNewLogForm({ ...newLogForm, safetyIncidentsAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLogOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
