import React from 'react';

export enum JobStatus {
  RUNNING = 'RUNNING',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Job {
  id: string;
  name: string;
  sourceType: 'KAFKA' | 'REST' | 'CSV';
  sinkType: 'MONGODB' | 'REDIS' | 'S3';
  status: JobStatus;
  throughput: number; // events per second
  errors: number;
  startTime: string;
  transformationCode?: string;
}

export interface WorkerNode {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  cpuUsage: number;
  memoryUsage: number;
  activeJobs: number;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  JOBS = 'JOBS',
  CLUSTER = 'CLUSTER',
  CREATE_JOB = 'CREATE_JOB',
}

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}