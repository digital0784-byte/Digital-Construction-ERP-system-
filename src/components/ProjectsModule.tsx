import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  DollarSign, 
  User, 
  CheckSquare, 
  Square,
  Building,
  Briefcase
} from 'lucide-react';
import { Project, ProjectMilestone } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProjectsModuleProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  projects,
  setProjects,
  selectedProjectId,
  setSelectedProjectId
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  // Form State for New Project
  const [newProjectForm, setNewProjectForm] = useState({
    code: `PRJ-${String(projects.length + 1).padStart(2, '0')}`,
    nameAm: '',
    nameEn: '',
    client: '',
    location: '',
    contractValue: '',
    startDate: new Date().toISOString().split('T')[0],
    plannedEndDate: '2027-12-31',
    projectManager: '',
    siteEngineer: '',
    description: ''
  });

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.nameAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSelectedSite = selectedProjectId === 'all' || p.id === selectedProjectId;
    return matchesSearch && matchesStatus && matchesSelectedSite;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.nameAm && !newProjectForm.nameEn) return;

    const newProj: Project = {
      id: `prj-${Date.now()}`,
      code: newProjectForm.code || `PRJ-${Date.now().toString().slice(-4)}`,
      nameAm: newProjectForm.nameAm || newProjectForm.nameEn,
      nameEn: newProjectForm.nameEn || newProjectForm.nameAm,
      client: newProjectForm.client || 'Government/Private Client',
      location: newProjectForm.location || 'Ethiopia',
      contractValue: Number(newProjectForm.contractValue) || 10000000,
      budgetSpent: 0,
      startDate: newProjectForm.startDate,
      plannedEndDate: newProjectForm.plannedEndDate,
      status: 'active',
      progressPercentage: 5,
      projectManager: newProjectForm.projectManager || 'ኢ/ር አለማየሁ በቀለ',
      siteEngineer: newProjectForm.siteEngineer || 'ኢ/ር ትዕግስት ሃይሉ',
      description: newProjectForm.description,
      milestones: [
        { id: `m-${Date.now()}-1`, titleAm: 'የመሬት ጠረጋና የሳይት ዝግጅት', titleEn: 'Site Clearing & Mobilization', dueDate: newProjectForm.startDate, completed: true },
        { id: `m-${Date.now()}-2`, titleAm: 'የመሰረት ቁፋሮና ኮንክሪት ስራ', titleEn: 'Excavation & Foundation RC', dueDate: '2026-06-30', completed: false },
        { id: `m-${Date.now()}-3`, titleAm: 'የአወቃቀርና የሰሌዳ ስራዎች', titleEn: 'Superstructure Slab Casting', dueDate: '2026-12-31', completed: false }
      ]
    };

    setProjects([newProj, ...projects]);
    setIsCreateModalOpen(false);
    setNewProjectForm({
      code: `PRJ-${String(projects.length + 2).padStart(2, '0')}`,
      nameAm: '',
      nameEn: '',
      client: '',
      location: '',
      contractValue: '',
      startDate: new Date().toISOString().split('T')[0],
      plannedEndDate: '2027-12-31',
      projectManager: '',
      siteEngineer: '',
      description: ''
    });
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = p.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
      return {
        ...p,
        milestones: updatedMilestones,
        progressPercentage: newProgress
      };
    }));

    if (activeProjectModal && activeProjectModal.id === projectId) {
      setActiveProjectModal(prev => {
        if (!prev) return null;
        const updatedMilestones = prev.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
        return {
          ...prev,
          milestones: updatedMilestones,
          progressPercentage: newProgress
        };
      });
    }
  };

  const updateProjectProgress = (projectId: string, newProgress: number) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, progressPercentage: newProgress } : p));
    if (activeProjectModal && activeProjectModal.id === projectId) {
      setActiveProjectModal(prev => prev ? { ...prev, progressPercentage: newProgress } : null);
    }
  };

  const formatETB = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val) + (language === 'am' ? ' ብር' : ' ETB');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Filters & Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'am' ? 'በፕሮጀክት ስም፣ ኮድ ወይም ክላይንት ፈልግ...' : 'Search project, code, client...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status Filter Segmented Controls */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'active', 'delayed', 'on_hold', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') :
                 status === 'active' ? (language === 'am' ? 'በስራ ላይ' : 'Active') :
                 status === 'delayed' ? (language === 'am' ? 'የዘገየ' : 'Delayed') :
                 status === 'on_hold' ? (language === 'am' ? 'የታገደ' : 'On Hold') :
                 (language === 'am' ? 'የተጠናቀቀ' : 'Completed')}
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewProject')}</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {project.code}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">
                    {language === 'am' ? project.nameAm : project.nameEn}
                  </h3>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  project.status === 'delayed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {project.status === 'active' ? (language === 'am' ? 'በስራ ላይ' : 'Active') :
                   project.status === 'delayed' ? (language === 'am' ? 'የዘገየ' : 'Delayed') :
                   (language === 'am' ? 'የታገደ' : 'On Hold')}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('client')}</span>
                  <span className="font-medium truncate block">{project.client}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('location')}</span>
                  <span className="font-medium truncate block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    {project.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('contractValue')}</span>
                  <span className="font-mono font-semibold text-amber-300">
                    {(project.contractValue / 1000000).toFixed(1)} M ETB
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{t('budgetSpent')}</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {(project.budgetSpent / 1000000).toFixed(1)} M ETB
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">{t('progress')}</span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">
                  {project.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${project.progressPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{project.projectManager}</span>
                </div>
                <button
                  onClick={() => setActiveProjectModal(project)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  {t('viewDetails')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {activeProjectModal.code}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {language === 'am' ? activeProjectModal.nameAm : activeProjectModal.nameEn}
                </h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeProjectModal.location}</span>
                  <span>·</span>
                  <span>{t('client')}: {activeProjectModal.client}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial & Timeline Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-500 block">{t('contractValue')}</span>
                <span className="text-sm font-bold font-mono text-white tabular-nums">
                  {formatETB(activeProjectModal.contractValue)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">{t('budgetSpent')}</span>
                <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                  {formatETB(activeProjectModal.budgetSpent)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">{t('startDate')}</span>
                <span className="text-xs font-mono text-slate-300 tabular-nums">
                  {activeProjectModal.startDate}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">{t('endDate')}</span>
                <span className="text-xs font-mono text-slate-300 tabular-nums">
                  {activeProjectModal.plannedEndDate}
                </span>
              </div>
            </div>

            {/* Progress Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{t('progress')} (%)</span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">{activeProjectModal.progressPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={activeProjectModal.progressPercentage}
                onChange={(e) => updateProjectProgress(activeProjectModal.id, Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Key Milestones Checklist */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>{t('milestones')} ({activeProjectModal.milestones.length})</span>
              </h4>
              <div className="space-y-2">
                {activeProjectModal.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(activeProjectModal.id, m.id)}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {m.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <p className={`text-xs font-medium ${m.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {language === 'am' ? m.titleAm : m.titleEn}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500">
                          {language === 'am' ? 'የሚጠናቀቅበት ቀን:' : 'Due:'} {m.dueDate}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      m.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.completed ? (language === 'am' ? 'ተጠናቋል' : 'Done') : (language === 'am' ? 'በሂደት ላይ' : 'Pending')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Assigned */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">{t('projectManager')}</span>
                <span className="font-semibold text-white">{activeProjectModal.projectManager}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-500 block">{t('siteEngineer')}</span>
                <span className="font-semibold text-white">{activeProjectModal.siteEngineer}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-amber-400"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" />
                <span>{t('addNewProject')}</span>
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">{t('projectCode')} *</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.code}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">{t('client')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ethiopian Roads Authority"
                    value={newProjectForm.client}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {language === 'am' ? 'የፕሮጀክት ስም (አማርኛ) *' : 'Project Name (Amharic) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ የፒያሳ ቅርስ እድሳትና ህንጻ ግንባታ"
                  value={newProjectForm.nameAm}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, nameAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {language === 'am' ? 'የፕሮጀክት ስም (እንግሊዝኛ)' : 'Project Name (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Piassa Heritage Restoration & Commercial Tower"
                  value={newProjectForm.nameEn}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, nameEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">{t('location')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Addis Ababa, Arada"
                    value={newProjectForm.location}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">{t('contractValue')} (ETB) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150000000"
                    value={newProjectForm.contractValue}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, contractValue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">{t('startDate')}</label>
                  <input
                    type="date"
                    value={newProjectForm.startDate}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">{t('endDate')}</label>
                  <input
                    type="date"
                    value={newProjectForm.plannedEndDate}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, plannedEndDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">{t('projectManager')}</label>
                  <input
                    type="text"
                    placeholder="ኢ/ር አለማየሁ በቀለ"
                    value={newProjectForm.projectManager}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectManager: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">{t('siteEngineer')}</label>
                  <input
                    type="text"
                    placeholder="ኢ/ር ትዕግስት ሃይሉ"
                    value={newProjectForm.siteEngineer}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, siteEngineer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">{t('notes')}</label>
                <textarea
                  rows={2}
                  placeholder="የስራው ዝርዝር መግለጫ..."
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
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
