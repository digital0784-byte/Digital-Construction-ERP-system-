import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FlaskConical, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  X,
  FileCheck2,
  Activity
} from 'lucide-react';
import { QualityTest, Project } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QualityHSEModuleProps {
  qcTests: QualityTest[];
  setQcTests: React.Dispatch<React.SetStateAction<QualityTest[]>>;
  projects: Project[];
}

export const QualityHSEModule: React.FC<QualityHSEModuleProps> = ({
  qcTests,
  setQcTests,
  projects
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);

  const [newTestForm, setNewTestForm] = useState({
    testCode: `QC-CUB-${Date.now().toString().slice(-4)}`,
    projectId: projects[0]?.id || '',
    structuralElementAm: '',
    structuralElementEn: '',
    testType: 'concrete_cube' as QualityTest['testType'],
    castDate: new Date().toISOString().split('T')[0],
    testDate: new Date().toISOString().split('T')[0],
    targetStrengthMpa: '25.0',
    achievedStrengthMpa: '27.5',
    status: 'passed' as QualityTest['status'],
    technician: 'ዳዊት ከበደ (ላቦራቶሪ ቴክኒሽያን)',
    remarks: 'የ 28-ቀን የኮንክሪት ጥንካሬ ፈተና በተሳካ ሁኔታ አልፏል'
  });

  const filteredTests = qcTests.filter(tst => {
    const matchesSearch = 
      tst.testCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tst.structuralElementAm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tst.technician.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || tst.testType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestForm.structuralElementAm) return;

    const target = Number(newTestForm.targetStrengthMpa);
    const achieved = Number(newTestForm.achievedStrengthMpa);
    const passed = achieved >= target;

    const newTest: QualityTest = {
      id: `qc-${Date.now()}`,
      testCode: newTestForm.testCode,
      projectId: newTestForm.projectId,
      structuralElementAm: newTestForm.structuralElementAm,
      structuralElementEn: newTestForm.structuralElementEn || newTestForm.structuralElementAm,
      castDate: newTestForm.castDate,
      testDate: newTestForm.testDate,
      testType: newTestForm.testType,
      targetStrengthMpa: target,
      achievedStrengthMpa: achieved,
      status: passed ? 'passed' : 'failed',
      technician: newTestForm.technician,
      remarks: newTestForm.remarks || (passed ? 'መስፈርቱን አሟልቷል' : 'ድጋሚ ምርመራ ያስፈልገዋል')
    };

    setQcTests([newTest, ...qcTests]);
    setIsAddTestOpen(false);
  };

  const passCount = qcTests.filter(t => t.status === 'passed').length;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-400" />
            <span>{language === 'am' ? 'የጥራት ቁጥጥርና የላቦራቶሪ ምርመራዎች' : 'Quality Assurance & Lab Testing'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'am'
              ? 'የኮንክሪት ኪውብ የመጨፍለቅ ጥንካሬ (Cube Test)፣ የብረት የመሳብ እና የዝለት (Slump) መዝገቦች'
              : 'Concrete cube crushing tests, slump tests, steel tensile yield checks, and safety compliance.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddTestOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('recordQcTest')}</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">{language === 'am' ? 'ጠቅላላ የላብ ምርመራዎች' : 'Total Quality Tests'}</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">{qcTests.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">{language === 'am' ? 'የተሳኩና ያለፉ (Passed)' : 'Compliant / Passed'}</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {passCount} ({Math.round((passCount / qcTests.length) * 100)}%)
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">{language === 'am' ? 'የ 28-ቀን ውጤት የሚጠብቁ' : 'Pending 28-Day Curing'}</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {qcTests.filter(t => t.status === 'pending_28d').length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'am' ? 'በኮድ፣ መዋቅር ወይም ቴክኒሽያን ፈልግ...' : 'Search test code, element...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          {['all', 'concrete_cube', 'slump_test', 'steel_tensile'].map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                typeFilter === tp ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tp === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') :
               tp === 'concrete_cube' ? (language === 'am' ? 'ኮንክሪት ኪውብ' : 'Cube Test') :
               tp === 'slump_test' ? (language === 'am' ? 'ስለምፕ (Slump)' : 'Slump') :
               (language === 'am' ? 'የብረት ጥንካሬ' : 'Steel Tensile')}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">የፈተና ኮድ</th>
                <th className="py-3 px-4">የተወሰደበት መዋቅር (Element)</th>
                <th className="py-3 px-4">የተሞላበት ቀን</th>
                <th className="py-3 px-4">የምርመራ ቀን</th>
                <th className="py-3 px-4 text-right">የሚጠበቅ (Target)</th>
                <th className="py-3 px-4 text-right">የተገኘ (Achieved)</th>
                <th className="py-3 px-4 text-center">ውጤት</th>
                <th className="py-3 px-4">ቴክኒሽያን / ማስታወሻ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTests.map((tst) => {
                const ratio = Math.round((tst.achievedStrengthMpa / tst.targetStrengthMpa) * 100);
                return (
                  <tr key={tst.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-semibold text-amber-400">
                      {tst.testCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">
                        {language === 'am' ? tst.structuralElementAm : tst.structuralElementEn}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {tst.testType.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {tst.castDate}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {tst.testDate}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                      {tst.targetStrengthMpa} {tst.testType === 'slump_test' ? 'mm' : 'MPa'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                      {tst.achievedStrengthMpa} {tst.testType === 'slump_test' ? 'mm' : 'MPa'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tst.status === 'passed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        tst.status === 'pending_28d' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {tst.status === 'passed' ? `PASSED (${ratio}%)` :
                         tst.status === 'pending_28d' ? 'PENDING 28D' : 'FAILED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs">
                      <div className="text-[11px] font-medium text-white truncate">{tst.technician}</div>
                      <div className="text-[11px] text-slate-400 truncate">{tst.remarks}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record QC Test Modal */}
      {isAddTestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-400" />
                <span>{t('recordQcTest')}</span>
              </h3>
              <button
                onClick={() => setIsAddTestOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">የምርመራ መለያ ኮድ *</label>
                  <input
                    type="text"
                    required
                    value={newTestForm.testCode}
                    onChange={(e) => setNewTestForm({ ...newTestForm, testCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('testType')}</label>
                  <select
                    value={newTestForm.testType}
                    onChange={(e) => setNewTestForm({ ...newTestForm, testType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                  >
                    <option value="concrete_cube">የኮንክሪት ኪውብ የመጨፍለቅ (Cube Crushing)</option>
                    <option value="slump_test">የኮንክሪት ዝለት (Slump Test)</option>
                    <option value="steel_tensile">የብረት የመሳብ ጥንካሬ (Tensile)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">የተወሰደበት መዋቅር (አማርኛ) *</label>
                <input
                  type="text"
                  required
                  placeholder="ምሳሌ፡ 12ኛ ፎቅ የሰሌዳና ቢም ኮንክሪት (C-25)"
                  value={newTestForm.structuralElementAm}
                  onChange={(e) => setNewTestForm({ ...newTestForm, structuralElementAm: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">የተሞላበት ቀን (Cast Date)</label>
                  <input
                    type="date"
                    value={newTestForm.castDate}
                    onChange={(e) => setNewTestForm({ ...newTestForm, castDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">የተመረመረበት ቀን (Test Date)</label>
                  <input
                    type="date"
                    value={newTestForm.testDate}
                    onChange={(e) => setNewTestForm({ ...newTestForm, testDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('targetStrength')} (MPa)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newTestForm.targetStrengthMpa}
                    onChange={(e) => setNewTestForm({ ...newTestForm, targetStrengthMpa: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('achievedStrength')} (MPa)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newTestForm.achievedStrengthMpa}
                    onChange={(e) => setNewTestForm({ ...newTestForm, achievedStrengthMpa: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ላቦራቶሪ ቴክኒሽያን</label>
                <input
                  type="text"
                  value={newTestForm.technician}
                  onChange={(e) => setNewTestForm({ ...newTestForm, technician: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">የምርመራ ማስታወሻ</label>
                <textarea
                  rows={2}
                  value={newTestForm.remarks}
                  onChange={(e) => setNewTestForm({ ...newTestForm, remarks: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTestOpen(false)}
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
