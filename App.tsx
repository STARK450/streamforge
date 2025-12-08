import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { JobCreator } from './components/JobCreator';
import { ClusterView } from './components/ClusterView';
import { ViewState, Job, JobStatus, WorkerNode, MetricPoint } from './types';
import { analyzeErrorLog } from './services/geminiService';
import { XCircle, FileText, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // -- Simulated State --
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', name: 'User-Clickstream-ETL', sourceType: 'KAFKA', sinkType: 'S3', status: JobStatus.RUNNING, throughput: 4500, errors: 0, startTime: '2023-10-27T10:00:00Z' },
    { id: '2', name: 'Inventory-Sync-Batch', sourceType: 'REST', sinkType: 'REDIS', status: JobStatus.COMPLETED, throughput: 0, errors: 0, startTime: '2023-10-27T08:00:00Z' },
    { id: '3', name: 'Payment-Fraud-Detection', sourceType: 'KAFKA', sinkType: 'MONGODB', status: JobStatus.FAILED, throughput: 0, errors: 12, startTime: '2023-10-27T09:30:00Z' },
  ]);

  const [nodes, setNodes] = useState<WorkerNode[]>([
    { id: 'worker-01', name: 'Node Alpha', status: 'ONLINE', cpuUsage: 45, memoryUsage: 60, activeJobs: 2 },
    { id: 'worker-02', name: 'Node Beta', status: 'ONLINE', cpuUsage: 78, memoryUsage: 82, activeJobs: 3 },
    { id: 'worker-03', name: 'Node Gamma', status: 'BUSY', cpuUsage: 92, memoryUsage: 88, activeJobs: 4 },
    { id: 'worker-04', name: 'Node Delta', status: 'OFFLINE', cpuUsage: 0, memoryUsage: 0, activeJobs: 0 },
  ]);

  const [throughputData, setThroughputData] = useState<MetricPoint[]>([]);
  
  // AI Analysis State
  const [selectedFailedJob, setSelectedFailedJob] = useState<Job | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  // -- Simulation Effects --
  useEffect(() => {
    // Simulate real-time throughput data
    const interval = setInterval(() => {
      setThroughputData(prev => {
        const now = new Date();
        const newPoint = {
          timestamp: now.toLocaleTimeString(),
          value: Math.floor(4000 + Math.random() * 2000), // Random between 4k and 6k
        };
        const newData = [...prev, newPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });

      // Simulate cpu fluctuation
      setNodes(prev => prev.map(n => n.status !== 'OFFLINE' ? ({
          ...n,
          cpuUsage: Math.min(100, Math.max(0, n.cpuUsage + (Math.random() * 10 - 5)))
      }) : n));
      
      // Simulate job throughput fluctuation
      setJobs(prev => prev.map(j => j.status === JobStatus.RUNNING ? ({
          ...j,
          throughput: Math.max(0, j.throughput + Math.floor(Math.random() * 500 - 250))
      }) : j));

    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleJobCreate = (job: Job) => {
    setJobs([job, ...jobs]);
    setCurrentView(ViewState.JOBS);
  };

  const handleAnalyzeError = async (job: Job) => {
    setSelectedFailedJob(job);
    setAnalyzing(true);
    // Simulate retrieving a log from backend
    const mockLog = `
    [ERROR] 2023-10-27 09:35:12.453 [Worker-3] ProcessingEngine - NullPointerException at com.streamforge.plugins.Transform.apply(Transform.java:42)
    Caused by: java.lang.NullPointerException: Cannot invoke "String.length()" because "userId" is null
    at com.streamforge.custom.FraudCheck.process(FraudCheck.java:15)
    ... 12 more
    `;
    const result = await analyzeErrorLog(job.name, mockLog);
    setAnalysisResult(result);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {currentView === ViewState.DASHBOARD && 'Dashboard'}
            {currentView === ViewState.JOBS && 'Active Jobs'}
            {currentView === ViewState.CLUSTER && 'Cluster Status'}
            {currentView === ViewState.CREATE_JOB && 'New Job'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/30 border border-indigo-500/30 rounded-full">
               <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
               <span className="text-xs font-medium text-indigo-300">Live Connection</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="font-bold text-slate-400">JD</span>
            </div>
          </div>
        </header>

        {/* Content Router */}
        {currentView === ViewState.DASHBOARD && (
          <Dashboard jobs={jobs} throughputData={throughputData} />
        )}

        {currentView === ViewState.CLUSTER && (
          <ClusterView nodes={nodes} />
        )}

        {currentView === ViewState.CREATE_JOB && (
          <JobCreator onJobCreate={handleJobCreate} />
        )}

        {currentView === ViewState.JOBS && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Job Name</th>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Throughput</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {jobs.map(job => (
                            <tr key={job.id} className="hover:bg-slate-750 transition-colors">
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
                                <td className="px-6 py-4 font-medium text-white">{job.name}</td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">{job.id}</td>
                                <td className="px-6 py-4 font-mono text-slate-300">{job.throughput.toLocaleString()} eps</td>
                                <td className="px-6 py-4">
                                    {job.status === JobStatus.FAILED && (
                                        <button 
                                            onClick={() => handleAnalyzeError(job)}
                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                                        >
                                            <Bot size={16} /> Analyze
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* AI Analysis Modal Overlay */}
            {selectedFailedJob && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative">
                        <button 
                            onClick={() => setSelectedFailedJob(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <XCircle size={24} />
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-rose-500/10 p-3 rounded-lg">
                                <Bot className="text-rose-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Failure Analysis</h3>
                                <p className="text-slate-400 text-sm">Job: {selectedFailedJob.name}</p>
                            </div>
                        </div>

                        {analyzing ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p>Consulting AI Engine...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Root Cause Analysis</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {analysisResult}
                                    </p>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button 
                                        onClick={() => setSelectedFailedJob(null)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;