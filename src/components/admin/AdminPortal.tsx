import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Inbox, 
  Users, 
  FileSpreadsheet, 
  Settings, 
  History, 
  ShieldAlert, 
  LogOut, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Send,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  Vehicle, 
  PurchaseInquiry, 
  AdminUser, 
  SiteSettings, 
  ActivityLog, 
  BodyStyle, 
  VehicleStatus,
  InquiryStatus
} from '../../types/vehicle';
import { 
  getFullInventory, 
  saveCustomVehicle, 
  updateVehicle, 
  deleteVehicle 
} from '../../data/inventoryEngine';
import { 
  getInventoryStats 
} from '../../services/inventoryService';
import { 
  getInquiries, 
  updateInquiryStatus, 
  addInquiryNote, 
  addInquiryReply, 
  getActivityLogs, 
  logActivity, 
  getSiteSettings, 
  updateSiteSettings, 
  setAdminSession 
} from '../../services/storeService';

interface AdminPortalProps {
  currentAdmin: AdminUser | null;
  onAdminChange: (admin: AdminUser | null) => void;
  onBackToStore: () => void;
  onViewVehicle: (id: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentAdmin,
  onAdminChange,
  onBackToStore,
  onViewVehicle
}) => {
  // Navigation Section in Admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'inquiries' | 'import-export' | 'content' | 'logs'>('dashboard');

  // Login form state if not logged in
  const [loginEmail, setLoginEmail] = useState('admin@autoplex.com');
  const [loginRole, setLoginRole] = useState<AdminUser['role']>('Super Administrator');

  // Inventory Table Filter / Search / Pagination
  const [invSearch, setInvSearch] = useState('');
  const [invStatusFilter, setInvStatusFilter] = useState<string>('All');
  const [invMakeFilter, setInvMakeFilter] = useState<string>('All');
  const [invPage, setInvPage] = useState(1);
  const invPageSize = 15;

  // Inventory Modal (Add or Edit)
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  
  // Vehicle Form State
  const [formMake, setFormMake] = useState('Toyota');
  const [formModel, setFormModel] = useState('Corolla');
  const [formTrim, setFormTrim] = useState('LE');
  const [formYear, setFormYear] = useState(2013);
  const [formPrice, setFormPrice] = useState(4850);
  const [formMileage, setFormMileage] = useState(88000);
  const [formBodyStyle, setFormBodyStyle] = useState<BodyStyle>('Sedan');
  const [formStatus, setFormStatus] = useState<VehicleStatus>('Available');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formLocation, setFormLocation] = useState('Dallas, TX');
  const [formError, setFormError] = useState('');

  // Inquiry Management State
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('All');
  const [newNoteText, setNewNoteText] = useState('');
  const [replyText, setReplyText] = useState('');

  // Site Settings Form
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(getSiteSettings());
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [csvImportMsg, setCsvImportMsg] = useState('');

  // Force re-render on data modification
  const [tick, setTick] = useState(0);
  const reloadData = () => setTick(t => t + 1);

  // Queries
  const allInventory = useMemo(() => getFullInventory(), [tick]);
  const stats = useMemo(() => getInventoryStats(), [tick]);
  const inquiries = useMemo(() => getInquiries(), [tick]);
  const activityLogs = useMemo(() => getActivityLogs(), [tick]);

  // Auth Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin: AdminUser = {
      id: `adm-${Date.now()}`,
      name: loginEmail.split('@')[0].toUpperCase(),
      email: loginEmail,
      role: loginRole
    };
    setAdminSession(admin);
    onAdminChange(admin);
    logActivity(admin.name, 'Staff Login', `Logged in as ${admin.role}`, 'security');
  };

  const handleAdminLogout = () => {
    if (currentAdmin) {
      logActivity(currentAdmin.name, 'Staff Logout', 'Ended administrative session', 'security');
    }
    setAdminSession(null);
    onAdminChange(null);
  };

  // If not logged in as Admin, show Admin Login Screen with role presets
  if (!currentAdmin) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Autoplex Staff Console
              </h2>
              <span className="text-xs text-slate-400">
                Authorized Personnel & Inventory Management
              </span>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Access Role
              </label>
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as AdminUser['role'])}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Super Administrator">Super Administrator (Full System)</option>
                <option value="Inventory Manager">Inventory Manager (Catalog & Pricing)</option>
                <option value="Sales Agent">Sales Agent (Inquiries & Customer Care)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-lg text-[11px] text-slate-400 border border-slate-700">
              Select any role preset above for instant verification and dashboard access.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onBackToStore}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Dealership</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Inventory Table filtering
  const filteredInventory = allInventory.filter(v => {
    if (invStatusFilter !== 'All' && v.status !== invStatusFilter) return false;
    if (invMakeFilter !== 'All' && v.make !== invMakeFilter) return false;
    if (invSearch) {
      const q = invSearch.toLowerCase();
      return (
        v.id.toLowerCase().includes(q) ||
        v.vin.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalInvPages = Math.ceil(filteredInventory.length / invPageSize) || 1;
  const paginatedInventory = filteredInventory.slice((invPage - 1) * invPageSize, invPage * invPageSize);

  // Open Add Vehicle Modal
  const handleOpenAddVehicle = () => {
    setEditingVehicleId(null);
    setFormMake('Toyota');
    setFormModel('Camry');
    setFormTrim('LE');
    setFormYear(2012);
    setFormPrice(4795);
    setFormMileage(92000);
    setFormBodyStyle('Sedan');
    setFormStatus('Available');
    setFormFeatured(false);
    setFormLocation('Dallas, TX');
    setFormError('');
    setVehicleModalOpen(true);
  };

  // Open Edit Vehicle Modal
  const handleOpenEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setFormMake(v.make);
    setFormModel(v.model);
    setFormTrim(v.trim);
    setFormYear(v.year);
    setFormPrice(v.price);
    setFormMileage(v.mileage);
    setFormBodyStyle(v.bodyStyle);
    setFormStatus(v.status);
    setFormFeatured(v.featured);
    setFormLocation(v.location);
    setFormError('');
    setVehicleModalOpen(true);
  };

  // Save Vehicle (Enforce strict <$8,000 rule!)
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (formPrice >= 8000) {
      setFormError('STRICT POLICY ENFORCEMENT: Price must be strictly below $8,000 USD.');
      return;
    }
    if (formPrice <= 500) {
      setFormError('Price must be at least $500.');
      return;
    }

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, {
        make: formMake,
        model: formModel,
        trim: formTrim,
        year: Number(formYear),
        price: Number(formPrice),
        mileage: Number(formMileage),
        bodyStyle: formBodyStyle,
        status: formStatus,
        featured: formFeatured,
        location: formLocation
      });
      logActivity(currentAdmin.name, 'Updated Vehicle', `Modified ${formYear} ${formMake} ${formModel} (${editingVehicleId})`, 'inventory');
    } else {
      const newId = `APX-${15500 + Math.floor(Math.random() * 5000)}`;
      const newVin = `1HG${formMake.substring(0, 2).toUpperCase()}89X92${newId.replace('APX-', '')}`;
      const newVehicle: Vehicle = {
        id: newId,
        vin: newVin,
        make: formMake,
        model: formModel,
        trim: formTrim,
        year: Number(formYear),
        price: Number(formPrice),
        mileage: Number(formMileage),
        bodyStyle: formBodyStyle,
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        drivetrain: 'FWD',
        engine: '2.4L 4-Cylinder',
        doors: 4,
        seats: 5,
        exteriorColor: 'Silver Metallic',
        interiorColor: 'Ebony Cloth',
        condition: 'Good',
        location: formLocation,
        featured: formFeatured,
        status: formStatus,
        published: true,
        description: `Verified pre-owned ${formYear} ${formMake} ${formModel} ${formTrim}. 120-point mechanical certified. Strictly under $8,000.`,
        features: ['Air Conditioning', 'Power Windows', 'Remote Keyless Entry', 'ABS Brakes'],
        mainImage: '/src/assets/images/featured_reliable_sedan_1792687190969.jpg',
        gallery: [
          '/src/assets/images/featured_reliable_sedan_1792687190969.jpg',
          '/src/assets/images/hero_car_showroom_1792687189650.jpg'
        ],
        createdAt: new Date().toISOString(),
        mpgCity: 25,
        mpgHwy: 34
      };
      saveCustomVehicle(newVehicle);
      logActivity(currentAdmin.name, 'Created Vehicle', `Added new vehicle ${newVehicle.id} - ${newVehicle.year} ${newVehicle.make} ($${newVehicle.price})`, 'inventory');
    }

    setVehicleModalOpen(false);
    reloadData();
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm(`Confirm deletion of vehicle ${id}?`)) {
      deleteVehicle(id);
      logActivity(currentAdmin.name, 'Deleted Vehicle', `Removed vehicle ${id} from catalog`, 'inventory');
      reloadData();
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['id', 'vin', 'make', 'model', 'trim', 'year', 'price', 'mileage', 'bodyStyle', 'transmission', 'status', 'location'];
    const rows = allInventory.slice(0, 1000).map(v => [
      v.id,
      v.vin,
      v.make,
      v.model,
      v.trim,
      v.year,
      v.price,
      v.mileage,
      v.bodyStyle,
      v.transmission,
      v.status,
      `"${v.location}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `autoplex_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logActivity(currentAdmin.name, 'CSV Inventory Export', `Exported inventory catalog to CSV file`, 'system');
  };

  // CSV Import
  const handleImportCSV = () => {
    if (!csvText.trim()) {
      setCsvImportMsg('Please paste CSV text or template rows below.');
      return;
    }

    const lines = csvText.trim().split('\n');
    let importedCount = 0;
    let rejectedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 6) {
        const make = parts[0] || 'Toyota';
        const model = parts[1] || 'Corolla';
        const year = parseInt(parts[2], 10) || 2012;
        const price = parseInt(parts[3], 10) || 4500;
        const mileage = parseInt(parts[4], 10) || 95000;
        const bodyStyle = (parts[5] as BodyStyle) || 'Sedan';

        // STRICT ENFORCEMENT: Price must be < $8,000
        if (price >= 8000) {
          rejectedCount++;
          continue;
        }

        const id = `APX-${18000 + i}`;
        const newVehicle: Vehicle = {
          id,
          vin: `1HG${make.substring(0, 2).toUpperCase()}CSV${Date.now().toString().slice(-4)}${i}`,
          make,
          model,
          trim: 'Base',
          year,
          price,
          mileage,
          bodyStyle,
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          drivetrain: 'FWD',
          engine: '2.0L 4-Cylinder',
          doors: 4,
          seats: 5,
          exteriorColor: 'Classic Gray',
          interiorColor: 'Black Cloth',
          condition: 'Good',
          location: 'Dallas, TX',
          featured: false,
          status: 'Available',
          published: true,
          description: `Imported verified ${year} ${make} ${model}. Clean title.`,
          features: ['Air Conditioning', 'Power Windows', 'ABS'],
          mainImage: '/src/assets/images/featured_reliable_sedan_1792687190969.jpg',
          gallery: ['/src/assets/images/featured_reliable_sedan_1792687190969.jpg'],
          createdAt: new Date().toISOString(),
          mpgCity: 26,
          mpgHwy: 35
        };

        saveCustomVehicle(newVehicle);
        importedCount++;
      }
    }

    setCsvImportMsg(`Import complete: ${importedCount} vehicles added. ${rejectedCount} rejected (exceeded $8,000 price limit).`);
    logActivity(currentAdmin.name, 'CSV Inventory Import', `Processed CSV: +${importedCount} vehicles, ${rejectedCount} rejected`, 'inventory');
    reloadData();
  };

  // Inquiry Reply Handler
  const handleSendReply = (inquiryId: string) => {
    if (!replyText.trim()) return;
    addInquiryReply(inquiryId, `${currentAdmin.name} (${currentAdmin.role})`, replyText.trim());
    setReplyText('');
    reloadData();
  };

  // Inquiry Add Note Handler
  const handleAddNote = (inquiryId: string) => {
    if (!newNoteText.trim()) return;
    addInquiryNote(inquiryId, currentAdmin.name, newNoteText.trim());
    setNewNoteText('');
    reloadData();
  };

  // Site Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(siteSettings);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 2500);
    reloadData();
  };

  const selectedInquiry = inquiries.find(i => i.id === selectedInquiryId) || null;

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            APX
          </div>
          <div>
            <span className="text-sm font-bold font-display block leading-tight">
              Autoplex Admin Portal
            </span>
            <span className="text-[10px] text-slate-400 block leading-tight">
              Catalog: {stats.total.toLocaleString()} Units · Strict &lt;$8,000 Enforced
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Dealership</span>
          </button>

          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <span className="font-semibold text-slate-200">{currentAdmin.name}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              {currentAdmin.role}
            </span>
          </div>

          <button
            onClick={handleAdminLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
              activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4" />
              <span>Inventory Management</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 tabular-nums">
              {stats.total.toLocaleString()}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
              activeTab === 'inquiries' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>Purchase Inquiries</span>
            </div>
            <span className="text-[10px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded font-bold tabular-nums">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('import-export')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
              activeTab === 'import-export' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV Import / Export</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
              activeTab === 'content' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Website Content & Info</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
              activeTab === 'logs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>System Activity Logs</span>
          </button>

          <div className="pt-6 border-t border-slate-800 mt-6 text-[11px] text-slate-500 space-y-1">
            <span className="block font-semibold text-slate-400">Security Rule Active</span>
            <p>Database constraint blocks any vehicles with price &ge; $8,000 USD from saving.</p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                    Dealership Analytics & Operations
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time status for Autoplex Auto Group catalog of 5,000+ affordable second-hand vehicles.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddVehicle}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Vehicle</span>
                </button>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Total Inventory</span>
                    <Car className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-2xl font-extrabold font-display text-slate-900 tabular-nums block">
                    {stats.total.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                    {stats.available.toLocaleString()} available for sale
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Average Listing Price</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-extrabold font-display text-slate-900 tabular-nums block">
                    ${stats.avgPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    100% strictly &lt; $8,000 USD
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Purchase Inquiries</span>
                    <Inbox className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-2xl font-extrabold font-display text-slate-900 tabular-nums block">
                    {inquiries.length}
                  </span>
                  <span className="text-[11px] text-blue-600 font-medium mt-1 block">
                    {inquiries.filter(i => i.status === 'New').length} pending review
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Average Mileage</span>
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-2xl font-extrabold font-display text-slate-900 tabular-nums block">
                    {stats.avgMileage.toLocaleString()} mi
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    120-point inspected fleet
                  </span>
                </div>
              </div>

              {/* Price Tier Distribution Strip */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-bold font-display text-slate-900 mb-4">
                  Inventory Distribution by Price Ceiling
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block">Under $2,000</span>
                    <span className="text-lg font-bold font-display text-slate-900 tabular-nums">
                      {stats.under2k.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Entry commuters</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block">Under $3,000</span>
                    <span className="text-lg font-bold font-display text-slate-900 tabular-nums">
                      {stats.under3k.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">High efficiency runners</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block">Under $5,000</span>
                    <span className="text-lg font-bold font-display text-slate-900 tabular-nums">
                      {stats.under5k.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Popular sedans & SUVs</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-xs text-blue-700 font-semibold block">Under $8,000 (Total)</span>
                    <span className="text-lg font-bold font-display text-blue-900 tabular-nums">
                      {stats.under8k.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-blue-600 block">100% of inventory</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Mini-Feed */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-display text-slate-900">
                    Recent Administrative Operations
                  </h3>
                  <button 
                    onClick={() => setActiveTab('logs')}
                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                  >
                    View Complete Audit Log
                  </button>
                </div>
                <div className="space-y-3">
                  {activityLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="text-xs flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-mono text-[10px] shrink-0 mt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800">{log.user}: </span>
                        <span className="text-slate-700">{log.action}</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                    Inventory Catalog ({filteredInventory.length.toLocaleString()} matching)
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Search, modify pricing, toggle availability, and publish vehicle listings.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddVehicle}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Vehicle</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={invSearch}
                    onChange={(e) => {
                      setInvSearch(e.target.value);
                      setInvPage(1);
                    }}
                    placeholder="Search by ID, VIN, Make, Model..."
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  <select
                    value={invStatusFilter}
                    onChange={(e) => {
                      setInvStatusFilter(e.target.value);
                      setInvPage(1);
                    }}
                    className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
                      <th className="p-3.5">ID / VIN</th>
                      <th className="p-3.5">Vehicle</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Mileage</th>
                      <th className="p-3.5">Style</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedInventory.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-mono text-[11px]">
                          <span className="font-bold text-blue-600 block">{v.id}</span>
                          <span className="text-slate-400">{v.vin}</span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => onViewVehicle(v.id)}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer text-left block"
                          >
                            {v.year} {v.make} {v.model} {v.trim}
                          </button>
                          {v.featured && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-extrabold text-slate-900 tabular-nums">
                          ${v.price.toLocaleString()}
                        </td>
                        <td className="p-3.5 tabular-nums text-slate-600">
                          {v.mileage.toLocaleString()} mi
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {v.bodyStyle}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {v.location}
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            v.status === 'Available' ? 'bg-emerald-50 text-emerald-700' :
                            v.status === 'Reserved' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditVehicle(v)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100 cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Showing {((invPage - 1) * invPageSize) + 1} to {Math.min(invPage * invPageSize, filteredInventory.length)} of {filteredInventory.length.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInvPage(p => Math.max(1, p - 1))}
                      disabled={invPage <= 1}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {invPage} / {totalInvPages}
                    </span>
                    <button
                      onClick={() => setInvPage(p => Math.min(totalInvPages, p + 1))}
                      disabled={invPage >= totalInvPages}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PURCHASE INQUIRIES MANAGEMENT */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                    Customer Purchase Inquiries ({inquiries.length})
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review customer requests, send responses, and coordinate vehicle viewings.
                  </p>
                </div>
              </div>

              {/* Inquiry Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-200 rounded-lg">
                {(['All', 'New', 'Contacted', 'Awaiting Customer', 'Negotiation', 'Reserved', 'Completed', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setInquiryStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      inquiryStatusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Inquiries Grid / Detail View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* List on Left (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  {inquiries
                    .filter(i => inquiryStatusFilter === 'All' || i.status === inquiryStatusFilter)
                    .map((inq) => (
                      <div
                        key={inq.id}
                        onClick={() => setSelectedInquiryId(inq.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedInquiryId === inq.id
                            ? 'bg-blue-50/60 border-blue-500 shadow-xs ring-1 ring-blue-500'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-blue-600">{inq.referenceNumber}</span>
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            inq.status === 'New' ? 'bg-emerald-100 text-emerald-800' :
                            inq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                            inq.status === 'Completed' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{inq.customerName}</h4>
                        <div className="text-xs text-slate-500 mt-1 flex justify-between">
                          <span>{inq.items.length} vehicle(s) · ${inq.totalValue.toLocaleString()}</span>
                          <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Detail View on Right (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
                  {selectedInquiry ? (
                    <div className="space-y-6">
                      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-mono font-bold text-blue-600 block">
                            {selectedInquiry.referenceNumber}
                          </span>
                          <h3 className="text-lg font-bold font-display text-slate-900">
                            {selectedInquiry.customerName}
                          </h3>
                          <div className="text-xs text-slate-500 mt-1 space-x-3">
                            <span>Email: {selectedInquiry.customerEmail}</span>
                            <span>Phone: {selectedInquiry.customerPhone}</span>
                            <span>Prefers: {selectedInquiry.preferredContact}</span>
                          </div>
                        </div>

                        {/* Status Change Selector */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Status Workflow:
                          </label>
                          <select
                            value={selectedInquiry.status}
                            onChange={(e) => {
                              updateInquiryStatus(selectedInquiry.id, e.target.value as InquiryStatus);
                              reloadData();
                            }}
                            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Awaiting Customer">Awaiting Customer</option>
                            <option value="Negotiation">Negotiation</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Vehicles Inquired */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Vehicles Attached
                        </h4>
                        <div className="space-y-2">
                          {selectedInquiry.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                              <div>
                                <span className="font-bold text-slate-900">{item.vehicleTitle}</span>
                                <span className="text-slate-500 block text-[11px] font-mono">VIN: {item.vin} · Lot: {item.location}</span>
                              </div>
                              <span className="font-extrabold text-slate-900 tabular-nums">
                                ${item.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Note */}
                      {selectedInquiry.customerMessage && (
                        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs">
                          <span className="font-bold text-blue-900 block mb-1">Customer Note / Inquiries:</span>
                          <p className="text-blue-950 leading-relaxed">{selectedInquiry.customerMessage}</p>
                        </div>
                      )}

                      {/* Internal Notes */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Internal Staff Notes
                        </h4>
                        <div className="space-y-2 mb-3">
                          {selectedInquiry.internalNotes.length === 0 ? (
                            <span className="text-xs text-slate-400 italic">No internal notes yet.</span>
                          ) : (
                            selectedInquiry.internalNotes.map(n => (
                              <div key={n.id} className="p-2.5 bg-amber-50/60 border border-amber-200/60 rounded text-xs">
                                <div className="flex justify-between font-semibold text-amber-900 text-[11px] mb-0.5">
                                  <span>{n.author}</span>
                                  <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-amber-950">{n.note}</p>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            placeholder="Add internal note for staff..."
                            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                          />
                          <button
                            onClick={() => handleAddNote(selectedInquiry.id)}
                            className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>

                      {/* Customer Reply Composer */}
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Send Customer Communication Reply
                        </h4>
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type customer reply message (simulates dispatch via email/SMS)..."
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                          />
                          <button
                            onClick={() => handleSendReply(selectedInquiry.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Verified Reply</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-16 text-xs text-slate-400">
                      Select an inquiry on the left to view customer details and manage follow-ups.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CSV IMPORT & EXPORT */}
          {activeTab === 'import-export' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                  Bulk Inventory Import & Export
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Export your active inventory to spreadsheet or bulk import thousands of verified listings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Export Catalog to CSV</h3>
                      <span className="text-xs text-slate-500">Download formatted vehicle inventory sheet</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Generates a comma-separated inventory export file containing ID, VIN, Make, Model, Trim, Year, Price, Mileage, and Location.
                  </p>
                  <button
                    onClick={handleExportCSV}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Inventory CSV</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Import Vehicles via CSV</h3>
                      <span className="text-xs text-slate-500">Automated parser with strict &lt;$8k validation</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Paste raw CSV lines below. Format: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">Make,Model,Year,Price,Mileage,BodyStyle</code>
                  </p>
                  <textarea
                    rows={4}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder="Toyota,Corolla,2013,4600,94000,Sedan&#10;Honda,Civic,2012,4900,98000,Sedan"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                  />
                  {csvImportMsg && (
                    <div className="p-2.5 bg-blue-50 text-blue-900 border border-blue-200 rounded text-xs">
                      {csvImportMsg}
                    </div>
                  )}
                  <button
                    onClick={handleImportCSV}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Execute CSV Import</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE CONTENT MANAGEMENT */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                  Website Content & Brand Messaging
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update customer announcements, dealership addresses, and support contact lines.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs max-w-2xl">
                {settingsSavedMsg && (
                  <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Website settings updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 mb-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={siteSettings.announcementEnabled}
                        onChange={(e) => setSiteSettingsState({ ...siteSettings, announcementEnabled: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Enable Top Announcement Bar</span>
                    </label>
                    <input
                      type="text"
                      value={siteSettings.announcementText}
                      onChange={(e) => setSiteSettingsState({ ...siteSettings, announcementText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Support Phone Line
                      </label>
                      <input
                        type="text"
                        value={siteSettings.supportPhone}
                        onChange={(e) => setSiteSettingsState({ ...siteSettings, supportPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Inquiries Email
                      </label>
                      <input
                        type="email"
                        value={siteSettings.supportEmail}
                        onChange={(e) => setSiteSettingsState({ ...siteSettings, supportEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Dealership Headquarters Address
                    </label>
                    <input
                      type="text"
                      value={siteSettings.dealershipAddress}
                      onChange={(e) => setSiteSettingsState({ ...siteSettings, dealershipAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Hero Display Headline
                    </label>
                    <input
                      type="text"
                      value={siteSettings.heroHeadline}
                      onChange={(e) => setSiteSettingsState({ ...siteSettings, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                  System & Audit Logs
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological history of inventory edits, customer submissions, and security audits.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 uppercase text-[11px]">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Details</th>
                      <th className="p-3.5">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900 whitespace-nowrap">
                          {log.user}
                        </td>
                        <td className="p-3.5 font-medium text-slate-800">
                          {log.action}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {log.details}
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {log.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold font-display text-slate-900">
                {editingVehicleId ? `Edit Vehicle (${editingVehicleId})` : 'Add New Inventory Vehicle'}
              </h3>
              <button
                onClick={() => setVehicleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveVehicle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Make *</label>
                  <input
                    type="text"
                    required
                    value={formMake}
                    onChange={(e) => setFormMake(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Model *</label>
                  <input
                    type="text"
                    required
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Trim</label>
                  <input
                    type="text"
                    value={formTrim}
                    onChange={(e) => setFormTrim(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Year *</label>
                  <input
                    type="number"
                    min={1995}
                    max={2026}
                    required
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5 text-blue-700">Price (&lt; $8,000) *</label>
                  <input
                    type="number"
                    max={7999}
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-blue-50/50 border border-blue-300 rounded-md text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Mileage (mi) *</label>
                  <input
                    type="number"
                    required
                    value={formMileage}
                    onChange={(e) => setFormMileage(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Body Style</label>
                  <select
                    value={formBodyStyle}
                    onChange={(e) => setFormBodyStyle(e.target.value as BodyStyle)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Wagon">Wagon</option>
                    <option value="Van">Van</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as VehicleStatus)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Fulfillment Hub</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Display as Featured Deal on Homepage</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Vehicle Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
