export type UserRole = 'user' | 'admin';

export interface EmployeeProfile {
  id: string;
  employee_id: string | null;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  department: string | null;
  designation: string | null;
  joining_date: string | null;
  status: 'active' | 'inactive' | 'on-leave';
  avatar_url: string | null;
  updated_at: string;
}

export interface CreateEmployeeData {
  full_name: string;
  email: string;
  role?: UserRole;
  department?: string;
  designation?: string;
}

export interface UpdateEmployeeData {
  full_name?: string;
  department?: string;
  designation?: string;
  role?: UserRole;
  status?: 'active' | 'inactive' | 'on-leave';
  employee_id?: string;
}
