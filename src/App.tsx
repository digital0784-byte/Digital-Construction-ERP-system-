/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Project, 
  Material, 
  Machinery, 
  Worker, 
  AttendanceRecord, 
  BOQItem, 
  InterimPaymentCertificate, 
  SiteDailyLog, 
  QualityTest,
  UserRole,
  SiteInspectionItem,
  SiteTaskOrder,
  LeaveRequest,
  StoreRequisition,
  ExecutiveMemo
} from './types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_MATERIALS, 
  INITIAL_MACHINERY, 
  INITIAL_WORKERS, 
  INITIAL_ATTENDANCE, 
  INITIAL_BOQ, 
  INITIAL_IPCS, 
  INITIAL_DAILY_LOGS, 
  INITIAL_QC_TESTS,
  INITIAL_INSPECTIONS,
  INITIAL_TASK_ORDERS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_STORE_REQUISITIONS,
  INITIAL_EXECUTIVE_MEMOS
} from './data/initialData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardOverview } from './components/DashboardOverview';
import { RoleDedicatedView } from './components/RoleDedicatedView';
import { SiteInspectionsModule } from './components/SiteInspectionsModule';
import { TaskOrdersModule } from './components/TaskOrdersModule';
import { ProjectsModule } from './components/ProjectsModule';
import { MaterialsModule } from './components/MaterialsModule';
import { MachineryModule } from './components/MachineryModule';
import { LaborModule } from './components/LaborModule';
import { FinanceModule } from './components/FinanceModule';
import { DailyLogModule } from './components/DailyLogModule';
import { QualityHSEModule } from './components/QualityHSEModule';
import { ReportsModule } from './components/ReportsModule';
import { PrintDocumentModal } from './components/PrintDocumentModal';

