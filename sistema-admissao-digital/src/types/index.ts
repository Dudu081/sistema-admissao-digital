export interface User {
  id: string;
  name: string;
  email: string;
  sector: string;
  role: 'admin' | 'sector_user';
  createdAt: Date;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  sector: string;
  required: boolean;
  order: number;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'date' | 'file' | 'select' | 'checkbox' | 'signature';
  label: string;
  required: boolean;
  options?: string[];
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  fields: FormField[];
  createdAt: Date;
  createdBy: string;
}

export interface SectorForm {
  id: string;
  candidateFormId: string;
  sectorId: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  createdBy: string;
}

export interface SectorFormResponse {
  id: string;
  sectorFormId: string;
  candidateId: string;
  responses: Record<string, any>;
  filledBy: string;
  filledAt: Date;
}

export interface FormResponse {
  fieldId: string;
  value: string | string[] | boolean;
}

export interface AdmissionStep {
  stepId: string;
  stepName: string;
  sector: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  order: number;
}

export interface Admission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  position: string;
  department: string;
  templateId: string;
  templateName: string;
  formResponses: FormResponse[];
  steps: AdmissionStep[];
  currentStepIndex: number;
  status: 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
  lastActivity: Date;
}

export interface JobPosting {
  id: string;
  title: string;
  position: string;
  department: string;
  location: string;
  role: string;
  education: string;
  description: string;
  required: string;
  desired: string;
  salary: string;
  quantity: number;
  expirationDate: Date;
  attachment?: string;
  status: 'active' | 'expired';
  createdAt: Date;
}

export interface Candidate {
  id: string;
  fullName: string;
  birthDate: Date;
  phone: string;
  email: string;
  jobPostingId: string;
  jobTitle: string;
  resume?: string;
  createdAt: Date;
}

export interface AccessProfile {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
}

export type ActiveView = 'dashboard' | 'workflow' | 'forms' | 'admissions' | 'sectors' | 'users' | 'access-profiles' | 'reports' | 'jobs' | 'candidates';