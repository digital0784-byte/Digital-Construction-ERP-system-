import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  User, 
  Calendar,
  Send,
  Building,
  Flag
} from 'lucide-react';
import { SiteTaskOrder, Project, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TaskOrdersModuleProps {
  tasks: SiteTaskOrder[];
  setTasks: React.Dispatch<React.SetStateAction<SiteTaskOrder[]>>;
  projects: Project[];
  currentUserRole: UserRole;
}

export const TaskOrdersModule: React.FC<TaskOrdersModuleProps> = ({
  tasks,
  setTasks,
  projects,
  currentUserRole
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New Task Order Form
  const [newTaskForm, setNewTaskForm] = useState({
    orderNumber: `WO-${new Date().getFullYear()}-${String(tasks.length + 1).padStart(3, '0')}`,
    projectId: projects[0]?.id || '',
    assignedTo: 'የግንበኞች ፎርማን ታደሰ ወርቁ',
    assignedRole: 'foreman' as SiteTaskOrder['assignedRole'],
    titleAm: '',
    titleEn: '',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high' as SiteTaskOrder['priority']
  });

  const getCreatorName = () => {
    if (currentUserRole === 'site_engineer') return 'ኢ/ር ትዕግስት ሃይሉ';
    if (currentUserRole === 'site_supervisor') return 'ሱፐርቫይዘር ታደሰ ወርቁ';
    return 'ኢ/ር አለማየሁ በቀለ';
  };

  const filteredTasks = tasks.filter((tsk) => {
    const matchesSearch = 
      tsk.titleAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tsk.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tsk.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tsk.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || tsk.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || tsk.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.titleAm && !newTaskForm.titleEn) return;

    const newTask: SiteTaskOrder = {
      id: `tsk-${Date.now()}`,
      orderNumber: newTaskForm.orderNumber,
      projectId: newTaskForm.projectId,
      assignedTo: newTaskForm.assignedTo,
      assignedRole: newTaskForm.assignedRole,
      titleAm: newTaskForm.titleAm || newTaskForm.titleEn,
      titleEn: newTaskForm.titleEn || newTaskForm.titleAm,
      deadline: newTaskForm.deadline,
      priority: newTaskForm.priority,
      status: 'pending',
      createdByRole: currentUserRole,
      createdByName: getCreatorName()
    };

    setTasks([newTask, ...tasks]);
    setIsNewTaskOpen(false);
    setNewTaskForm({
      orderNumber: `WO-${new Date().getFullYear()}-${String(tasks.length + 2).padStart(3, '0')}`,
      projectId: projects[0]?.id || '',
      assignedTo: 'የግንበኞች ፎርማን ታደሰ ወርቁ',
      assignedRole: 'foreman',
      titleAm: '',
      titleEn: '',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high'
    });
  };

  const updateTaskStatus = (id: string, newStatus: SiteTaskOrder['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-400" />
              <span>{language === 'am' ? 'የሳይት የስራ ትዕዛዞችና መመሪያዎች (Work Orders)' : 'Field Work Orders & Directives'}</span>
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {currentUserRole === 'site_engineer' ? 'Site Engineer View' :
               currentUserRole === 'site_supervisor' ? 'Site Supervisor View' : 'Project Manager View'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'am'
              ? 'ለፎርማኖች፣ ለብረት አሳሪዎችና ለንዑስ ተቋራጮች የሚሰጡ የቀንና የሳምንት አስቸኳይ ትዕዛዞች'
              : 'Direct site work orders issued to foremen, trade gangs, and subcontractors with deadlines.'}
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'am' ? 'አዲስ የስራ ትዕዛዝ ስጥ' : 'Issue Work Order'}</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 block text-[11px]">{language === 'am' ? 'ጠቅላላ ትዕዛዞች' : 'Total Orders'}</span>
          <span className="text-xl font-bold font-mono text-white mt-1 tabular-nums">{tasks.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 block text-[11px]">{language === 'am' ? 'አስቸኳይ (Urgent)' : 'Urgent Priority'}</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {tasks.filter(t => t.priority === 'urgent').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 block text-[11px]">{language === 'am' ? 'በስራ ላይ ያሉ' : 'In Progress'}</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {tasks.filter(t => t.status === 'in_progress').length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 block text-[11px]">{language === 'am' ? 'የተጠናቀቁ (Completed)' : 'Completed'}</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {tasks.filter(t => t.status === 'completed').length}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'am' ? 'በትዕዛዝ ቁጥር፣ ርዕስ ወይም ተረካቢ ስም ፈልግ...' : 'Search task, order number, assigned to...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'urgent', 'high', 'medium'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                  priorityFilter === p ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'all' ? (language === 'am' ? 'ሁሉም ቅድሚያ' : 'All Priority') :
                 p === 'urgent' ? (language === 'am' ? 'አስቸኳይ' : 'Urgent') :
                 p === 'high' ? (language === 'am' ? 'ከፍተኛ' : 'High') :
                 (language === 'am' ? 'መካከለኛ' : 'Medium')}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'pending', 'in_progress', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? (language === 'am' ? 'ሁሉም ሁኔታ' : 'All') :
                 st === 'pending' ? (language === 'am' ? 'በመጠባበቅ' : 'Pending') :
                 st === 'in_progress' ? (language === 'am' ? 'በስራ ላይ' : 'Active') :
                 (language === 'am' ? 'ተጠናቋል' : 'Done')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const proj = getProject(task.projectId);
          return (
            <div
              key={task.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {task.orderNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      task.priority === 'urgent' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                      task.priority === 'high' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                      'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-md border focus:outline-none cursor-pointer ${
                      task.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                      task.status === 'in_progress' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <option value="pending" className="bg-slate-900 text-white">⏳ {language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending'}</option>
                    <option value="in_progress" className="bg-slate-900 text-white">🔄 {language === 'am' ? 'በስራ ላይ (In Progress)' : 'In Progress'}</option>
                    <option value="completed" className="bg-slate-900 text-white">✓ {language === 'am' ? 'ተጠናቋል (Completed)' : 'Completed'}</option>
                  </select>
                </div>

                <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                  {language === 'am' ? task.titleAm : task.titleEn}
                </h3>

                <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">{language === 'am' ? 'የተመደበለት ተረካቢ:' : 'Assigned To:'}</span>
                    <span className="font-semibold text-white">{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 font-mono">
                    <span className="text-slate-500">{language === 'am' ? 'የማጠናቀቂያ ገደብ:' : 'Deadline:'}</span>
                    <span className="text-amber-400 font-bold">{task.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">{language === 'am' ? 'ሳይት:' : 'Site:'}</span>
                    <span className="truncate max-w-[180px]">{proj ? (language === 'am' ? proj.nameAm : proj.nameEn) : 'Project'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{language === 'am' ? 'ትዕዛዝ የሰጠው:' : 'Issued By:'} {task.createdByName}</span>
                <span className="font-mono text-slate-500 capitalize">{task.createdByRole.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Task Order Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-400" />
                <span>{language === 'am' ? 'አዲስ የመስክ ስራ ትዕዛዝ ስጥ' : 'Issue Field Work Order'}</span>
              </h3>
              <button
                onClick={() => setIsNewTaskOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">የትዕዛዝ ቁጥር *</label>
                  <input
                    type="text"
                    required
                    value={newTaskForm.orderNumber}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, orderNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">የሳይት ፕሮጀክት</label>
                  <select
                    value={newTaskForm.projectId}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, projectId: e.target.value })}
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
                <label className="block text-slate-400 mb-1">የትዕዛዙ ዝርዝር ርዕስ (አማርኛ) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="ምሳሌ፡ የ 11ኛ ፎቅ የደህንነት መከላከያ አጥር በአስቸኳይ መጠገንና ማጠናቀቅ"
                  value={newTaskForm.titleAm}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, titleAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ተረካቢ / የተመደበለት ቡድን *</label>
                  <input
                    type="text"
                    required
                    placeholder="ፎርማን ታደሰ / የብረት አሳሪዎች መሪ"
                    value={newTaskForm.assignedTo}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedTo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">የቅድሚያ ደረጃ (Priority)</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="urgent">🚨 አስቸኳይ (Urgent / 24 hrs)</option>
                    <option value="high">⚠️ ከፍተኛ (High Priority)</option>
                    <option value="medium">መደበኛ (Medium Priority)</option>
                    <option value="low">ዝቅተኛ (Low Priority)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">የማጠናቀቂያ ቀን (Deadline) *</label>
                <input
                  type="date"
                  required
                  value={newTaskForm.deadline}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                >
                  {language === 'am' ? 'ትዕዛዝ አስተላልፍ' : 'Issue Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
