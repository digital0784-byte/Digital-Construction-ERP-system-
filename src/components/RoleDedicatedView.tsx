import React, { useState } from 'react';
import { 
  Crown, 
  Building, 
  Store, 
  UserCheck, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Send, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Package,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { 
  UserRole, 
  Project, 
  Material, 
  Worker, 
  InterimPaymentCertificate, 
  LeaveRequest, 
  StoreRequisition, 
  ExecutiveMemo 
} from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RoleDedicatedViewProps {
  currentUserRole: UserRole;
  projects: Project[];
  materials: Material[];
  workers: Worker[];
  ipcs: InterimPaymentCertificate[];
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  storeRequisitions: StoreRequisition[];
  setStoreRequisitions: React.Dispatch<React.SetStateAction<StoreRequisition[]>>;
  executiveMemos: ExecutiveMemo[];
  setExecutiveMemos: React.Dispatch<React.SetStateAction<ExecutiveMemo[]>>;
}

export const RoleDedicatedView: React.FC<RoleDedicatedViewProps> = ({
  currentUserRole,
  projects,
  materials,
  workers,
  ipcs,
  leaveRequests,
  setLeaveRequests,
  storeRequisitions,
  setStoreRequisitions,
  executiveMemos,
  setExecutiveMemos
}) => {
  const { t, language } = useLanguage();

  // Requisition Modal for Store App
  const [isNewReqOpen, setIsNewReqOpen] = useState(false);
  const [newReqForm, setNewReqForm] = useState({
    requestedBy: 'ኢ/ር ትዕግስት ሃይሉ',
    projectId: projects[0]?.id || '',
    materialId: materials[0]?.id || '',
    quantity: '100',
    priority: 'routine' as StoreRequisition['priority'],
    requiredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Leave Request Modal for Employee App
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'annual' as LeaveRequest['leaveType'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reasonAm: 'የቤተሰብ ጉዳይ ማስፈጸሚያ ፍቃድ'
  });

  // New Executive Directive for CEO App
  const [isNewMemoOpen, setIsNewMemoOpen] = useState(false);
  const [newMemoTitle, setNewMemoTitle] = useState('');
  const [newMemoContent, setNewMemoContent] = useState('');

  const totalContract = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.budgetSpent, 0);
  const totalBilled = ipcs.reduce((acc, i) => acc + i.netPayable, 0);

  const formatETB = (val: number) => {
    return (val / 1000000).toFixed(1) + (language === 'am' ? ' ሚሊዮን ብር' : 'M ETB');
  };

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const mat = materials.find(m => m.id === newReqForm.materialId);
    if (!mat) return;

    const newReq: StoreRequisition = {
      id: `req-${Date.now()}`,
      reqNumber: `REQ-${Date.now().toString().slice(-4)}`,
      requestedBy: newReqForm.requestedBy,
      projectId: newReqForm.projectId,
      materialId: mat.id,
      materialNameAm: mat.nameAm,
      quantityRequested: Number(newReqForm.quantity) || 10,
      unit: mat.unit,
      priority: newReqForm.priority,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      requiredDate: newReqForm.requiredDate
    };

    setStoreRequisitions([newReq, ...storeRequisitions]);
    setIsNewReqOpen(false);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLve: LeaveRequest = {
      id: `lve-${Date.now()}`,
      workerId: 'w-7',
      workerName: 'ጫላ ደምሴ',
      role: 'Daily Laborer (ረዳት ሰራተኛ)',
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reasonAm: leaveForm.reasonAm,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([newLve, ...leaveRequests]);
    setIsApplyLeaveOpen(false);
  };

  const handlePostMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoTitle) return;

    const newMemo: ExecutiveMemo = {
      id: `memo-${Date.now()}`,
      titleAm: newMemoTitle,
      titleEn: newMemoTitle,
      from: 'ወ/ሮ ሮዛ ግርማ (ዋና ስራ አስፈፃሚ / CEO)',
      category: 'urgent_directive',
      date: new Date().toISOString().split('T')[0],
      contentAm: newMemoContent,
      status: 'published'
    };

    setExecutiveMemos([newMemo, ...executiveMemos]);
    setIsNewMemoOpen(false);
    setNewMemoTitle('');
    setNewMemoContent('');
  };

  // ==========================================
  // APP 1: CEO EXECUTIVE COCKPIT APP
  // ==========================================
  if (currentUserRole === 'ceo') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/images/ceo_portrait_1793796445567.jpg"
              alt="CEO Portrait"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Executive Cockpit
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {language === 'am' ? 'የዋና ስራ አስፈፃሚ (CEO) ስትራቴጂክ ማዕከል' : 'Chief Executive Officer (CEO) Command Center'}
              </h2>
              <p className="text-xs text-slate-300">
                {language === 'am' ? 'ወ/ሮ ሮዛ ግርማ · የዘመን ኮንስትራክሽን ዋና ስራ አስፈፃሚ' : 'Ms. Roza Girma · Zemen Construction CEO'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewMemoOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'am' ? 'የስራ አስፈፃሚ መመሪያ አውጣ' : 'Issue CEO Directive'}</span>
          </button>
        </div>

        {/* CEO Key Financial & Portfolio Health Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] text-slate-400 font-medium">Enterprise Contract Portfolio</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{formatETB(totalContract)}</div>
            <span className="text-[10px] text-emerald-400 mt-1 block">4 Megaprojects in progress</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] text-slate-400 font-medium">Certified Billed Revenue</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{formatETB(totalBilled)}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">4 Interim Certificates</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] text-slate-400 font-medium">Actual Cost Incurred</span>
            <div className="text-2xl font-bold font-mono text-slate-300 mt-1">{formatETB(totalSpent)}</div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Healthy 59% Burn Rate</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] text-slate-400 font-medium">Active Enterprise Workforce</span>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">{workers.length * 13}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Staff & Site Laborers</span>
          </div>
        </div>

        {/* Directives Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{language === 'am' ? 'የስራ አመራር መመሪያዎችና ይፋዊ ማስታወቂያዎች' : 'Executive Directives & Corporate Memos'}</span>
          </h3>

          <div className="space-y-3">
            {executiveMemos.map((memo) => (
              <div key={memo.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">{memo.titleAm}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{memo.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{memo.contentAm}</p>
                <div className="text-[11px] text-slate-500 font-mono pt-1">ከ: {memo.from}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CEO Directive Modal */}
        {isNewMemoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">አዲስ ይፋዊ የ CEO መመሪያ አውጣ</h3>
                <button onClick={() => setIsNewMemoOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handlePostMemo} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">የመመሪያው ርዕስ *</label>
                  <input
                    type="text"
                    required
                    value={newMemoTitle}
                    onChange={(e) => setNewMemoTitle(e.target.value)}
                    placeholder="ምሳሌ፡ የ 4ቱ ሳይቶች የጥራትና ወጪ ቁጥጥር አዲስ መመሪያ"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">የመመሪያው ዝርዝር ይዘት *</label>
                  <textarea
                    rows={4}
                    required
                    value={newMemoContent}
                    onChange={(e) => setNewMemoContent(e.target.value)}
                    placeholder="ዝርዝር መመሪያዎችን እዚህ ይጻፉ..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => setIsNewMemoOpen(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded">ሰርዝ</button>
                  <button type="submit" className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded">ይፋ አድርግ</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // APP 2: HEAD OFFICE (HQ) APP
  // ==========================================
  if (currentUserRole === 'head_office') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-indigo-400" />
            <div>
              <h2 className="text-xl font-bold text-white">
                {language === 'am' ? 'የዋና መ/ቤት ኦፕሬሽንና ፈቃድ ማዕከል (Head Office HQ)' : 'Corporate Headquarters (HQ Hub)'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'am' ? 'የሳይት በጀቶች፣ የክፍያ ሰርተፍኬት ማረጋገጫዎች፣ ማሽነሪ ዝውውርና የውል ስምምነቶች' : 'Project budgets, IPC authorizations, equipment reallocations, and corporate contracts.'}
              </p>
            </div>
          </div>
        </div>

        {/* HQ Approvals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{language === 'am' ? 'የክፍያ ሰርተፍኬቶች ማረጋገጫ (IPC Claims)' : 'Pending IPC Approvals'}</span>
              <span className="font-mono text-xs text-amber-400">{ipcs.length} ሰርተፍኬቶች</span>
            </h3>
            <div className="space-y-2 text-xs">
              {ipcs.map((ipc) => (
                <div key={ipc.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-amber-400">{ipc.ipcNumber}</span>
                    <span className="text-slate-400 block text-[11px]">{ipc.periodStart} እስከ {ipc.periodEnd}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 block">{formatETB(ipc.netPayable)}</span>
                    <span className="text-[10px] text-slate-500 capitalize">{ipc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>{language === 'am' ? 'የሳይቶች እቃ መጠየቂያዎች (Store Requisitions)' : 'Site Store Requisitions'}</span>
              <span className="font-mono text-xs text-orange-400">{storeRequisitions.length} ጥያቄዎች</span>
            </h3>
            <div className="space-y-2 text-xs">
              {storeRequisitions.map((req) => (
                <div key={req.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{req.materialNameAm}</span>
                    <span className="text-slate-400 block text-[11px]">ጠያቂ: {req.requestedBy}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-300 block">{req.quantityRequested} {req.unit}</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">{req.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // APP 3: STORE OWNER / WAREHOUSE APP
  // ==========================================
  if (currentUserRole === 'store_owner') {
    const lowStockItems = materials.filter(m => m.currentStock <= m.minAlertStock);
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/images/store_manager_portrait_1793796446671.jpg"
              alt="Store Manager"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover border border-amber-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
                  Store Management System
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {language === 'am' ? 'የመጋዘን ባለቤትና እቃዎች አስተዳደር አፕ' : 'Store Owner & Warehouse Management App'}
              </h2>
              <p className="text-xs text-slate-400">ተሾመ ካሳ · ዋና የመጋዘንና ስቶክ ኃላፊ</p>
            </div>
          </div>

          <button
            onClick={() => setIsNewReqOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'am' ? 'አዲስ የእቃ ጥያቄ መዝግብ' : 'Create Material Requisition'}</span>
          </button>
        </div>

        {/* Store Requisitions Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>{language === 'am' ? 'የቅርብ የእቃ ጥያቄዎች (Store Requisition Slips)' : 'Store Requisitions Queue'}</span>
            <span className="text-xs font-mono text-slate-400">{storeRequisitions.length} ጠቅላላ ጥያቄዎች</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">የጥያቄ ቁጥር</th>
                  <th className="py-2.5 px-3">የእቃ ስም</th>
                  <th className="py-2.5 px-3">ጠያቂ መሃንዲስ</th>
                  <th className="py-2.5 px-3 text-right">የተጠየቀ መጠን</th>
                  <th className="py-2.5 px-3 text-center">ሁኔታ</th>
                  <th className="py-2.5 px-3 text-right">እርምጃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {storeRequisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-amber-400">{req.reqNumber}</td>
                    <td className="py-2.5 px-3 font-sans text-white font-semibold">{req.materialNameAm}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{req.requestedBy}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-orange-400">{req.quantityRequested} {req.unit}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        req.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' :
                        req.status === 'issued' ? 'bg-blue-500/15 text-blue-400' :
                        'bg-amber-500/15 text-amber-300'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      {req.status === 'pending' && (
                        <button
                          onClick={() => setStoreRequisitions(storeRequisitions.map(r => r.id === req.id ? { ...r, status: 'approved' } : r))}
                          className="px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded text-[11px] font-medium"
                        >
                          አጽድቅ
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Requisition Modal */}
        {isNewReqOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">አዲስ የእቃ ጥያቄ ቅፅ (Store Requisition)</h3>
                <button onClick={() => setIsNewReqOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRequisition} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">የሚጠየቀው እቃ *</label>
                  <select
                    value={newReqForm.materialId}
                    onChange={(e) => setNewReqForm({ ...newReqForm, materialId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.nameAm} (ቀሪ: {m.currentStock} {m.unit})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">ብዛት (Quantity) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newReqForm.quantity}
                      onChange={(e) => setNewReqForm({ ...newReqForm, quantity: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">አስቸኳይነት</label>
                    <select
                      value={newReqForm.priority}
                      onChange={(e) => setNewReqForm({ ...newReqForm, priority: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                    >
                      <option value="routine">መደበኛ (Routine)</option>
                      <option value="urgent">አስቸኳይ (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ጠያቂ ኃላፊ</label>
                  <input
                    type="text"
                    value={newReqForm.requestedBy}
                    onChange={(e) => setNewReqForm({ ...newReqForm, requestedBy: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => setIsNewReqOpen(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded">ሰርዝ</button>
                  <button type="submit" className="px-4 py-1.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded">ጥያቄ አስገባ</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // APP 4: HUMAN RESOURCES (HR) APP
  // ==========================================
  if (currentUserRole === 'hr_manager') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/images/hr_manager_portrait_1793796446759.jpg"
              alt="HR Director"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover border border-purple-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                  HR & Talent Operations
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {language === 'am' ? 'የሰው ኃይል አስተዳደር አፕሊኬሽን (HR App)' : 'Human Resources & Talent Management App'}
              </h2>
              <p className="text-xs text-slate-400">ሳባ ተስፋዬ · የሰው ኃይል ዳይሬክተር</p>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">የተመዘገቡ ሰራተኞች</span>
            <span className="text-2xl font-bold text-white">{workers.length} ሰራተኞች</span>
          </div>
        </div>

        {/* Leave Requests Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>{language === 'am' ? 'የሰራተኞች የእረፍት ፈቃድ ጥያቄዎች (Leave Requests)' : 'Staff Leave & Absence Applications'}</span>
            <span className="text-xs font-mono text-slate-400">{leaveRequests.length} ጥያቄዎች</span>
          </h3>

          <div className="space-y-3">
            {leaveRequests.map((lve) => (
              <div key={lve.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{lve.workerName}</span>
                    <span className="text-slate-400">({lve.role})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                      {lve.leaveType}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">{lve.reasonAm}</p>
                  <span className="text-[11px] font-mono text-slate-500 block mt-1">
                    ከ {lve.startDate} እስከ {lve.endDate} (የቀረበበት: {lve.appliedDate})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {lve.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => setLeaveRequests(leaveRequests.map(l => l.id === lve.id ? { ...l, status: 'approved' } : l))}
                        className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded text-xs hover:bg-emerald-400 cursor-pointer"
                      >
                        ፍቀድ
                      </button>
                      <button
                        onClick={() => setLeaveRequests(leaveRequests.map(l => l.id === lve.id ? { ...l, status: 'rejected' } : l))}
                        className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium rounded text-xs hover:bg-rose-500/30 cursor-pointer"
                      >
                        አትፍቀድ
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs font-bold uppercase ${lve.status === 'approved' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {lve.status === 'approved' ? '✓ ተፈቅዷል' : '✗ ተከልክሏል'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // APP 5: EMPLOYEE SELF-SERVICE APP
  // ==========================================
  if (currentUserRole === 'employee') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xl">
              ጫደ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Employee Self-Service Portal
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {language === 'am' ? 'የሰራተኛ ፖርታል (My Workplace Portal)' : 'Employee Self-Service Portal'}
              </h2>
              <p className="text-xs text-slate-400">ጫላ ደምሴ · መለያ: EMP-108 · ረዳት ሰራተኛ (Daily Laborer)</p>
            </div>
          </div>

          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'am' ? 'የእረፍት ፍቃድ ጠይቅ' : 'Apply for Leave'}</span>
          </button>
        </div>

        {/* Employee Personal Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 block text-[11px]">የቀን ክፍያ ሂሳብ</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">450 ETB / ቀን</div>
            <span className="text-[10px] text-slate-500">በየሳምንቱ አርብ የሚከፈል</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 block text-[11px]">የዛሬ መገኘት ሁኔታ</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">ተገኝቷል (Present)</div>
            <span className="text-[10px] text-slate-500">8 ሰዓት ተመዝግቧል</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 block text-[11px]">የተመደበበት ሳይት</span>
            <div className="text-sm font-bold text-white mt-1">ቦሌ አትላንቲክ ህንጻ</div>
            <span className="text-[10px] text-slate-500">ሱፐርቫይዘር: ታደሰ ወርቁ</span>
          </div>
        </div>

        {/* My Leave Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">
            {language === 'am' ? 'የቅርብ የእረፍት ማመልከቻዎቼ' : 'My Leave Requests'}
          </h3>
          <div className="space-y-2">
            {leaveRequests.map((lve) => (
              <div key={lve.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{lve.reasonAm}</span>
                  <span className="text-slate-400 block text-[11px] font-mono">ከ {lve.startDate} እስከ {lve.endDate}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  lve.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' :
                  lve.status === 'rejected' ? 'bg-rose-500/15 text-rose-400' :
                  'bg-amber-500/15 text-amber-300'
                }`}>
                  {lve.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Leave Modal */}
        {isApplyLeaveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">የእረፍት ፍቃድ ማመልከቻ</h3>
                <button onClick={() => setIsApplyLeaveOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">የፍቃድ አይነት</label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="annual">አመታዊ እረፍት (Annual Leave)</option>
                    <option value="sick">የህመም ፍቃድ (Sick Leave)</option>
                    <option value="emergency">አስቸኳይ ጉዳይ (Emergency)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">የመጀመሪያ ቀን</label>
                    <input
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">የመጨረሻ ቀን</label>
                    <input
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ምክንያት</label>
                  <textarea
                    rows={2}
                    required
                    value={leaveForm.reasonAm}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reasonAm: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => setIsApplyLeaveOpen(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded">ሰርዝ</button>
                  <button type="submit" className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded">አመልክት</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
