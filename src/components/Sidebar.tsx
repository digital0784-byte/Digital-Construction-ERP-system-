import React, { useState } from 'react';
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
  HardHat,
  ClipboardCheck,
  CheckSquare,
  Crown,
  Briefcase,
  Store,
  UserCheck,
  Building
} from 'lucide-react';
import { ActiveTab, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  projectsCount: number;
  lowStockCount: number;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedProjectId,
  setSelectedProjectId,
  lowStockCount,
  currentUserRole,
  setCurrentUserRole
}) => {
  const { t, language } = useLanguage();

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: Building2 },
    { id: 'site_inspections', label: t('siteInspections'), icon: ClipboardCheck },
    { id: 'task_orders', label: t('taskOrders'), icon: CheckSquare },
    { id: 'projects', label: t('projects'), icon: Layers },
    { id: 'materials', label: t('materials'), icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'machinery', label: t('machinery'), icon: Truck },
    { id: 'labor', label: t('labor'), icon: Users },
    { id: 'finance', label: t('finance'), icon: CircleDollarSign },
    { id: 'dailylog', label: t('dailyLog'), icon: FileText },
    { id: 'quality', label: t('qualityHse'), icon: ShieldCheck },
    { id: 'reports', label: t('reports'), icon: BarChart3 }
  ];

  const roleProfiles: Record<UserRole, {
    name: string;
    roleTitleAm: string;
    roleTitleEn: string;
    image: string;
    appLabelAm: string;
    appLabelEn: string;
    color: string;
  }> = {
    ceo: {
      name: language === 'am' ? 'ወ/ሮ ሮዛ ግርማ' : 'Ms. Roza Girma',
      roleTitleAm: 'ዋና ስራ አስፈፃሚ (CEO)',
      roleTitleEn: 'Chief Executive Officer',
      image: '/src/assets/images/ceo_portrait_1793796445567.jpg',
      appLabelAm: 'CEO Cockpit App',
      appLabelEn: 'CEO Cockpit App',
      color: 'bg-amber-500'
    },
    head_office: {
      name: language === 'am' ? 'ኢ/ር ዳዊት መኮንን' : 'Eng. Dawit Mekonnen',
      roleTitleAm: 'የዋና መ/ቤት ኦፕሬሽን ዳይሬክተር',
      roleTitleEn: 'HQ Corporate Operations Director',
      image: '/src/assets/images/construction_site_hero_1793174257913.jpg',
      appLabelAm: 'Head Office HQ App',
      appLabelEn: 'Head Office HQ App',
      color: 'bg-indigo-500'
    },
    project_manager: {
      name: language === 'am' ? 'ኢ/ር አለማየሁ በቀለ' : 'Eng. Alemayehu Bekele',
      roleTitleAm: 'የፕሮጀክት ስራ አስኪያጅ (PM)',
      roleTitleEn: 'Project Manager (PM)',
      image: '/src/assets/images/construction_manager_avatar_1793174259204.jpg',
      appLabelAm: 'Project Manager App',
      appLabelEn: 'Project Manager App',
      color: 'bg-amber-500'
    },
    site_engineer: {
      name: language === 'am' ? 'ኢ/ር ትዕግስት ሃይሉ' : 'Eng. Tigist Hailu',
      roleTitleAm: 'የሳይት መሃንዲስ (Site Engineer)',
      roleTitleEn: 'Lead Site Civil Engineer',
      image: '/src/assets/images/site_engineer_action_1793796135049.jpg',
      appLabelAm: 'Site Engineer App',
      appLabelEn: 'Site Engineer App',
      color: 'bg-blue-500'
    },
    site_supervisor: {
      name: language === 'am' ? 'ሱፐርቫይዘር ታደሰ ወርቁ' : 'Supv. Tadesse Worku',
      roleTitleAm: 'የሳይት ሱፐርቫይዘር (Foreman)',
      roleTitleEn: 'General Site Supervisor',
      image: '/src/assets/images/site_supervisor_portrait_1793796148984.jpg',
      appLabelAm: 'Supervisor App',
      appLabelEn: 'Supervisor App',
      color: 'bg-emerald-500'
    },
    store_owner: {
      name: language === 'am' ? 'ተሾመ ካሳ' : 'Teshome Kassa',
      roleTitleAm: 'ዋና የመጋዘን ኃላፊ (Store Owner)',
      roleTitleEn: 'Central Warehouse & Store Manager',
      image: '/src/assets/images/store_manager_portrait_1793796446671.jpg',
      appLabelAm: 'Store Owner App',
      appLabelEn: 'Store Owner App',
      color: 'bg-orange-500'
    },
    hr_manager: {
      name: language === 'am' ? 'ሳባ ተስፋዬ' : 'Saba Tesfaye',
      roleTitleAm: 'የሰው ኃይል ዳይሬክተር (HR Director)',
      roleTitleEn: 'Human Resources & Talent Director',
      image: '/src/assets/images/hr_manager_portrait_1793796446759.jpg',
      appLabelAm: 'HR Manager App',
      appLabelEn: 'HR Manager App',
      color: 'bg-purple-500'
    },
    employee: {
      name: language === 'am' ? 'ጫላ ደምሴ' : 'Chala Demissie',
      roleTitleAm: 'የሳይት ሰራተኛ (Site Team Member)',
      roleTitleEn: 'Site Tradesperson & Laborer',
      image: '/src/assets/images/construction_machinery_1793174258556.jpg',
      appLabelAm: 'Employee Self-Service App',
      appLabelEn: 'Employee Self-Service App',
      color: 'bg-cyan-500'
    }
  };

  const currentProfile = roleProfiles[currentUserRole];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen shrink-0 sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <HardHat className="w-6 h-6 text-amber-400" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-white tracking-tight truncate">
            {language === 'am' ? 'ዲጂታል ኮንስትራክሽን' : 'digital Construction'}
          </h1>
          <p className="text-xs text-amber-400 truncate font-mono">
            ERP Enterprise System
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 text-[11px] font-semibold text-slate-400 tracking-wider">
          {language === 'am' ? 'የስራ ሞጁሎች' : 'CORE MODULES'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Profile & Switcher in Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
          <img
            src={currentProfile.image}
            alt={currentProfile.name}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-amber-400/40 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {currentProfile.name}
            </p>
            <p className="text-[10px] text-amber-300 truncate font-mono">
              {language === 'am' ? currentProfile.appLabelAm : currentProfile.appLabelEn}
            </p>
          </div>
        </div>

        {/* 8 Enterprise Role Workspaces Grid */}
        <div className="pt-1">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {language === 'am' ? 'የስራ ክፍል አፕሊኬሽን:' : 'Workspaces (8 Apps):'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-[9px] font-mono">
            <button
              onClick={() => setCurrentUserRole('ceo')}
              title="CEO App"
              className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                currentUserRole === 'ceo' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              CEO
            </button>
            <button
              onClick={() => setCurrentUserRole('head_office')}
              title="Head Office App"
              className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                currentUserRole === 'head_office' ? 'bg-indigo-500 text-white font-bold border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              HQ
            </button>
            <button
              onClick={() => setCurrentUserRole('project_manager')}
              title="Project Manager App"
              className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                currentUserRole === 'project_manager' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              PM
            </button>
            <button
              onClick={() => setCurrentUserRole('site_engineer')}
              title="Site Engineer App"
              className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                currentUserRole === 'site_engineer' ? 'bg-blue-500 text-white font-bold border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              SE
            </button>
            <button
              onClick={() => setCurrentUserRole('site_supervisor')}
              title="Site Supervisor App"
              className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                currentUserRole === 'site_supervisor' ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Supv
            </button>
            <button
              onClick={() => setCurrentUserRole('store_owner')}
              title="Store Owner App"
              className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                currentUserRole === 'store_owner' ? 'bg-orange-500 text-slate-950 font-bold border-orange-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Store
            </button>
            <button
              onClick={() => setCurrentUserRole('hr_manager')}
              title="HR App"
              className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                currentUserRole === 'hr_manager' ? 'bg-purple-500 text-white font-bold border-purple-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              HR
            </button>
            <button
              onClick={() => setCurrentUserRole('employee')}
              title="Employee App"
              className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                currentUserRole === 'employee' ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Emp
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
