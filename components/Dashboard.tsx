import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Job, MetricPoint, JobStatus } from '../types';
import { Zap, AlertTriangle, CheckCircle, Activity, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  jobs: Job[];
  throughputData: MetricPoint[];
}

export const Dashboard: React.FC<DashboardProps> = ({ jobs, throughputData }) => {
  const totalThroughput = jobs.reduce((acc, job) => acc + job.throughput, 0);
  const activeJobs = jobs.filter((j) => j.status === JobStatus.RUNNING).length;
  const errorRate = jobs.length > 0 ? (jobs.reduce((acc, j) => acc + j.errors, 0) / jobs.length).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Throughput"
          value={`${(totalThroughput / 1000).toFixed(1)}k`}
          unit="msg/sec"
          icon={<Zap className="text-yellow-400" size={24} />}
          trend="+12.5%"
          color="yellow"
        />
        <StatCard
          title="Active Pipelines"
          value={activeJobs.toString()}
          unit="running"
          icon={<Activity className="text-emerald-400" size={24} />}
          trend="+2"
          color="emerald"
        />
        <StatCard
          title="System Latency"
          value="45"
          unit="ms"
          icon={<ArrowUpRight className="text-indigo-400" size={24} />}
          trend="-5ms"
          color="indigo"
        />
        <StatCard
          title="Error Rate"
          value={errorRate.toString()}
          unit="avg/hr"
          icon={<AlertTriangle className="text-rose-400" size={24} />}
          trend="Stable"
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Real-time Throughput (Global)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#475569" fontSize={12} tickFormatter={(val) => `${val} eps`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorThroughput)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Job Distribution</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'KAFKA', value: jobs.filter((j) => j.sourceType === 'KAFKA').length },
                  { name: 'REST', value: jobs.filter((j) => j.sourceType === 'REST').length },
                  { name: 'CSV', value: jobs.filter((j) => j.sourceType === 'CSV').length },
                ]}
              >
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Processed Events</span>
                <span className="text-white font-mono">1.2B</span>
            </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Avg. Processing Time</span>
                <span className="text-white font-mono">23ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Recent Job Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Job Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Source -> Sink</th>
                <th className="px-6 py-4 font-medium">Throughput</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {jobs.slice(0, 5).map((job) => (
                <tr key={job.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{job.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === JobStatus.RUNNING
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : job.status === JobStatus.FAILED
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {job.sourceType} <span className="text-slate-600 mx-1">→</span> {job.sinkType}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                    {job.throughput.toLocaleString()} eps
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Stats
const StatCard = ({ title, value, unit, icon, trend, color }: any) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex items-start justify-between shadow-lg hover:shadow-xl transition-shadow">
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-white">{value}</h4>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
      <p className={`text-xs mt-2 font-medium ${
          trend.includes('+') ? 'text-emerald-400' : trend === 'Stable' ? 'text-blue-400' : 'text-rose-400'
      }`}>
        {trend} from last hour
      </p>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>{icon}</div>
  </div>
);
