import React, { useState } from 'react';
import { 
  CircleDollarSign, 
  FileSpreadsheet, 
  FileCheck, 
  Plus, 
  Search, 
  X, 
  Percent, 
  CheckCircle, 
  Building,
  ArrowRight
} from 'lucide-react';
import { BOQItem, InterimPaymentCertificate, Project } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FinanceModuleProps {
  boqItems: BOQItem[];
  setBoqItems: React.Dispatch<React.SetStateAction<BOQItem[]>>;
  ipcs: InterimPaymentCertificate[];
  setIpcs: React.Dispatch<React.SetStateAction<InterimPaymentCertificate[]>>;
  projects: Project[];
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  boqItems,
  setBoqItems,
  ipcs,
  setIpcs,
  projects
}) => {
  const { t, language } = useLanguage();
  const [activeFinanceTab, setActiveFinanceTab] = useState<'boq' | 'ipc'>('boq');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddBoqOpen, setIsAddBoqOpen] = useState(false);
  const [isAddIpcOpen, setIsAddIpcOpen] = useState(false);
  const [updateQtyModal, setUpdateQtyModal] = useState<BOQItem | null>(null);
  const [executedQtyInput, setExecutedQtyInput] = useState('');

  // New BOQ form
  const [newBoqForm, setNewBoqForm] = useState({
    itemNo: '3.05',
    descriptionAm: '',
    descriptionEn: '',
    unit: 'm²',
    contractQty: '',
    contractRate: '',
    projectId: projects[0]?.id || ''
  });

  // New IPC form
  const [newIpcForm, setNewIpcForm] = useState({
    ipcNumber: `IPC-${String(ipcs.length + 1).padStart(2, '0')}`,
    projectId: projects[0]?.id || '',
    periodStart: '2026-10-01',
    periodEnd: '2026-10-31',
    grossAmount: '45000000',
    retentionRate: 5, // 5%
    advanceRecovery: '9000000', // 20%
    vatRate: 15 // 15%
  });

  const filteredBoq = boqItems.filter(b => 
    b.itemNo.includes(searchQuery) ||
    b.descriptionAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBoq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoqForm.descriptionAm && !newBoqForm.descriptionEn) return;

    const newItem: BOQItem = {
      id: `boq-${Date.now()}`,
      itemNo: newBoqForm.itemNo,
      descriptionAm: newBoqForm.descriptionAm || newBoqForm.descriptionEn,
      descriptionEn: newBoqForm.descriptionEn || newBoqForm.descriptionAm,
      unit: newBoqForm.unit,
      contractQty: Number(newBoqForm.contractQty) || 100,
      contractRate: Number(newBoqForm.contractRate) || 1000,
      executedQty: 0,
      projectId: newBoqForm.projectId
    };

    setBoqItems([...boqItems, newItem]);
    setIsAddBoqOpen(false);
  };

  const handleUpdateQty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateQtyModal) return;

    const qty = Number(executedQtyInput);
    setBoqItems(boqItems.map(item => item.id === updateQtyModal.id ? { ...item, executedQty: qty } : item));
    setUpdateQtyModal(null);
  };

  const handleCreateIpc = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = Number(newIpcForm.grossAmount) || 0;
    const retention = Math.round(gross * (newIpcForm.retentionRate / 100));
    const advance = Number(newIpcForm.advanceRecovery) || 0;
    const taxableSubtotal = gross - retention - advance;
    const vat = Math.round(taxableSubtotal * (newIpcForm.vatRate / 100));
    const net = taxableSubtotal + vat;

    const newIpc: InterimPaymentCertificate = {
      id: `ipc-${Date.now()}`,
      ipcNumber: newIpcForm.ipcNumber,
      projectId: newIpcForm.projectId,
      periodStart: newIpcForm.periodStart,
      periodEnd: newIpcForm.periodEnd,
      grossAmount: gross,
      retentionDeduction: retention,
      advanceDeduction: advance,
      vatAmount: vat,
      netPayable: net,
      status: 'submitted',
      submissionDate: new Date().toISOString().split('T')[0]
    };

    setIpcs([...ipcs, newIpc]);
    setIsAddIpcOpen(false);
  };

  const updateIpcStatus = (id: string, newStatus: InterimPaymentCertificate['status']) => {
    setIpcs(ipcs.map(ipc => ipc.id === id ? { 
      ...ipc, 
      status: newStatus,
      certificationDate: newStatus === 'certified' ? new Date().toISOString().split('T')[0] : ipc.certificationDate
    } : ipc));
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  const totalContractBoqValue = boqItems.reduce((acc, b) => acc + (b.contractQty * b.contractRate), 0);
  const totalExecutedBoqValue = boqItems.reduce((acc, b) => acc + (b.executedQty * b.contractRate), 0);

  return (
    <div className="space-y-6">
      {/* Switch between BOQ & IPC */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveFinanceTab('boq')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeFinanceTab === 'boq'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t('boq')}</span>
          </button>
          <button
            onClick={() => setActiveFinanceTab('ipc')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeFinanceTab === 'ipc'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{t('ipc')} ({ipcs.length})</span>
          </button>
        </div>

        <div>
          {activeFinanceTab === 'boq' ? (
            <button
              onClick={() => setIsAddBoqOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addBoqItem')}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddIpcOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('generateIpc')}</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: BILL OF QUANTITIES (BOQ) */}
      {activeFinanceTab === 'boq' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">{language === 'am' ? 'የውል ጠቅላላ BOQ ዋጋ' : 'Total BOQ Contract Value'}</span>
              <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                {formatNumber(totalContractBoqValue)} ETB
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">{language === 'am' ? 'እስካሁን የተሰራ ዋጋ (Executed)' : 'Total Work Executed Value'}</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                {formatNumber(totalExecutedBoqValue)} ETB
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {language === 'am' ? 'የቦሌ አትላንቲክ ህንጻ የዋጋ ዝርዝር (BOQ Schedule)' : 'Project BOQ Schedule'}
              </h3>
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="በቁጥር ወይም መግለጫ ፈልግ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-2 py-1 text-xs text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3 px-4">አይተም</th>
                    <th className="py-3 px-4">የስራው ዝርዝር መግለጫ</th>
                    <th className="py-3 px-4 text-center">መለኪያ</th>
                    <th className="py-3 px-4 text-right">የውል ብዛት</th>
                    <th className="py-3 px-4 text-right">ነጠላ ዋጋ</th>
                    <th className="py-3 px-4 text-right">የተሰራ ብዛት</th>
                    <th className="py-3 px-4 text-right">የተሰራ ድምር</th>
                    <th className="py-3 px-4 text-center">አፈፃፀም</th>
                    <th className="py-3 px-4 text-right">እርምጃ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredBoq.map((b) => {
                    const percent = Math.min(100, Math.round((b.executedQty / b.contractQty) * 100));
                    const executedVal = b.executedQty * b.contractRate;
                    return (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-amber-400">
                          {b.itemNo}
                        </td>
                        <td className="py-3 px-4 font-sans text-white max-w-sm">
                          {language === 'am' ? b.descriptionAm : b.descriptionEn}
                        </td>
                        <td className="py-3 px-4 text-center text-slate-300">
                          {b.unit}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-200 tabular-nums">
                          {formatNumber(b.contractQty)}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-300 tabular-nums">
                          {formatNumber(b.contractRate)} ETB
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-400 tabular-nums">
                          {formatNumber(b.executedQty)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-white tabular-nums">
                          {formatNumber(executedVal)}
                        </td>
                        <td className="py-3 px-4 text-center font-sans">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            percent >= 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {percent}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-sans">
                          <button
                            onClick={() => {
                              setUpdateQtyModal(b);
                              setExecutedQtyInput(String(b.executedQty));
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                          >
                            {language === 'am' ? 'መጠን ቀይር' : 'Update Qty'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERIM PAYMENT CERTIFICATES (IPC) */}
      {activeFinanceTab === 'ipc' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ipcs.map((ipc) => (
              <div
                key={ipc.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {ipc.ipcNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {ipc.periodStart} - {ipc.periodEnd}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    ipc.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                    ipc.status === 'certified' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                    'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                  }`}>
                    {ipc.status === 'paid' ? (language === 'am' ? 'የተከፈለ' : 'Paid') :
                     ipc.status === 'certified' ? (language === 'am' ? 'የተረጋገጠ (Certified)' : 'Certified') :
                     (language === 'am' ? 'የቀረበ (Submitted)' : 'Submitted')}
                  </span>
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-1.5 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500 font-sans">{t('grossAmount')}:</span>
                    <span>{formatNumber(ipc.grossAmount)} ETB</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span className="text-slate-500 font-sans">- {t('retention')}:</span>
                    <span>-{formatNumber(ipc.retentionDeduction)} ETB</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span className="text-slate-500 font-sans">- {t('advanceRecovery')}:</span>
                    <span>-{formatNumber(ipc.advanceDeduction)} ETB</span>
                  </div>
                  <div className="flex justify-between text-blue-400">
                    <span className="text-slate-500 font-sans">+ {t('vat')}:</span>
                    <span>+{formatNumber(ipc.vatAmount)} ETB</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-emerald-400">
                    <span className="font-sans">{t('netPayable')}:</span>
                    <span>{formatNumber(ipc.netPayable)} ETB</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {language === 'am' ? 'የቀረበበት:' : 'Submitted:'} {ipc.submissionDate}
                  </span>
                  <div className="flex items-center gap-2">
                    {ipc.status === 'submitted' && (
                      <button
                        onClick={() => updateIpcStatus(ipc.id, 'certified')}
                        className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-medium cursor-pointer"
                      >
                        {language === 'am' ? 'አማካሪ አጽድቅ (Certify)' : 'Certify IPC'}
                      </button>
                    )}
                    {ipc.status === 'certified' && (
                      <button
                        onClick={() => updateIpcStatus(ipc.id, 'paid')}
                        className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-medium cursor-pointer"
                      >
                        {language === 'am' ? 'ክፍያ ተፈጽሟል (Paid)' : 'Mark Paid'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update BOQ Quantity Modal */}
      {updateQtyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {language === 'am' ? 'የተሰራ መጠን መዝግብ' : 'Record Executed Quantity'}
              </h3>
              <button
                onClick={() => setUpdateQtyModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {updateQtyModal.itemNo} - {language === 'am' ? updateQtyModal.descriptionAm : updateQtyModal.descriptionEn}
            </p>

            <form onSubmit={handleUpdateQty} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'am' ? 'አጠቃላይ የተሰራ ብዛት' : 'Total Executed Quantity'} ({updateQtyModal.unit})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={updateQtyModal.contractQty * 1.3} // allow reasonable variations
                  value={executedQtyInput}
                  onChange={(e) => setExecutedQtyInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-base"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {language === 'am' ? 'የውል መጠን:' : 'Contract Quantity:'} {updateQtyModal.contractQty} {updateQtyModal.unit}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setUpdateQtyModal(null)}
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

      {/* Add BOQ Item Modal */}
      {isAddBoqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                <span>{t('addBoqItem')}</span>
              </h3>
              <button
                onClick={() => setIsAddBoqOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBoq} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">አይተም ቁጥር (Item No) *</label>
                  <input
                    type="text"
                    required
                    placeholder="3.06"
                    value={newBoqForm.itemNo}
                    onChange={(e) => setNewBoqForm({ ...newBoqForm, itemNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('unit')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="m³ / m² / Ton / No"
                    value={newBoqForm.unit}
                    onChange={(e) => setNewBoqForm({ ...newBoqForm, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">የስራው ዝርዝር መግለጫ (አማርኛ) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="ምሳሌ፡ የ 15 ሳ.ሜ ፎርምዎርክ እና የኮንክሪት ማፍሰስ ስራ"
                  value={newBoqForm.descriptionAm}
                  onChange={(e) => setNewBoqForm({ ...newBoqForm, descriptionAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('contractQty')} *</label>
                  <input
                    type="number"
                    required
                    placeholder="1000"
                    value={newBoqForm.contractQty}
                    onChange={(e) => setNewBoqForm({ ...newBoqForm, contractQty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('contractRate')} (ETB) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={newBoqForm.contractRate}
                    onChange={(e) => setNewBoqForm({ ...newBoqForm, contractRate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddBoqOpen(false)}
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

      {/* Create New IPC Modal */}
      {isAddIpcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <span>{t('generateIpc')}</span>
              </h3>
              <button
                onClick={() => setIsAddIpcOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIpc} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('ipcNumber')} *</label>
                  <input
                    type="text"
                    required
                    value={newIpcForm.ipcNumber}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, ipcNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('projects')}</label>
                  <select
                    value={newIpcForm.projectId}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, projectId: e.target.value })}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">የክፍለ ጊዜ መጀመሪያ</label>
                  <input
                    type="date"
                    value={newIpcForm.periodStart}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, periodStart: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">የክፍለ ጊዜ ማብቂያ</label>
                  <input
                    type="date"
                    value={newIpcForm.periodEnd}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, periodEnd: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('grossAmount')} (ETB) *</label>
                <input
                  type="number"
                  required
                  placeholder="30000000"
                  value={newIpcForm.grossAmount}
                  onChange={(e) => setNewIpcForm({ ...newIpcForm, grossAmount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('advanceRecovery')} (ETB)</label>
                  <input
                    type="number"
                    value={newIpcForm.advanceRecovery}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, advanceRecovery: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">የዋስትና ቅነሳ ምጣኔ (Retention %)</label>
                  <input
                    type="number"
                    value={newIpcForm.retentionRate}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, retentionRate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddIpcOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                >
                  {language === 'am' ? 'ሰርተፍኬት አዘጋጅ' : 'Generate Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
