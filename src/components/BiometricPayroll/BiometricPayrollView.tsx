import React, { useState } from 'react';
import {
  Fingerprint,
  Users,
  DollarSign,
  Plus,
  Upload,
  Printer,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { Employee, AttendanceRecord, PayrollRecord } from '../../types';
import { StorageService } from '../../services/storage';

interface BiometricPayrollViewProps {
  onRefresh: () => void;
  onOpenPrint?: (docType: 'payslip', data: any) => void;
}

export const BiometricPayrollView: React.FC<BiometricPayrollViewProps> = ({
  onRefresh,
  onOpenPrint
}) => {
  const [subTab, setSubTab] = useState<'attendance' | 'payroll' | 'employees'>('attendance');
  const employees = StorageService.getEmployees();
  const attendanceLogs = StorageService.getAttendance();
  const payrollRecords = StorageService.getPayroll();

  const [punchEmpId, setPunchEmpId] = useState(employees[0]?.id || '');
  const [punchType, setPunchType] = useState<'Check-In' | 'Check-Out'>('Check-In');
  const [punchTime, setPunchTime] = useState('08:00');
  const [punchDate, setPunchDate] = useState(new Date().toISOString().split('T')[0]);

  const [payrollMonth, setPayrollMonth] = useState('2026-11');

  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    name: '',
    role: 'Lighting Technician',
    phone: '',
    nationalId: '',
    salaryType: 'Monthly',
    basicSalary: 60000,
    otRatePerHour: 450,
    epfEligible: true,
    fingerprintId: 105,
    active: true
  });

  const handleSimulatePunch = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === punchEmpId);
    if (!emp) return;

    const existing = attendanceLogs.find(a => a.empId === emp.id && a.date === punchDate);

    if (punchType === 'Check-In') {
      if (existing) {
        alert(`${emp.name} already checked in on ${punchDate} at ${existing.checkIn}.`);
        return;
      }
      const [h, m] = punchTime.split(':').map(Number);
      const lateMins = Math.max(0, (h * 60 + m) - (8 * 60));

      const record: AttendanceRecord = {
        id: `att-${Date.now()}`,
        empId: emp.id,
        date: punchDate,
        checkIn: punchTime,
        totalHours: 0,
        normalHours: 0,
        otHours: 0,
        lateMinutes: lateMins,
        status: lateMins > 60 ? 'Half-Day' : 'Present',
        terminalSource: 'Biometric Terminal'
      };
      StorageService.logBiometricPunch(record);
    } else {
      if (!existing) {
        alert(`No check-in record found for ${emp.name} on ${punchDate}. Please check in first.`);
        return;
      }

      const [inH, inM] = existing.checkIn.split(':').map(Number);
      const [outH, outM] = punchTime.split(':').map(Number);
      const diffMinutes = Math.max(0, (outH * 60 + outM) - (inH * 60 + inM));
      const totalHours = Number((diffMinutes / 60).toFixed(1));
      const normalHours = Math.min(8, totalHours);
      const otHours = Math.max(0, Number((totalHours - 8).toFixed(1)));

      const updated: AttendanceRecord = {
        ...existing,
        checkOut: punchTime,
        totalHours,
        normalHours,
        otHours
      };

      const all = attendanceLogs.map(a => a.id === existing.id ? updated : a);
      StorageService.saveAttendance(all);
    }

    onRefresh();
    alert(`Biometric Fingerprint Verified: ${emp.name} [ID: ${emp.fingerprintId}] - ${punchType} at ${punchTime}`);
  };

  const handleGenerateMonthlyPayroll = () => {
    const records: PayrollRecord[] = [];

    employees.forEach(emp => {
      const empLogs = attendanceLogs.filter(a => a.empId === emp.id && a.date.startsWith(payrollMonth));
      const daysWorked = empLogs.filter(a => a.status === 'Present' || a.status === 'Half-Day').length || 24;
      const totalOtHours = empLogs.reduce((sum, a) => sum + (a.otHours || 0), 0) || 12;

      const basicSalary = emp.salaryType === 'Monthly' ? emp.basicSalary : emp.basicSalary * daysWorked;
      const otEarnings = Math.round(totalOtHours * emp.otRatePerHour);
      const siteAllowances = 7500;
      const grossSalary = basicSalary + otEarnings + siteAllowances;

      const epfEmployee8 = emp.epfEligible ? Math.round(basicSalary * 0.08) : 0;
      const advanceDeductions = 5000;
      const lateDeductions = 0;
      const totalDeductions = epfEmployee8 + advanceDeductions + lateDeductions;
      const netSalary = grossSalary - totalDeductions;

      const epfEmployer12 = emp.epfEligible ? Math.round(basicSalary * 0.12) : 0;
      const etfEmployer3 = emp.epfEligible ? Math.round(basicSalary * 0.03) : 0;

      records.push({
        id: `pr-${emp.id}-${payrollMonth}`,
        payrollMonth,
        empId: emp.id,
        empName: emp.name,
        role: emp.role,
        salaryType: emp.salaryType,
        basicSalary,
        daysWorked,
        otHours: totalOtHours,
        otEarnings,
        siteAllowances,
        grossSalary,
        epfEmployee8,
        advanceDeductions,
        lateDeductions,
        totalDeductions,
        netSalary,
        epfEmployer12,
        etfEmployer3,
        paymentStatus: 'Pending'
      });
    });

    StorageService.savePayroll(records);
    onRefresh();
    alert(`Automated Payroll Generated for ${payrollMonth}: ${records.length} employee payslips computed.`);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.phone) return;

    const empNum = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const created: Employee = {
      id: `emp-${Date.now()}`,
      empNo: empNum,
      name: newEmp.name || '',
      role: newEmp.role as any,
      phone: newEmp.phone || '',
      nationalId: newEmp.nationalId || '',
      salaryType: newEmp.salaryType as any,
      basicSalary: Number(newEmp.basicSalary) || 0,
      otRatePerHour: Number(newEmp.otRatePerHour) || 0,
      epfEligible: !!newEmp.epfEligible,
      fingerprintId: Number(newEmp.fingerprintId) || 100 + employees.length + 1,
      active: true
    };

    const current = StorageService.getEmployees();
    current.push(created);
    StorageService.saveEmployees(current);
    setIsAddEmpModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">Biometric Attendance & Automated Payroll</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Biometric terminal check-ins, overtime tracking, and automated monthly salary calculations with EPF/ETF contributions
          </p>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('attendance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              subTab === 'attendance'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Attendance Terminal</span>
          </button>
          <button
            onClick={() => setSubTab('payroll')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              subTab === 'payroll'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Automated Payroll Run</span>
          </button>
          <button
            onClick={() => setSubTab('employees')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              subTab === 'employees'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Roster ({employees.length})</span>
          </button>
        </div>
      </div>

      {/* Attendance & Biometric Terminal Sub-tab */}
      {subTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Biometric Terminal Live Simulator */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Biometric Terminal Sync</h3>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Hardware Port: Online</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSimulatePunch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Select Employee (Fingerprint ID)
                </label>
                <select
                  value={punchEmpId}
                  onChange={(e) => setPunchEmpId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.name} [ID #{e.fingerprintId}] — {e.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Punch Date</label>
                  <input
                    type="date"
                    value={punchDate}
                    onChange={(e) => setPunchDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Terminal Time (HH:MM)</label>
                  <input
                    type="time"
                    value={punchTime}
                    onChange={(e) => setPunchTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Punch Event</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPunchType('Check-In')}
                    className={`py-2 rounded-lg font-bold border transition ${
                      punchType === 'Check-In'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Check-In (In-Time)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPunchType('Check-Out')}
                    className={`py-2 rounded-lg font-bold border transition ${
                      punchType === 'Check-Out'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Check-Out (Out-Time)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Simulate Fingerprint Scan</span>
              </button>
            </form>
          </div>

          {/* Attendance Daily Logs Table */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Attendance Punch Register</h3>
              <span className="text-xs text-slate-400">{attendanceLogs.length} total entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3 text-center">In</th>
                    <th className="py-2.5 px-3 text-center">Out</th>
                    <th className="py-2.5 px-3 text-center">Total Hrs</th>
                    <th className="py-2.5 px-3 text-center">OT Hrs</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {attendanceLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">
                        No biometric attendance punches recorded. Use the Quick Clock-in panel on the left to record punches.
                      </td>
                    </tr>
                  ) : (
                    attendanceLogs.map((log) => {
                      const emp = employees.find(e => e.id === log.empId);
                      return (
                        <tr key={log.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono text-slate-300">{log.date}</td>
                          <td className="py-2.5 px-3 font-medium text-white">
                            <div>{emp?.name || 'Unknown'}</div>
                            <div className="text-[10px] text-slate-400">{emp?.role}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-emerald-400">{log.checkIn}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-amber-400">{log.checkOut || '--:--'}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-200">{log.totalHours}h</td>
                          <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                            {log.otHours > 0 ? `+${log.otHours}h` : '0h'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Automated Payroll Run Sub-tab */}
      {subTab === 'payroll' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 font-semibold">Select Payroll Month:</span>
              <input
                type="month"
                value={payrollMonth}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>

            <button
              onClick={handleGenerateMonthlyPayroll}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2 shadow"
            >
              <DollarSign className="w-4 h-4" />
              <span>Generate Automated Salary Calculation</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3 text-right">Basic Salary</th>
                  <th className="py-3 px-3 text-center">OT Hours</th>
                  <th className="py-3 px-3 text-right">OT Pay</th>
                  <th className="py-3 px-3 text-right">Allowances</th>
                  <th className="py-3 px-3 text-right">EPF (8%)</th>
                  <th className="py-3 px-3 text-right">Net Salary</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payrollRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-500">
                      No payroll run calculated yet for {payrollMonth}. Click "Generate Automated Salary Calculation" above.
                    </td>
                  </tr>
                ) : (
                  payrollRecords.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-bold text-white">{p.empName}</td>
                      <td className="py-3 px-3 text-slate-400">{p.role}</td>
                      <td className="py-3 px-3 text-right">Rs. {p.basicSalary.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center text-amber-400 font-bold">{p.otHours}h</td>
                      <td className="py-3 px-3 text-right text-amber-400">Rs. {p.otEarnings.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-slate-300">Rs. {p.siteAllowances.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-rose-400 font-mono">
                        -Rs. {p.epfEmployee8.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-emerald-400 text-sm">
                        Rs. {p.netSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {onOpenPrint && (
                          <button
                            onClick={() => onOpenPrint('payslip', p)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-xs transition flex items-center gap-1 mx-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Payslip</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Roster Sub-tab */}
      {subTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base">Employee & Technician Profiles</h3>
            <button
              onClick={() => setIsAddEmpModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-amber-400 font-bold">{emp.empNo}</span>
                    <h4 className="font-bold text-white text-sm">{emp.name}</h4>
                  </div>
                  <div className="text-xs text-slate-300 mt-2 space-y-0.5">
                    <div>Role: <strong className="text-slate-100">{emp.role}</strong></div>
                    <div>Phone: {emp.phone} • NIC: {emp.nationalId}</div>
                    <div className="text-amber-400 font-semibold">
                      Basic Pay: Rs. {emp.basicSalary.toLocaleString()} ({emp.salaryType}) • OT: Rs. {emp.otRatePerHour}/hr
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>ID #{emp.fingerprintId}</span>
                  </span>
                </div>
              </div>
            ))}

            {employees.length === 0 && (
              <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4">
                  <Users className="w-7 h-7 text-purple-400/70" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Staff Roster is Empty</h3>
                <p className="text-xs text-slate-400 max-w-md mb-6">
                  Add your lighting technicians, electricians, vehicle drivers, and crew helpers to track biometric punches and run monthly EPF/ETF payroll.
                </p>
                <button
                  onClick={() => setIsAddEmpModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register First Employee</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddEmpModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Employee</h3>
              <button onClick={() => setIsAddEmpModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Chathuranga"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role</label>
                  <select
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                  >
                    <option value="Lighting Technician">Lighting Technician</option>
                    <option value="Lead Electrician">Lead Electrician</option>
                    <option value="Site Crew / Helper">Site Crew / Helper</option>
                    <option value="Vehicle Driver">Vehicle Driver</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fingerprint ID #</label>
                  <input
                    type="number"
                    value={newEmp.fingerprintId}
                    onChange={(e) => setNewEmp({ ...newEmp, fingerprintId: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="077 123 4567"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NIC Number</label>
                  <input
                    type="text"
                    placeholder="1995xxxxxx"
                    value={newEmp.nationalId}
                    onChange={(e) => setNewEmp({ ...newEmp, nationalId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Basic Salary (LKR)</label>
                  <input
                    type="number"
                    value={newEmp.basicSalary}
                    onChange={(e) => setNewEmp({ ...newEmp, basicSalary: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">OT Rate / Hour (LKR)</label>
                  <input
                    type="number"
                    value={newEmp.otRatePerHour}
                    onChange={(e) => setNewEmp({ ...newEmp, otRatePerHour: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="epfToggle"
                  checked={newEmp.epfEligible}
                  onChange={(e) => setNewEmp({ ...newEmp, epfEligible: e.target.checked })}
                  className="rounded text-amber-500"
                />
                <label htmlFor="epfToggle" className="text-slate-300">
                  Eligible for EPF (8% Employee / 12% Employer) & ETF (3%)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEmpModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-slate-950 bg-amber-500 font-bold"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
