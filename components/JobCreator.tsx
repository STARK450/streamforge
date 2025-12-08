import React, { useState } from 'react';
import { generateTransformationCode } from '../services/geminiService';
import { Wand2, Save, PlayCircle, Loader2, Code, Database, ArrowRight } from 'lucide-react';
import { Job, JobStatus } from '../types';

interface JobCreatorProps {
  onJobCreate: (job: Job) => void;
}

export const JobCreator: React.FC<JobCreatorProps> = ({ onJobCreate }) => {
  const [step, setStep] = useState(1);
  const [jobName, setJobName] = useState('');
  const [sourceType, setSourceType] = useState<'KAFKA' | 'REST' | 'CSV'>('KAFKA');
  const [sinkType, setSinkType] = useState<'MONGODB' | 'REDIS' | 'S3'>('MONGODB');
  const [transformPrompt, setTransformPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCode = async () => {
    if (!transformPrompt) return;
    setIsGenerating(true);
    const code = await generateTransformationCode(transformPrompt);
    setGeneratedCode(code);
    setIsGenerating(false);
  };

  const handleSubmit = () => {
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      name: jobName || 'Untitled Job',
      sourceType,
      sinkType,
      status: JobStatus.RUNNING,
      throughput: 0,
      errors: 0,
      startTime: new Date().toISOString(),
      transformationCode: generatedCode,
    };
    onJobCreate(newJob);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Pipeline</h2>
        <p className="text-slate-400">Configure a new distributed data processing job.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Steps Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`p-4 rounded-xl border transition-all ${
                step === s
                  ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step === s ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {s}
                </div>
                <span className="font-medium">
                  {s === 1 ? 'Configuration' : s === 2 ? 'Transformation' : 'Review & Deploy'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Job Name</label>
                <input
                  type="text"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="e.g. UserActivityStream"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Source</label>
                  <div className="relative">
                    <Database className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <select
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      <option value="KAFKA">Apache Kafka</option>
                      <option value="REST">REST Endpoint</option>
                      <option value="CSV">CSV File Watcher</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Sink</label>
                  <div className="relative">
                    <Save className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <select
                      value={sinkType}
                      onChange={(e) => setSinkType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      <option value="MONGODB">MongoDB</option>
                      <option value="REDIS">Redis</option>
                      <option value="S3">Amazon S3</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">AI Transformation Assistant</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={transformPrompt}
                    onChange={(e) => setTransformPrompt(e.target.value)}
                    placeholder="Describe logic (e.g. 'Filter users under 18 and mask emails')"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    onClick={handleGenerateCode}
                    disabled={isGenerating || !transformPrompt}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                    Generate
                  </button>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute top-0 right-0 p-2 bg-slate-800 rounded-bl-lg border-l border-b border-slate-700">
                  <span className="text-xs text-slate-400 font-mono">Java Strategy</span>
                </div>
                <textarea
                  value={generatedCode}
                  onChange={(e) => setGeneratedCode(e.target.value)}
                  placeholder="// Generated Java code will appear here..."
                  className="w-full h-64 bg-slate-950 font-mono text-sm text-emerald-400 p-4 rounded-lg border border-slate-700 focus:ring-2 focus:ring-emerald-900/50 outline-none resize-none"
                  spellCheck={false}
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!generatedCode}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 space-y-4">
                <h3 className="text-lg font-semibold text-white">Pipeline Summary</h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="block text-slate-500">Job Name</span>
                    <span className="text-white font-medium">{jobName || 'Untitled'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Source</span>
                    <span className="text-indigo-400 font-medium">{sourceType}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Sink</span>
                    <span className="text-emerald-400 font-medium">{sinkType}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Logic Size</span>
                    <span className="text-white font-medium">{generatedCode.length} bytes</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                  <span className="block text-slate-500 mb-2">Transformation Logic</span>
                  <pre className="bg-slate-950 p-3 rounded text-xs text-slate-400 font-mono overflow-x-auto max-h-32">
                    {generatedCode}
                  </pre>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                 <button
                  onClick={() => setStep(2)}
                  className="text-slate-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                  <PlayCircle size={20} />
                  Deploy Pipeline
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};