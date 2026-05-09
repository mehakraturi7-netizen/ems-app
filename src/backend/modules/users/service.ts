import { supabaseAdmin } from '../../db/supabase';
import { EmployeeProfile, UpdateEmployeeData } from './types';

/**
 * Service for managing employee records.
 * This module interacts with the Supabase database using the service role for admin tasks.
 */
export const UserService = {
  /**
   * Fetch all employees (Admin only logic)
   */
  async getAllEmployees(): Promise<EmployeeProfile[]> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'user')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    return data as EmployeeProfile[];
  },

  /**
   * Search employees by name, email, or ID
   */
  async searchEmployees(query: string): Promise<EmployeeProfile[]> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'user')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,employee_id.ilike.%${query}%`)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error searching employees:', error);
      throw error;
    }

    return data as EmployeeProfile[];
  },

  /**
   * Get a single employee by ID
   */
  async getEmployeeById(id: string): Promise<EmployeeProfile | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching employee ${id}:`, error);
      return null;
    }

    return data as EmployeeProfile;
  },

  /**
   * Update an employee's record
   */
  async updateEmployee(id: string, updates: UpdateEmployeeData): Promise<EmployeeProfile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw error;
    }

    return data as EmployeeProfile;
  },

  /**
   * Delete an employee (Deletes from auth and profile)
   */
  async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
};
