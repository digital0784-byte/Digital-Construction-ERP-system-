import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Phone, 
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { Worker, AttendanceRecord, Project } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LaborModuleProps {
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  projects: Project[];
}

export const LaborModule: React.FC<LaborModuleProps> = ({
  workers,
  setWorkers,
  attendance,
  setAttendance,
  projects
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTabSub, setActiveTabSub] = useState<'roster' | 'attendance' | 'payroll'>('roster');

  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Form State for Adding Worker
  const [newWorkerForm, setNewWorkerForm] = useState({
    empCode: `EMP-${String(workers.length + 1).padStart(3, '0')}`,
    fullNameAm: '',
    fullNameEn: '',
    role: 'Mason (ግንበኛ)',
    employmentType: 'daily_labor' as Worker['employmentType'],
    dailyRate: '450',
    assignedProjectId: projects[0]?.id || '',
    phone: '+251 9',
    nationalId: ''
  });

  // Attendance Form
  const [attendanceForm, setAttendanceForm] = useState({
    workerId: workers[0]?.id || '',
    hoursWorked: '8',
    overtimeHours: '0',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch = 
      w.fullNameAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.fullNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || w.employmentType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerForm.fullNameAm && !newWorkerForm.fullNameEn) return;

    const worker: Worker = {
      id: `w-${Date.now()}`,
      empCode: newWorkerForm.empCode,
      fullNameAm: newWorkerForm.fullNameAm || newWorkerForm.fullNameEn,
      fullNameEn: newWorkerForm.fullNameEn || newWorkerForm.fullNameAm,
      role: newWorkerForm.role,
      employmentType: newWorkerForm.employmentType,
      dailyRate: Number(newWorkerForm.dailyRate) || 450,
      assignedProjectId: newWorkerForm.assignedProjectId,
      phone: newWorkerForm.phone,
      status: 'active',
      nationalId: newWorkerForm.nationalId || `ET-${Date.now().toString().slice(-6)}`
    };

    setWorkers([...workers, worker]);
    setIsAddWorkerOpen(false);
  };

  const handleLogAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const targetWorker = workers.find(w => w.id === attendanceForm.workerId);
    if (!targetWorker) return;

    const hours = Number(attendanceForm.hoursWorked);
    const ot = Number(attendanceForm.overtimeHours);
    const hourlyRate = targetWorker.dailyRate / 8;
    const totalWage = Math.round((hours * hourlyRate) + (ot * hourlyRate * 1.5));

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      date: attendanceForm.date,
      workerId: targetWorker.id,
      projectId: targetWorker.assignedProjectId,
      hoursWorked: hours,
      overtimeHours: ot,
      dailyPay: totalWage,
      paidStatus: 'pending'
    };

    setAttendance([newRecord, ...attendance]);
    setIsAttendanceModalOpen(false);
  };

  const updateAttendancePaidStatus = (attId: string, status: AttendanceRecord['paidStatus']) => {
    setAttendance(attendance.map(a => a.id === attId ? { ...a, paidStatus: status } : a));
  };

  const totalPayrollPending = attendance
    .filter(a => a.paidStatus === 'pending')
    .reduce((sum, a) => sum + a.dailyPay, 0);

  const totalPayrollPaid = attendance
    .filter(a => a.paidStatus === 'paid')
    .reduce((sum, a) => sum + a.dailyPay, 0);

  return (
    <div className="space-y-6">
      {/* Sub Tabs: Roster vs Attendance vs Payroll */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTabSub('roster')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTabSub === 'roster'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'am' ? 'የሰራተኞች ማህደር' : 'Workforce Roster'} ({workers.length})
          </button>
          <button
            onClick={() => setActiveTabSub('attendance')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTabSub === 'attendance'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'am' ? 'የቀን አቴንዳንስ' : 'Daily Attendance'}
          </button>
          <button
            onClick={() => setActiveTabSub('payroll')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTabSub === 'payroll'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'am' ? 'የደመወዝ ክፍያ ማጠቃለያ' : 'Wage Payout Sheet'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAttendanceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer border border-slate-700"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('markAttendance')}</span>
          </button>
          <button
            onClick={() => setIsAddWorkerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'አዲስ ሰራተኛ ጨምር' : 'Add Worker'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: WORKFORCE ROSTER */}
      {activeTabSub === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'am' ? 'በስም፣ መለያ ኮድ ወይም ሙያ ፈልግ...' : 'Search name, code, role...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {['all', 'permanent', 'contract', 'daily_labor'].map((tp) => (
                <button
                  key={tp}
                  onClick={() => setTypeFilter(tp)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                    typeFilter === tp ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tp === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') :
                   tp === 'permanent' ? (language === 'am' ? 'ቋሚ ሰራተኛ' : 'Permanent') :
                   tp === 'contract' ? (language === 'am' ? 'ኮንትራት' : 'Contract') :
                   (language === 'am' ? 'የቀን ሰራተኛ' : 'Daily Labor')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-4">{t('empCode')}</th>
                  <th className="py-3 px-4">{t('workerName')}</th>
                  <th className="py-3 px-4">{t('role')}</th>
                  <th className="py-3 px-4">{t('employmentType')}</th>
                  <th className="py-3 px-4 text-right">{t('dailyRate')}</th>
                  <th className="py-3 px-4">{language === 'am' ? 'ስልክ' : 'Phone'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-amber-400">
                      {w.empCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">
                        {language === 'am' ? w.fullNameAm : w.fullNameEn}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {w.nationalId}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {w.role}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        w.employmentType === 'permanent' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        w.employmentType === 'contract' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}>
                        {w.employmentType === 'permanent' ? (language === 'am' ? 'ቋሚ' : 'Permanent') :
                         w.employmentType === 'contract' ? (language === 'am' ? 'ኮንትራት' : 'Contract') :
                         (language === 'am' ? 'የቀን' : 'Daily Labor')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-200 tabular-nums">
                      {w.dailyRate} ETB
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {w.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: DAILY ATTENDANCE & LOGS */}
      {activeTabSub === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {language === 'am' ? 'የቅርብ የቀን መገኘትና የሰዓት መዝገብ' : 'Recent Daily Attendance Log'}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {attendance.length} {language === 'am' ? 'መዝገቦች' : 'records'}
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-4">{t('date')}</th>
                  <th className="py-3 px-4">{t('workerName')}</th>
                  <th className="py-3 px-4 text-center">{language === 'am' ? 'መደበኛ ሰዓት' : 'Regular Hours'}</th>
                  <th className="py-3 px-4 text-center">{language === 'am' ? 'የትርፍ ሰዓት (OT)' : 'Overtime'}</th>
                  <th className="py-3 px-4 text-right">{language === 'am' ? 'የቀን ክፍያ' : 'Day Total Pay'}</th>
                  <th className="py-3 px-4 text-center">{t('status')}</th>
                  <th className="py-3 px-4 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attendance.map((rec) => {
                  const worker = workers.find(w => w.id === rec.workerId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {rec.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">
                          {worker ? (language === 'am' ? worker.fullNameAm : worker.fullNameEn) : 'Worker'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {worker?.role}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {rec.hoursWorked}h
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-amber-400">
                        {rec.overtimeHours > 0 ? `+${rec.overtimeHours}h` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                        {rec.dailyPay.toLocaleString()} ETB
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          rec.paidStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          rec.paidStatus === 'approved' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}>
                          {rec.paidStatus === 'paid' ? (language === 'am' ? 'የተከፈለ' : 'Paid') :
                           rec.paidStatus === 'approved' ? (language === 'am' ? 'የጸደቀ' : 'Approved') :
                           (language === 'am' ? 'በመጠባበቅ' : 'Pending')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {rec.paidStatus !== 'paid' ? (
                          <button
                            onClick={() => updateAttendancePaidStatus(rec.id, 'paid')}
                            className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30 cursor-pointer"
                          >
                            {language === 'am' ? 'ክፈለው' : 'Mark Paid'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">✓ {language === 'am' ? 'ተጠናቋል' : 'Closed'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: WAGE PAYROLL SUMMARY */}
      {activeTabSub === 'payroll' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 block">{language === 'am' ? 'የተከፈለ የጉልበት ወጪ' : 'Paid Wages'}</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {totalPayrollPaid.toLocaleString()} ETB
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 block">{language === 'am' ? 'የሚጠብቅ ክፍያ (Pending)' : 'Pending Payouts'}</span>
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {totalPayrollPending.toLocaleString()} ETB
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 block">{language === 'am' ? 'ጠቅላላ የሰራተኛ ብዛት' : 'Total Registered Staff'}</span>
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {workers.length} {language === 'am' ? 'ሰራተኞች' : 'persons'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-3">
            <CreditCard className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-white">
              {language === 'am' ? 'የቀን ሰራተኞች ክፍያ ሮስተር (Payroll Sheet)' : 'Daily Laborers Payroll Sheet'}
            </h4>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              {language === 'am'
                ? 'የሳይት ሱፐርቫይዘር እና የፋይናንስ ኦዲተር ፊርማ ያለበት ይፋዊ የደመወዝ ክፍያ ሰነድ ማዘጋጀትና ማተም ይችላሉ።'
                : 'Generate official signed payroll disbursement vouchers for site laborers and trade teams.'}
            </p>
          </div>
        </div>
      )}

      {/* Mark Attendance Modal */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>{t('markAttendance')}</span>
              </h3>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogAttendance} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">{t('workerName')} *</label>
                <select
                  value={attendanceForm.workerId}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, workerId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {language === 'am' ? w.fullNameAm : w.fullNameEn} ({w.role} - {w.dailyRate} ETB/ቀን)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('date')}</label>
                <input
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{language === 'am' ? 'የስራ ሰዓት' : 'Standard Hours'}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={attendanceForm.hoursWorked}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, hoursWorked: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{language === 'am' ? 'የትርፍ ሰዓት (OT)' : 'Overtime Hours'}</label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={attendanceForm.overtimeHours}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, overtimeHours: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
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

      {/* Add Worker Modal */}
      {isAddWorkerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>{language === 'am' ? 'አዲስ ሰራተኛ መዝግብ' : 'Add Worker to Roster'}</span>
              </h3>
              <button
                onClick={() => setIsAddWorkerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWorker} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('empCode')} *</label>
                  <input
                    type="text"
                    required
                    value={newWorkerForm.empCode}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, empCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('employmentType')}</label>
                  <select
                    value={newWorkerForm.employmentType}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, employmentType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="daily_labor">የቀን ሰራተኛ (Daily Labor)</option>
                    <option value="contract">ኮንትራት (Contractor)</option>
                    <option value="permanent">ቋሚ ሰራተኛ (Permanent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('workerName')} (አማርኛ) *</label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ ካሳሁን ደስታ"
                  value={newWorkerForm.fullNameAm}
                  onChange={(e) => setNewWorkerForm({ ...newWorkerForm, fullNameAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('role')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="ግንበኛ / አናጺ / ፎርማን / ረዳት"
                    value={newWorkerForm.role}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('dailyRate')} (ETB) *</label>
                  <input
                    type="number"
                    required
                    placeholder="450"
                    value={newWorkerForm.dailyRate}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, dailyRate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{language === 'am' ? 'ስልክ ቁጥር' : 'Phone'}</label>
                  <input
                    type="text"
                    value={newWorkerForm.phone}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{language === 'am' ? 'የመታወቂያ ቁጥር' : 'National ID'}</label>
                  <input
                    type="text"
                    placeholder="ET-AA-123456"
                    value={newWorkerForm.nationalId}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, nationalId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
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
