import React from 'react';
import { WorkerNode } from '../types';
import { Server, Cpu, Zap, Activity } from 'lucide-react';

interface ClusterViewProps {
  nodes: WorkerNode[];
}

export const ClusterView: React.FC<ClusterViewProps> = ({ nodes }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Cluster Topology</h2>
          <p className="text-slate-400">Manage worker nodes and resource distribution.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-500 block">Total Cores</span>
              <span className="text-lg font-bold text-white">128 vCPU</span>
           </div>
           <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-500 block">Memory Pool</span>
              <span className="text-lg font-bold text-white">512 GB</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`relative bg-slate-800 rounded-xl p-5 border transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 group ${
              node.status === 'ONLINE'
                ? 'border-slate-700 hover:border-indigo-500/50'
                : node.status === 'BUSY'
                ? 'border-amber-500/30'
                : 'border-red-500/30 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                    node.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500' :
                    node.status === 'BUSY' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                }`}>
                    <Server size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{node.name}</h3>
                  <span className={`text-xs font-medium ${
                      node.status === 'ONLINE' ? 'text-emerald-400' :
                      node.status === 'BUSY' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                      {node.status}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-mono">{node.id}</div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1"><Cpu size={12}/> CPU</span>
                  <span className="text-white">{node.cpuUsage}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        node.cpuUsage > 80 ? 'bg-red-500' : node.cpuUsage > 50 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${node.cpuUsage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1"><Zap size={12}/> MEM</span>
                  <span className="text-white">{node.memoryUsage}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${node.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Activity size={12} /> Active Jobs
                </span>
                <span className="text-sm font-bold text-white">{node.activeJobs}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};