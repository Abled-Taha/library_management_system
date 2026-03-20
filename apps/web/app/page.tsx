"use client"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Book, 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  MoreVertical,
  ChevronRight,
  User,
  Calendar,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const MOCK_BOOKS = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", status: "Available", category: "Fiction", coverColor: "bg-blue-100" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", status: "Issued", category: "Technology", coverColor: "bg-emerald-100" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", status: "Reserved", category: "History", coverColor: "bg-amber-100" },
  { id: 4, title: "Dune", author: "Frank Herbert", isbn: "978-0441172719", status: "Available", category: "Sci-Fi", coverColor: "bg-orange-100" },
  { id: 5, title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", status: "Issued", category: "Self-Help", coverColor: "bg-purple-100" },
];

const MOCK_MEMBERS = [
  { id: 101, name: "Alice Johnson", email: "alice@example.com", joined: "2023-01-15", activeLoans: 2, status: "Active" },
  { id: 102, name: "Bob Smith", email: "bob.smith@example.com", joined: "2023-03-22", activeLoans: 0, status: "Active" },
  { id: 103, name: "Charlie Davis", email: "charlie.d@example.com", joined: "2022-11-05", activeLoans: 1, status: "Suspended" },
];

const MOCK_TRANSACTIONS = [
  { id: 'T-1001', user: "Alice Johnson", book: "Clean Code", type: "Issue", date: "2023-10-24", dueDate: "2023-11-24" },
  { id: 'T-1002', user: "Bob Smith", book: "The Great Gatsby", type: "Return", date: "2023-10-23", dueDate: "-" },
  { id: 'T-1003', user: "Charlie Davis", book: "Atomic Habits", type: "Issue", date: "2023-10-20", dueDate: "2023-11-20" },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
      active 
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
    {label}
  </button>
);

const StatCard = ({ title, value, trend, trendUp, icon: Icon, colorClass }: any) => (
  <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="flex items-center mt-4 text-sm">
      <span className={cn("font-medium", trendUp ? "text-emerald-600" : "text-rose-600")}>
        {trend}
      </span>
      <span className="ml-2 text-slate-400">vs last month</span>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Issued: "bg-blue-100 text-blue-700 border-blue-200",
    Reserved: "bg-amber-100 text-amber-700 border-amber-200",
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Suspended: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700")}>
      {status}
    </span>
  );
};

// --- Views ---

const DashboardView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Books" 
        value="12,450" 
        trend="+5.2%" 
        trendUp={true} 
        icon={Book} 
        colorClass="bg-indigo-500" 
      />
      <StatCard 
        title="Active Members" 
        value="3,200" 
        trend="+12%" 
        trendUp={true} 
        icon={Users} 
        colorClass="bg-emerald-500" 
      />
      <StatCard 
        title="Books Issued Today" 
        value="42" 
        trend="-2.4%" 
        trendUp={false} 
        icon={BookOpen} 
        colorClass="bg-blue-500" 
      />
      <StatCard 
        title="Overdue Books" 
        value="18" 
        trend="+4" 
        trendUp={false} 
        icon={AlertCircle} 
        colorClass="bg-rose-500" 
      />
    </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Recent Activity */}
      <div className="lg:col-span-2 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Transaction ID</th>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{t.id}</td>
                  <td className="px-4 py-3 text-slate-600">{t.book}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {t.user.charAt(0)}
                      </div>
                      <span className="text-slate-600">{t.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{t.date}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      t.type === 'Issue' ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                    )}>
                      {t.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions / Alerts */}
      <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Notifications</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="mt-1">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Overdue Book Alert</p>
                <p className="text-xs text-slate-500 mt-1">"The Great Gatsby" is 3 days overdue for Alice J.</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-2 mt-6 text-sm font-medium text-center text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  </div>
);

const BooksView = () => {
  const [search, setSearch] = useState("");
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Book Inventory</h2>
          <p className="text-slate-500">Manage library books, check availability, and update records.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          Add New Book
        </button>
      </div>

      <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:border-indigo-500">
            <option>All Categories</option>
            <option>Fiction</option>
            <option>Technology</option>
            <option>History</option>
          </select>
          <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:border-indigo-500">
            <option>All Status</option>
            <option>Available</option>
            <option>Issued</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">ISBN</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_BOOKS.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-14 rounded shadow-sm flex-shrink-0", book.coverColor)} />
                      <div>
                        <div className="font-medium text-slate-900">{book.title}</div>
                        <div className="text-xs text-slate-500">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{book.category}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={book.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{book.isbn}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing 5 of 12,450 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MembersView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Library Members</h2>
        <p className="text-slate-500">Manage member accounts, view history, and handle dues.</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
        <Plus className="w-4 h-4" />
        Register Member
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_MEMBERS.map((member) => (
        <div key={member.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600">
              {member.name.charAt(0)}
            </div>
            <StatusBadge status={member.status} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
          <p className="text-sm text-slate-500 mb-4">{member.email}</p>
          
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Joined</p>
              <p className="text-sm font-medium text-slate-700">{member.joined}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Active Loans</p>
              <p className="text-sm font-medium text-slate-700">{member.activeLoans}</p>
            </div>
          </div>

          <button className="w-full mt-2 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
            View Profile
          </button>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Layout ---

export default function LibrarySystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'books': return <BooksView />;
      case 'members': return <MembersView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Head>
        <title>LibManage Pro | Reception Desk</title>
      </Head>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">LibManage</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Logo Area */}
            <div className="hidden lg:flex items-center gap-3 px-6 py-6 border-b border-slate-100">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">LibManage</span>
            </div>

            {/* Nav Links */}
            <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Main</div>
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Dashboard" 
                active={activeTab === 'dashboard'} 
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              />
              <SidebarItem 
                icon={Book} 
                label="Books Inventory" 
                active={activeTab === 'books'} 
                onClick={() => { setActiveTab('books'); setIsMobileMenuOpen(false); }}
              />
              <SidebarItem 
                icon={Users} 
                label="Members" 
                active={activeTab === 'members'} 
                onClick={() => { setActiveTab('members'); setIsMobileMenuOpen(false); }}
              />
              
              <div className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">System</div>
              <SidebarItem icon={Clock} label="History Logs" active={false} onClick={() => {}} />
              <SidebarItem icon={AlertCircle} label="Fines & Dues" active={false} onClick={() => {}} />
            </div>

            {/* User Profile Snippet */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">Jane Doe</p>
                  <p className="text-xs text-slate-500 truncate">Head Librarian</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {/* Top Header */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-800 capitalize">
                {activeTab === 'dashboard' ? 'Overview' : activeTab}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Global search..." 
                  className="pl-10 pr-4 py-2 text-sm bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-full w-64 transition-all outline-none"
                />
              </div>
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}