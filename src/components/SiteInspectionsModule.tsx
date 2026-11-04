import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  X,
  Filter,
  Check,
  Building,
  Calendar,
  UserCheck
} from 'lucide-react';
import { SiteInspectionItem, Project, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SiteInspectionsModuleProps {
  inspections: SiteInspectionItem[];
  setInspections: React.Dispatch<React.SetStateAction<SiteInspectionItem[]>>;
  projects: Project[];
  currentUserRole: UserRole;
}

export const SiteInspectionsModule: React.FC<SiteInspectionsModuleProps> = ({
  inspections,
  setInspections,
  projects,
  currentUserRole
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);

  // New Inspection Form
  const [newInspectionForm, setNewInspectionForm] = useState({
    category: 'structural' as SiteInspectionItem['category'],
    titleAm: '',
    titleEn: '',
    status: 'passed' as SiteInspectionItem['status'],
    notes: '',
    projectId: projects[0]?.id || '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredInspections = inspections.filter((item) => {
    const matchesSearch = 
      item.titleAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inspectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const getInspectorDefaultName = () => {
    if (currentUserRole === 'site_engineer') return 'ኢ/ር ትዕግስት ሃይሉ (Site Engineer)';
    if (currentUserRole === 'site_supervisor') return 'ሱፐርቫይዘር ታደሰ ወርቁ (Site Supervisor)';
    return 'ኢ/ር አለማየሁ በቀለ (Project Manager)';
  };

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspectionForm.titleAm && !newInspectionForm.titleEn) return;

    const newItem: SiteInspectionItem = {
      id: `insp-${Date.now()}`,
      category: newInspectionForm.category,
      titleAm: newInspectionForm.titleAm || newInspectionForm.titleEn,
      titleEn: newInspectionForm.titleEn || newInspectionForm.titleAm,
      status: newInspectionForm.status,
      notes: newInspectionForm.notes,
      inspectorName: getInspectorDefaultName(),
      date: newInspectionForm.date,
      projectId: newInspectionForm.projectId
    };

    setInspections([newItem, ...inspections]);
    setIsNewInspectionOpen(false);
    setNewInspectionForm({
      category: 'structural',
      titleAm: '',
      titleEn: '',
      status: 'passed',
      notes: '',
      projectId: projects[0]?.id || '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const updateItemStatus = (id: string, newStatus: SiteInspectionItem['status']) => {
    setInspections(inspections.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  return (
    <div className="space-y-6">
      {/* Top Banner with Field Inspection Visual */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="relative h-44 sm:h-52 w-full">
          <img
            src="/src/assets/images/site_engineer_action_1793796135049.jpg"
            alt="Site Inspection in Action"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />
          
          <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <span className="uppercase tracking-wider">
                  {language === 'am' ? 'የመስክ ጥራትና ደህንነት ፍተሻ' : 'FIELD QUALITY & QA/QC AUDIT'}
                </span>
                <span>·</span>
                <span className="text-slate-300 font-normal">
                  {currentUserRole === 'site_engineer' ? 'Site Engineer Mode' :
                   currentUserRole === 'site_supervisor' ? 'Site Supervisor Mode' : 'Project Manager Mode'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {language === 'am' ? 'የሳይት መሃንዲስና ሱፐርቫይዘር የፍተሻ ማረጋገጫ' : 'Site Engineer & Supervisor Inspection Checklist'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {language === 'am'
                  ? 'የብረት አርማታ፣ የፎርምዎርክ ልኬት፣ የኮንክሪት ከቨር ብሎክ፣ ፕላምብላይንና የደህንነት መስፈርቶች'
                  : 'Rebar spacing, formwork alignment, plumbness, concrete cover blocks, and HSE compliance.'}
              </p>
            </div>

            <button
              onClick={() => setIsNewInspectionOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'am' ? 'አዲስ ፍተሻ መዝግብ' : 'Log Field Inspection'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 block text-[11px]">{language === 'am' ? 'ጠቅላላ ፍተሻዎች' : 'Total Inspections'}</span>
          <span className="text-xl font-bold font-mono text-white mt-1 tabular-nums">{inspections.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 block text-[11px]">{language === 'am' ? 'የጸደቁ (Passed)' : 'Approved / Passed'}</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {inspections.filter(i => i.status === 'passed').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 block text-[11px]">{language === 'am' ? 'እርማት የሚሹ (Rectify)' : 'Need Rectification'}</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {inspections.filter(i => i.status === 'rectify').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 block text-[11px]">{language === 'am' ? 'አሳሳቢ / የተቋረጡ' : 'Critical / Stop Work'}</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {inspections.filter(i => i.status === 'critical').length}
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'am' ? 'በፍተሻ ርዕስ፣ ማስታወሻ ወይም መሃንዲስ ስም ፈልግ...' : 'Search inspection item, notes, engineer...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'structural', 'safety', 'workmanship', 'materials'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                  categoryFilter === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') :
                 cat === 'structural' ? (language === 'am' ? 'መዋቅራዊ (Structural)' : 'Structural') :
                 cat === 'safety' ? (language === 'am' ? 'ደህንነት (HSE)' : 'Safety') :
                 cat === 'workmanship' ? (language === 'am' ? 'የስራ ጥራት' : 'Workmanship') :
                 (language === 'am' ? 'እቃዎች' : 'Materials')}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          {['all', 'passed', 'rectify', 'critical'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                statusFilter === st ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? (language === 'am' ? 'ሁሉም ሁኔታ' : 'All Status') :
               st === 'passed' ? (language === 'am' ? 'ያለፈ (Passed)' : 'Passed') :
               st === 'rectify' ? (language === 'am' ? 'እርማት' : 'Rectify') :
               (language === 'am' ? 'አሳሳቢ' : 'Critical')}
            </button>
          ))}
        </div>
      </div>

      {/* Inspections List */}
      <div className="space-y-3">
        {filteredInspections.map((item) => {
          const proj = getProject(item.projectId);
          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    item.category === 'structural' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    item.category === 'safety' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    item.category === 'workmanship' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}>
                    {item.category}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{item.date}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-300 font-semibold">{proj ? (language === 'am' ? proj.nameAm : proj.nameEn) : 'Project'}</span>
                </div>

                <h3 className="text-sm font-bold text-white">
                  {language === 'am' ? item.titleAm : item.titleEn}
                </h3>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {item.notes}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'am' ? 'የፈተሸው መሃንዲስ/ሱፐርቫይዘር:' : 'Inspected by:'} {item.inspectorName}</span>
                </div>
              </div>

              {/* Status Action Controls */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <select
                  value={item.status}
                  onChange={(e) => updateItemStatus(item.id, e.target.value as any)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                    item.status === 'passed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    item.status === 'rectify' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                    item.status === 'critical' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <option value="passed" className="bg-slate-900 text-white">✓ {language === 'am' ? 'ያለፈ (Passed)' : 'Passed'}</option>
                  <option value="rectify" className="bg-slate-900 text-white">⚠️ {language === 'am' ? 'እርማት ያስፈልጋል (Rectify)' : 'Rectify'}</option>
                  <option value="critical" className="bg-slate-900 text-white">🛑 {language === 'am' ? 'አሳሳቢ / አቁም (Critical)' : 'Critical / Stop'}</option>
                  <option value="pending" className="bg-slate-900 text-white">⏳ {language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending'}</option>
                </select>

                <span className="text-[10px] text-slate-500 font-mono">
                  ID: {item.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Inspection Modal */}
      {isNewInspectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-400" />
                <span>{language === 'am' ? 'አዲስ የሳይት ፍተሻ መዝግብ' : 'Record Field Inspection'}</span>
              </h3>
              <button
                onClick={() => setIsNewInspectionOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">የፍተሻ ምድብ (Category) *</label>
                  <select
                    value={newInspectionForm.category}
                    onChange={(e) => setNewInspectionForm({ ...newInspectionForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="structural">መዋቅራዊ ብረት/ኮንክሪት (Structural)</option>
                    <option value="safety">ደህንነትና ጥበቃ (HSE/Safety)</option>
                    <option value="workmanship">የስራ ጥራትና ልኬት (Workmanship)</option>
                    <option value="materials">የእቃዎች ጥራት ፍተሻ (Materials)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">የሳይት ፕሮጀክት</label>
                  <select
                    value={newInspectionForm.projectId}
                    onChange={(e) => setNewInspectionForm({ ...newInspectionForm, projectId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {language === 'am' ? p.nameAm : p.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">የተፈተሸው ስራ ዝርዝር ርዕስ (አማርኛ) *</label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ 12ኛ ፎቅ የሰሌዳ ብረት አርማታ ክፍተትና ከቨር ብሎክ"
                  value={newInspectionForm.titleAm}
                  onChange={(e) => setNewInspectionForm({ ...newInspectionForm, titleAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">የፍተሻ ውጤት (Status)</label>
                  <select
                    value={newInspectionForm.status}
                    onChange={(e) => setNewInspectionForm({ ...newInspectionForm, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="passed">✓ ያለፈ / የጸደቀ (Passed)</option>
                    <option value="rectify">⚠️ እርማት የሚያስፈልገው (Rectify)</option>
                    <option value="critical">🛑 አሳሳቢ / ስራ አቁም (Critical)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ቀን (Date)</label>
                  <input
                    type="date"
                    value={newInspectionForm.date}
                    onChange={(e) => setNewInspectionForm({ ...newInspectionForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">የመሃንዲሱ/ሱፐርቫይዘሩ ማስታወሻና መመሪያዎች</label>
                <textarea
                  rows={3}
                  required
                  placeholder="የተገኘው ውጤት፣ የጎደሉ ነገሮችና ለፎርማኑ የተሰጠ ትዕዛዝ..."
                  value={newInspectionForm.notes}
                  onChange={(e) => setNewInspectionForm({ ...newInspectionForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewInspectionOpen(false)}
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