function AppContent() {
  const { language } = useLanguage();

  // Role State: Project Manager, Site Engineer, or Site Supervisor
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('zemen_erp_role');
    return (saved === 'project_manager' || saved === 'site_engineer' || saved === 'site_supervisor')
      ? (saved as UserRole)
      : 'project_manager';
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Print Document Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<'daily_diary' | 'ipc_voucher' | 'siv_voucher' | 'payroll_sheet'>('daily_diary');

  // ERP Persistent Data State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('zemen_erp_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('zemen_erp_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [machinery, setMachinery] = useState<Machinery[]>(() => {
    const saved = localStorage.getItem('zemen_erp_machinery');
    return saved ? JSON.parse(saved) : INITIAL_MACHINERY;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('zemen_erp_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('zemen_erp_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [boqItems, setBoqItems] = useState<BOQItem[]>(() => {
    const saved = localStorage.getItem('zemen_erp_boq');
    return saved ? JSON.parse(saved) : INITIAL_BOQ;
  });

  const [ipcs, setIpcs] = useState<InterimPaymentCertificate[]>(() => {
    const saved = localStorage.getItem('zemen_erp_ipcs');
    return saved ? JSON.parse(saved) : INITIAL_IPCS;
  });

  const [dailyLogs, setDailyLogs] = useState<SiteDailyLog[]>(() => {
    const saved = localStorage.getItem('zemen_erp_logs');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_LOGS;
  });

  const [qcTests, setQcTests] = useState<QualityTest[]>(() => {
    const saved = localStorage.getItem('zemen_erp_qc');
    return saved ? JSON.parse(saved) : INITIAL_QC_TESTS;
  });

  const [inspections, setInspections] = useState<SiteInspectionItem[]>(() => {
    const saved = localStorage.getItem('zemen_erp_inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [tasks, setTasks] = useState<SiteTaskOrder[]>(() => {
    const saved = localStorage.getItem('zemen_erp_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASK_ORDERS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('zemen_erp_leave');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [storeRequisitions, setStoreRequisitions] = useState<StoreRequisition[]>(() => {
    const saved = localStorage.getItem('zemen_erp_store_req');
    return saved ? JSON.parse(saved) : INITIAL_STORE_REQUISITIONS;
  });

  const [executiveMemos, setExecutiveMemos] = useState<ExecutiveMemo[]>(() => {
    const saved = localStorage.getItem('zemen_erp_memos');
    return saved ? JSON.parse(saved) : INITIAL_EXECUTIVE_MEMOS;
  });

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('zemen_erp_leave', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_store_req', JSON.stringify(storeRequisitions));
  }, [storeRequisitions]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_memos', JSON.stringify(executiveMemos));
  }, [executiveMemos]);
  useEffect(() => {
    localStorage.setItem('zemen_erp_role', currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_machinery', JSON.stringify(machinery));
  }, [machinery]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_boq', JSON.stringify(boqItems));
  }, [boqItems]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_ipcs', JSON.stringify(ipcs));
  }, [ipcs]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_qc', JSON.stringify(qcTests));
  }, [qcTests]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('zemen_erp_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const lowStockCount = materials.filter(m => m.currentStock <= m.minAlertStock).length;

  const handlePrintSpecificLog = (log: SiteDailyLog) => {
    setPrintDocType('daily_diary');
    setIsPrintModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar with Role Profile Switcher */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        projectsCount={projects.length}
        lowStockCount={lowStockCount}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar
          activeTab={activeTab}
          projects={projects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          onOpenPrintModal={() => setIsPrintModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Dedicated Role App Workspace Banner when active */}
            {(currentUserRole === 'ceo' || currentUserRole === 'head_office' || currentUserRole === 'store_owner' || currentUserRole === 'hr_manager' || currentUserRole === 'employee') && (
              <div className="mb-6">
                <RoleDedicatedView
                  currentUserRole={currentUserRole}
                  projects={projects}
                  materials={materials}
                  workers={workers}
                  ipcs={ipcs}
                  leaveRequests={leaveRequests}
                  setLeaveRequests={setLeaveRequests}
                  storeRequisitions={storeRequisitions}
                  setStoreRequisitions={setStoreRequisitions}
                  executiveMemos={executiveMemos}
                  setExecutiveMemos={setExecutiveMemos}
                />
              </div>
            )}

            {activeTab === 'dashboard' && (
              <DashboardOverview
                projects={projects}
                materials={materials}
                machinery={machinery}
                dailyLogs={dailyLogs}
                qcTests={qcTests}
                setActiveTab={setActiveTab}
                setSelectedProjectId={setSelectedProjectId}
              />
            )}

            {activeTab === 'site_inspections' && (
              <SiteInspectionsModule
                inspections={inspections}
                setInspections={setInspections}
                projects={projects}
                currentUserRole={currentUserRole}
              />
            )}

            {activeTab === 'task_orders' && (
              <TaskOrdersModule
                tasks={tasks}
                setTasks={setTasks}
                projects={projects}
                currentUserRole={currentUserRole}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsModule
                projects={projects}
                setProjects={setProjects}
                selectedProjectId={selectedProjectId}
                setSelectedProjectId={setSelectedProjectId}
              />
            )}

            {activeTab === 'materials' && (
              <MaterialsModule
                materials={materials}
                setMaterials={setMaterials}
                projects={projects}
              />
            )}

            {activeTab === 'machinery' && (
              <MachineryModule
                machinery={machinery}
                setMachinery={setMachinery}
                projects={projects}
              />
            )}

            {activeTab === 'labor' && (
              <LaborModule
                workers={workers}
                setWorkers={setWorkers}
                attendance={attendance}
                setAttendance={setAttendance}
                projects={projects}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceModule
                boqItems={boqItems}
                setBoqItems={setBoqItems}
                ipcs={ipcs}
                setIpcs={setIpcs}
                projects={projects}
              />
            )}

            {activeTab === 'dailylog' && (
              <DailyLogModule
                dailyLogs={dailyLogs}
                setDailyLogs={setDailyLogs}
                projects={projects}
                onPrintLog={handlePrintSpecificLog}
              />
            )}

            {activeTab === 'quality' && (
              <QualityHSEModule
                qcTests={qcTests}
                setQcTests={setQcTests}
                projects={projects}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsModule
                projects={projects}
                materials={materials}
                machinery={machinery}
                workers={workers}
                ipcs={ipcs}
                onOpenPrintModal={() => {
                  setPrintDocType('ipc_voucher');
                  setIsPrintModalOpen(true);
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Official Print/PDF Document Modal */}
      <PrintDocumentModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        projects={projects}
        ipcs={ipcs}
        dailyLogs={dailyLogs}
        materials={materials}
        workers={workers}
        attendance={attendance}
        initialDocType={printDocType}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
