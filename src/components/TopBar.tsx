import React from 'react';
import { Globe, Printer, Plus, Calendar } from 'lucide-react';
import { ActiveTab, Project } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TopBarProps {
  activeTab: ActiveTab;
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  onOpenPrintModal: () => void;
  onOpenCreateModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  onOpenPrintModal,
  onOpenCreateModal
}) => {
  const { t, language, setLanguage } = useLanguage();

  const getModuleTitle = () => {
    switch (activeTab) {
      case 'dashboard': return t('dashboard');
      case 'site_inspections': return t('siteInspections');
      case 'task_orders': return t('taskOrders');
      case 'projects': return t('projects');
      case 'materials': return t('materials');
      case 'machinery': return t('machinery');
      case 'labor': return t('labor');
      case 'finance': return t('finance');
      case 'dailylog': return t('dailyLog');
      case 'quality': return t('qualityHse');
      case 'reports': return t('reports');
      default: return '';
    }
  };

  const todayFormatted = new Intl.DateTimeFormat(language === 'am' ? 'am-ET' : 'en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-8 shrink-0 sticky top-0 z-10">
      {/* Zone 1: Contextual Breadcrumb */}
      <div className="flex items-center gap-2 text-sm whitespace-nowrap shrink-0">
        <span className="font-semibold text-slate-400">
          {language === 'am' ? 'ዲጂታል ኮንስትራክሽን ኢአርፒ' : 'digital Construction ERP system'}
        </span>
        <span className="text-slate-600">/</span>
        <span className="font-medium text-amber-400">
          {getModuleTitle()}
        </span>
      </div>

      {/* Zone 2: Project Filter & Language Switch */}
      <div className="flex items-center gap-4 text-xs">
        {/* Project Context Filter */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800">
          <span className="text-slate-400 whitespace-nowrap">
            {language === 'am' ? 'ሳይት ምረጥ:' : 'Site:'}
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer max-w-[200px] truncate"
          >
            <option value="all" className="bg-slate-900 text-white">
              {language === 'am' ? 'ሁሉም ሳይቶች (4)' : 'All Construction Sites (4)'}
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {language === 'am' ? p.nameAm : p.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-md border border-slate-800/80">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono tabular-nums">{todayFormatted}</span>
        </div>

        {/* Bilingual Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'am' ? 'en' : 'am')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors whitespace-nowrap shrink-0 border border-slate-700 text-xs font-medium cursor-pointer"
          title={language === 'am' ? 'ወደ እንግሊዝኛ ቀይር' : 'Switch to Amharic'}
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'am' ? 'English' : 'አማርኛ'}</span>
        </button>
      </div>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenPrintModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t('exportPdf')}</span>
        </button>
      </div>
    </header>
  );
};
