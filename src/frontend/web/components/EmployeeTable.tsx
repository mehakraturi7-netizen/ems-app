'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Edit2, Trash2, User, Plus, Download } from 'lucide-react';
import { EmployeeProfile } from '../backend/modules/users/types';
import { createClient } from '../lib/supabase';
import EmployeeModal from './EmployeeModal';

interface EmployeeTableProps {
  initialEmployees: EmployeeProfile[];
}

export default function EmployeeTable({ initialEmployees }: EmployeeTableProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeProfile | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUserId(data.user.id);
    });
  }, []);

  const fetchEmployees = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'user')
      .order('full_name', { ascending: true });
    if (data) setEmployees(data);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) alert(error.message);
      else {
        fetchEmployees();
        router.refresh();
      }
    }
  };

  const openEditModal = (emp: EmployeeProfile) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.id !== currentUserId) && (
      emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToCSV = () => {
    const headers = ['Employee ID,Full Name,Email,Department,Designation,Status,Joining Date\n'];
    const rows = employees.map(emp => 
      `"${emp.employee_id || ''}","${emp.full_name || ''}","${emp.email || ''}","${emp.department || ''}","${emp.designation || ''}","${emp.status || ''}","${emp.joining_date || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `ems_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
        <div className="relative w-full xl:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>
        <div className="flex items-center space-x-3 w-full xl:w-auto">
          <button 
            onClick={exportToCSV}
            className="flex-1 xl:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all"
            title="Download CSV Report"
          >
            <Download className="w-5 h-5 text-blue-400" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={openAddModal}
            className="flex-1 xl:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-5 h-5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center font-bold text-gray-300">
                        {emp.full_name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{emp.full_name || 'Unnamed'}</div>
                        <div className="text-xs text-gray-500">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{emp.employee_id || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{emp.department || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                      emp.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                      emp.status === 'on-leave' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      {emp.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => openEditModal(emp)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && (
            <div className="p-12 text-center">
              <User className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-20" />
              <p className="text-gray-500 font-light">No records found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <EmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchEmployees}
        employee={editingEmployee}
      />
    </div>
  );
}
