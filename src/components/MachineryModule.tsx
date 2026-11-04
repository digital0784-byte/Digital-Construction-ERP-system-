import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Plus, 
  Wrench, 
  Fuel, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Gauge,
  Activity
} from 'lucide-react';
import { Machinery, Project } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MachineryModuleProps {
  machinery: Machinery[];
  setMachinery: React.Dispatch<React.SetStateAction<Machinery[]>>;
  projects: Project[];
}

export const MachineryModule: React.FC<MachineryModuleProps> = ({
  machinery,
  setMachinery,
  projects
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [logHoursModal, setLogHoursModal] = useState<Machinery | null>(null);
  const [dailyHoursInput, setDailyHoursInput] = useState('');

  const [newEquipmentForm, setNewEquipmentForm] = useState({
    code: `EQP-${Date.now().toString().slice(-4)}`,
    nameAm: '',
    nameEn: '',
    type: 'excavator' as Machinery['type'],
    plateNumber: '',
    assignedProjectId: projects[0]?.id || '',
    operatorName: '',
    fuelConsumptionLph: '20',
    totalOperatingHours: '0',
    nextServiceHours: '500'
  });

  const filteredMachinery = machinery.filter((m) => {
    const matchesSearch = 
      m.nameAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.operatorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateEquipmentStatus = (id: string, newStatus: Machinery['status']) => {
    setMachinery(machinery.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logHoursModal || !dailyHoursInput) return;

    const addedHours = Number(dailyHoursInput);
    setMachinery(machinery.map(m => {
      if (m.id !== logHoursModal.id) return m;
      return {
        ...m,
        dailyOperatingHours: addedHours,
        totalOperatingHours: m.totalOperatingHours + addedHours
      };
    }));

    setLogHoursModal(null);
    setDailyHoursInput('');
  };

  const handleAddNewEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquipmentForm.nameAm && !newEquipmentForm.nameEn) return;

    const newEqp: Machinery = {
      id: `eqp-${Date.now()}`,
      code: newEquipmentForm.code,
      nameAm: newEquipmentForm.nameAm || newEquipmentForm.nameEn,
      nameEn: newEquipmentForm.nameEn || newEquipmentForm.nameAm,
      type: newEquipmentForm.type,
      plateNumber: newEquipmentForm.plateNumber || 'መሳሪያ-NEW',
      assignedProjectId: newEquipmentForm.assignedProjectId,
      status: 'operational',
      operatorName: newEquipmentForm.operatorName || 'ያልተመደበ',
      dailyOperatingHours: 0,
      totalOperatingHours: Number(newEquipmentForm.totalOperatingHours) || 0,
      fuelConsumptionLph: Number(newEquipmentForm.fuelConsumptionLph) || 20,
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceHours: Number(newEquipmentForm.nextServiceHours) || 1000
    };

    setMachinery([...machinery, newEqp]);
    setIsAddModalOpen(false);
  };

  const getProjectName = (projId: string) => {
    const p = projects.find(item => item.id === projId);
    return p ? (language === 'am' ? p.nameAm : p.nameEn) : 'ዋና ዴፖ / ቃሊቲ';
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'am' ? 'በማሽኑ ስም፣ ኮድ፣ ታርጋ ወይም ኦፕሬተር ፈልግ...' : 'Search equipment, code, plate, operator...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'operational', 'maintenance', 'idle', 'breakdown'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') :
                 st === 'operational' ? (language === 'am' ? 'በስራ ላይ' : 'Operational') :
                 st === 'maintenance' ? (language === 'am' ? 'ጥገና' : 'Maintenance') :
                 st === 'idle' ? (language === 'am' ? 'ስራ የፈታ' : 'Idle') :
                 (language === 'am' ? 'የተበላሸ' : 'Breakdown')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('registerMachinery')}</span>
        </button>
      </div>

      {/* Machinery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachinery.map((eqp) => {
          const isDueForService = eqp.totalOperatingHours >= eqp.nextServiceHours - 50;
          return (
            <div
              key={eqp.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {eqp.code}
                  </span>
                  {/* Status Dropdown */}
                  <select
                    value={eqp.status}
                    onChange={(e) => updateEquipmentStatus(eqp.id, e.target.value as any)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                      eqp.status === 'operational' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      eqp.status === 'maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      eqp.status === 'idle' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    <option value="operational" className="bg-slate-900 text-white">{language === 'am' ? 'በስራ ላይ' : 'Operational'}</option>
                    <option value="maintenance" className="bg-slate-900 text-white">{language === 'am' ? 'ጥገና ላይ' : 'In Maintenance'}</option>
                    <option value="idle" className="bg-slate-900 text-white">{language === 'am' ? 'ስራ የፈታ' : 'Idle'}</option>
                    <option value="breakdown" className="bg-slate-900 text-white">{language === 'am' ? 'የተበላሸ' : 'Breakdown'}</option>
                  </select>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {language === 'am' ? eqp.nameAm : eqp.nameEn}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {language === 'am' ? 'ታርጋ:' : 'Plate:'} {eqp.plateNumber}
                </p>

                <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">{t('assignedProject')}</span>
                    <span className="font-medium truncate max-w-[150px]">{getProjectName(eqp.assignedProjectId)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">{t('operator')}</span>
                    <span className="font-medium">{eqp.operatorName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 font-mono">
                    <span className="text-slate-500">{t('fuelConsumption')}</span>
                    <span className="text-amber-400">{eqp.fuelConsumptionLph} L/hr</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('totalHours')}</span>
                  </span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {eqp.totalOperatingHours.toLocaleString()} hrs
                  </span>
                </div>

                {isDueForService && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 p-1.5 rounded mb-2 border border-amber-500/20">
                    <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{language === 'am' ? 'ሰርቪስ ይፈልጋል!' : 'Service due soon!'} ({eqp.nextServiceHours} hrs)</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {language === 'am' ? 'የዛሬ ሰዓት:' : 'Today:'} <b className="text-amber-400">{eqp.dailyOperatingHours}h</b>
                  </span>
                  <button
                    onClick={() => {
                      setLogHoursModal(eqp);
                      setDailyHoursInput(String(eqp.dailyOperatingHours || ''));
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium cursor-pointer"
                  >
                    {language === 'am' ? 'ሰዓት መዝግብ' : 'Log Hours'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Hours Modal */}
      {logHoursModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {language === 'am' ? 'የዛሬ የስራ ሰዓት መዝግብ' : 'Log Operating Hours'}
              </h3>
              <button
                onClick={() => setLogHoursModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono">
              {language === 'am' ? logHoursModal.nameAm : logHoursModal.nameEn} ({logHoursModal.code})
            </p>

            <form onSubmit={handleLogHours} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'am' ? 'የዛሬ የስራ ሰዓት (በሰዓት)' : 'Operating Hours Run Today'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min="0"
                  max="24"
                  placeholder="8.0"
                  value={dailyHoursInput}
                  onChange={(e) => setDailyHoursInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-base"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setLogHoursModal(null)}
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

      {/* Add New Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span>{t('registerMachinery')}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewEquipment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('machineryCode')} *</label>
                  <input
                    type="text"
                    required
                    value={newEquipmentForm.code}
                    onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('machineryType')}</label>
                  <select
                    value={newEquipmentForm.type}
                    onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="excavator">ኤክስካቫተር (Excavator)</option>
                    <option value="crane">ተንቀሳቃሽ ክሬን (Mobile Crane)</option>
                    <option value="mixer">ኮንክሪት ሚክሰር (Concrete Mixer)</option>
                    <option value="dump_truck">ዳምፕ ትራክ / ሲኖትራክ (Dump Truck)</option>
                    <option value="loader">ዊል ሎደር (Wheel Loader)</option>
                    <option value="generator">ጀነሬተር (Generator)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'am' ? 'የማሽኑ ስም (አማርኛ) *' : 'Equipment Name (Amharic) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ ካት 330D ሃይድሮሊክ ኤክስካቫተር"
                  value={newEquipmentForm.nameAm}
                  onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, nameAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('plateNumber')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="ኮድ 3-A1208"
                    value={newEquipmentForm.plateNumber}
                    onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, plateNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('operator')}</label>
                  <input
                    type="text"
                    placeholder="ሙሉጌታ አያሌው"
                    value={newEquipmentForm.operatorName}
                    onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, operatorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('assignedProject')}</label>
                  <select
                    value={newEquipmentForm.assignedProjectId}
                    onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, assignedProjectId: e.target.value })}
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
                  <label className="block text-slate-400 mb-1">{t('fuelConsumption')} (L/hr)</label>
                  <input
                    type="number"
                    value={newEquipmentForm.fuelConsumptionLph}
                    onChange={(e) => setNewEquipmentForm({ ...newEquipmentForm, fuelConsumptionLph: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
