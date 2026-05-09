import React from 'react';
import { UserService } from '../../backend/modules/users/service';
import { Users, ShieldCheck } from 'lucide-react';
import EmployeeTable from '../../components/EmployeeTable';

export default async function DashboardPage() {
  const employees = await UserService.getAllEmployees();

  const stats = [
    { name: 'Total Employees', value: employees.length, icon: Users, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Employee Management System</h1>
          <p className="text-gray-400 mt-1">Manage employee information, track status, and maintain records.</p>
        </div>
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-widest shadow-xl shadow-purple-500/5">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Portal Active</span>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Staff</p>
              <p className="text-3xl font-bold text-white mt-1">{employees.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Employee Management Interface */}
      <div className="pt-4">
        <EmployeeTable initialEmployees={employees} />
      </div>
    </div>
  );
}
