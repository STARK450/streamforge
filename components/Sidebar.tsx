import React from 'react';
import { LayoutDashboard, Network, Play, Server, Activity } from 'lucide-react';
import { ViewState, NavItem } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const navItems: NavItem[] = [
  { id: ViewState.DASHBOARD, label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: ViewState.JOBS, label: 'Active Jobs', icon: <Play size={20} /> },
  { id: ViewState.CLUSTER, label: 'Cluster Status', icon: <Server size={20} /> },
  { id: ViewState.CREATE_JOB, label: 'New Pipeline', icon: <Network size={20} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Activity className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          StreamForge
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-indigo-600/10 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={currentView === item.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 border border-slate-700/50">
          <p className="font-semibold text-slate-300 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Services Operational</span>
          </div>
          <p className="mt-2 text-slate-500">v2.4.0-stable</p>
        </div>
      </div>
    </div>
  );
};