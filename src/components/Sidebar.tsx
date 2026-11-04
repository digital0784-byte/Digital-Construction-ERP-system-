import React from 'react';
import { 
  Building2, 
  Layers, 
  Package, 
  Truck, 
  Users, 
  CircleDollarSign, 
  FileText, 
  ShieldCheck, 
  BarChart3,
  HardHat
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  projectsCount: number;
  lowStockCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedProjectId,
  setSelectedProjectId,
  lowStockCount
}) => {
  const { t, language } = useLanguage();

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: Building2 },
    { id: 'projects', label: t('projects'), icon: Layers },
    { id: 'materials', label: t('materials'), icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'machinery', label: t('machinery'), icon: Truck },
    { id: 'labor', label: t('labor'), icon: Users },
    { id: 'finance', label: t('finance'), icon: CircleDollarSign },
    { id: 'dailylog', label: t('dailyLog'), icon: FileText },
    { id: 'quality', label: t('qualityHse'), icon: ShieldCheck },
    { id: 'reports', label: t('reports'), icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen shrink-0 sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <HardHat className="w-6 h-6 text-amber-400" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-white tracking-tight truncate">
            {language === 'am' ? 'ዘመን ኮንስትራክሽን' : 'Zemen Construction'}
          </h1>
          <p className="text-xs text-slate-400 truncate font-mono">
            ERP Enterprise v2.4
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
          {language === 'am' ? 'የስራ ሞጁሎች' : 'CORE MODULES'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User & Site Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <img
            src="/src/assets/images/construction_manager_avatar_1793174259204.jpg"
            alt="Director Avatar"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {language === 'am' ? 'ኢ/ር አለማየሁ በቀለ' : 'Eng. Alemayehu B.'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {language === 'am' ? 'የፕሮጀክቶች ዳይሬክተር' : 'Project Director'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
