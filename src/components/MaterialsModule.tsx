import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  History, 
  X,
  Building,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Material, Project, StockTransaction } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MaterialsModuleProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  projects: Project[];
}

export const MaterialsModule: React.FC<MaterialsModuleProps> = ({
  materials,
  setMaterials,
  projects
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeMaterialHistory, setActiveMaterialHistory] = useState<Material | null>(null);

  // Stock Movement Modal (GRN - Stock In / SIV - Stock Out)
  const [movementModal, setMovementModal] = useState<{
    isOpen: boolean;
    type: 'in' | 'out';
    material: Material | null;
  }>({
    isOpen: false,
    type: 'out',
    material: null
  });

  const [movementForm, setMovementForm] = useState({
    quantity: '',
    voucherNo: `VCH-${Date.now().toString().slice(-4)}`,
    projectId: projects[0]?.id || '',
    officerName: 'ተሾመ ካሳ (የመጋዘን ኃላፊ)',
    notes: ''
  });

  // New Material Modal
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [newMaterialForm, setNewMaterialForm] = useState({
    itemCode: `MAT-${Date.now().toString().slice(-3)}`,
    nameAm: '',
    nameEn: '',
    category: 'cement' as Material['category'],
    unit: 'ኩንታል (Qtl)',
    currentStock: '',
    minAlertStock: '100',
    unitCost: '',
    warehouseLocation: 'ዋና መጋዘን - ቃሊቲ',
    supplier: ''
  });

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = 
      m.nameAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleStockMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementModal.material || !movementForm.quantity) return;

    const qty = Number(movementForm.quantity);
    if (qty <= 0) return;

    const isOut = movementModal.type === 'out';
    if (isOut && qty > movementModal.material.currentStock) {
      alert(language === 'am' ? 'በመጋዘን ውስጥ ካለው ክምችት በላይ ማውጣት አይቻልም!' : 'Cannot issue more than available stock!');
      return;
    }

    const newTx: StockTransaction = {
      id: `tx-${Date.now()}`,
      type: movementModal.type,
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      voucherNo: movementForm.voucherNo,
      projectId: isOut ? movementForm.projectId : undefined,
      receivedOrIssuedBy: movementForm.officerName,
      notes: movementForm.notes
    };

    setMaterials(materials.map(m => {
      if (m.id !== movementModal.material?.id) return m;
      const newStock = isOut ? m.currentStock - qty : m.currentStock + qty;
      return {
        ...m,
        currentStock: newStock,
        transactions: [newTx, ...m.transactions]
      };
    }));

    setMovementModal({ isOpen: false, type: 'out', material: null });
    setMovementForm({
      quantity: '',
      voucherNo: `VCH-${Date.now().toString().slice(-4)}`,
      projectId: projects[0]?.id || '',
      officerName: 'ተሾመ ካሳ (የመጋዘን ኃላፊ)',
      notes: ''
    });
  };

  const handleAddNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialForm.nameAm && !newMaterialForm.nameEn) return;

    const newItem: Material = {
      id: `mat-${Date.now()}`,
      itemCode: newMaterialForm.itemCode,
      nameAm: newMaterialForm.nameAm || newMaterialForm.nameEn,
      nameEn: newMaterialForm.nameEn || newMaterialForm.nameAm,
      category: newMaterialForm.category,
      unit: newMaterialForm.unit,
      currentStock: Number(newMaterialForm.currentStock) || 0,
      minAlertStock: Number(newMaterialForm.minAlertStock) || 50,
      unitCost: Number(newMaterialForm.unitCost) || 1000,
      warehouseLocation: newMaterialForm.warehouseLocation,
      supplier: newMaterialForm.supplier || 'የሀገር ውስጥ አቅራቢ',
      transactions: []
    };

    setMaterials([newItem, ...materials]);
    setIsAddMaterialModalOpen(false);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'am' ? 'በእቃ ስም፣ መለያ ኮድ ወይም አቅራቢ ፈልግ...' : 'Search material, code, supplier...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            {['all', 'cement', 'steel', 'aggregates', 'blocks', 'fuel'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') :
                 cat === 'cement' ? (language === 'am' ? 'ሲሚንቶ' : 'Cement') :
                 cat === 'steel' ? (language === 'am' ? 'ብረት' : 'Steel') :
                 cat === 'aggregates' ? (language === 'am' ? 'አሸዋ/ኮረት' : 'Aggregates') :
                 cat === 'blocks' ? (language === 'am' ? 'ብሎኬት' : 'Blocks') :
                 (language === 'am' ? 'ናፍጣ/ነዳጅ' : 'Fuel')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddMaterialModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'am' ? 'አዲስ እቃ መዝግብ' : 'Add Material Item'}</span>
        </button>
      </div>

      {/* Materials Inventory High-Density Grid/Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">{t('itemCode')}</th>
                <th className="py-3 px-4">{t('materialName')}</th>
                <th className="py-3 px-4">{t('warehouse')}</th>
                <th className="py-3 px-4 text-right">{t('unitCost')}</th>
                <th className="py-3 px-4 text-right">{t('currentStock')}</th>
                <th className="py-3 px-4 text-center">{t('status')}</th>
                <th className="py-3 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMaterials.map((mat) => {
                const isLowStock = mat.currentStock <= mat.minAlertStock;
                return (
                  <tr key={mat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-amber-400 whitespace-nowrap">
                      {mat.itemCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">
                        {language === 'am' ? mat.nameAm : mat.nameEn}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {mat.supplier}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {mat.warehouseLocation}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-300 tabular-nums">
                      {formatNumber(mat.unitCost)} ETB
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className={`font-mono font-bold text-sm tabular-nums ${isLowStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {formatNumber(mat.currentStock)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {mat.unit}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{language === 'am' ? 'አነስተኛ' : 'Low'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span>{language === 'am' ? 'በቂ' : 'In Stock'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Stock In (GRN) Button */}
                        <button
                          onClick={() => setMovementModal({ isOpen: true, type: 'in', material: mat })}
                          className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium transition-colors cursor-pointer"
                          title="እቃ አስገባ (GRN)"
                        >
                          + {language === 'am' ? 'አስገባ' : 'GRN'}
                        </button>
                        {/* Stock Out (SIV) Button */}
                        <button
                          onClick={() => setMovementModal({ isOpen: true, type: 'out', material: mat })}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] font-medium transition-colors cursor-pointer"
                          title="ወደ ሳይት እቃ አውጣ (SIV)"
                        >
                          - {language === 'am' ? 'አውጣ' : 'SIV'}
                        </button>
                        {/* History */}
                        <button
                          onClick={() => setActiveMaterialHistory(mat)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                          title="የእንቅስቃሴ ታሪክ"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock In / Out Modal (GRN / SIV) */}
      {movementModal.isOpen && movementModal.material && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {movementModal.type === 'in' ? (
                  <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-amber-400" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {movementModal.type === 'in'
                      ? (language === 'am' ? 'እቃ ወደ መጋዘን አስገባ (GRN)' : 'Goods Received Note (GRN)')
                      : (language === 'am' ? 'ወደ ሳይት እቃ አውጣ (SIV)' : 'Store Issue Voucher (SIV)')}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {language === 'am' ? movementModal.material.nameAm : movementModal.material.nameEn}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMovementModal({ isOpen: false, type: 'out', material: null })}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockMovement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">
                  {movementModal.type === 'in' ? 'GRN ቁጥር' : 'SIV ቁጥር'}
                </label>
                <input
                  type="text"
                  required
                  value={movementForm.voucherNo}
                  onChange={(e) => setMovementForm({ ...movementForm, voucherNo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {t('unit')} ({movementModal.material.unit}) - {language === 'am' ? 'መጠን' : 'Quantity'} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="0"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-sm"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {language === 'am' ? 'አሁን በመጋዘን ያለ:' : 'Currently Available:'}{' '}
                  <b className="text-amber-400 font-mono">{movementModal.material.currentStock} {movementModal.material.unit}</b>
                </span>
              </div>

              {movementModal.type === 'out' && (
                <div>
                  <label className="block text-slate-400 mb-1">
                    {language === 'am' ? 'የሚሄድበት ፕሮጀክት ሳይት *' : 'Target Construction Site *'}
                  </label>
                  <select
                    value={movementForm.projectId}
                    onChange={(e) => setMovementForm({ ...movementForm, projectId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {language === 'am' ? p.nameAm : p.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'am' ? 'ኃላፊ / ያረጋገጠው' : 'Authorized Officer'}
                </label>
                <input
                  type="text"
                  value={movementForm.officerName}
                  onChange={(e) => setMovementForm({ ...movementForm, officerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('notes')}</label>
                <textarea
                  rows={2}
                  placeholder="የስራው ዝርዝር..."
                  value={movementForm.notes}
                  onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setMovementModal({ isOpen: false, type: 'out', material: null })}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 rounded-lg text-slate-950 font-bold ${
                    movementModal.type === 'in' ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-amber-400 hover:bg-amber-300'
                  }`}
                >
                  {t('confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Material Transaction History Drawer/Modal */}
      {activeMaterialHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'am' ? activeMaterialHistory.nameAm : activeMaterialHistory.nameEn}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {activeMaterialHistory.itemCode} · {language === 'am' ? 'የክምችት ዝውውር ታሪክ' : 'Stock Movement Ledger'}
                </p>
              </div>
              <button
                onClick={() => setActiveMaterialHistory(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {activeMaterialHistory.transactions.length > 0 ? (
                activeMaterialHistory.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${tx.type === 'in' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {tx.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {tx.type === 'in' ? (language === 'am' ? 'ገቢ (GRN)' : 'Stock In') : (language === 'am' ? 'ወጪ ወደ ሳይት (SIV)' : 'Issued to Site')}
                          <span className="font-mono text-slate-400 ml-2">({tx.voucherNo})</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {tx.date} · {tx.receivedOrIssuedBy} {tx.notes ? `· ${tx.notes}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className={`font-mono font-bold text-sm tabular-nums ${tx.type === 'in' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {tx.type === 'in' ? '+' : '-'}{tx.quantity} {activeMaterialHistory.unit}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  {language === 'am' ? 'ምንም አይነት የቅርብ እንቅስቃሴ አልተመዘገበም' : 'No transactions recorded yet'}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveMaterialHistory(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-200 rounded-lg text-xs"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Material Modal */}
      {isAddMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <span>{language === 'am' ? 'አዲስ የግንባታ እቃ መዝግብ' : 'Add New Material'}</span>
              </h3>
              <button
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewMaterial} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('itemCode')} *</label>
                  <input
                    type="text"
                    required
                    value={newMaterialForm.itemCode}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, itemCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('category')}</label>
                  <select
                    value={newMaterialForm.category}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="cement">ሲሚንቶ (Cement)</option>
                    <option value="steel">ብረት (Steel)</option>
                    <option value="aggregates">አሸዋና ኮረት (Aggregates)</option>
                    <option value="blocks">ብሎኬት (Blocks)</option>
                    <option value="fuel">ነዳጅ (Fuel)</option>
                    <option value="finishing">አጨራረስ (Finishing)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'am' ? 'የእቃው ስም (አማርኛ) *' : 'Material Name (Amharic) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ ሀበሻ ፖርትላንድ ሲሚንቶ"
                  value={newMaterialForm.nameAm}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, nameAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('unit')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="ኩንታል / ቶን / m³ / ፍሬ"
                    value={newMaterialForm.unit}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('unitCost')} (ETB) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1850"
                    value={newMaterialForm.unitCost}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, unitCost: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('currentStock')}</label>
                  <input
                    type="number"
                    placeholder="500"
                    value={newMaterialForm.currentStock}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, currentStock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('minAlertStock')}</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newMaterialForm.minAlertStock}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, minAlertStock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('warehouse')}</label>
                  <input
                    type="text"
                    value={newMaterialForm.warehouseLocation}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, warehouseLocation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('supplier')}</label>
                  <input
                    type="text"
                    placeholder="አቅራቢ ድርጅት"
                    value={newMaterialForm.supplier}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, supplier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMaterialModalOpen(false)}
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
