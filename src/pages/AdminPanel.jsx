import React, { useState } from 'react';
import { Users, Calendar, Building, GitBranch, Edit, Trash2, Plus, Save, X, Eye } from 'lucide-react';

// Employee Management Component
const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      manager: 'Jane Smith',
      joinDate: '2023-01-15',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@company.com',
      department: 'Engineering',
      position: 'Team Lead',
      manager: 'Bob Johnson',
      joinDate: '2022-06-10',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@company.com',
      department: 'HR',
      position: 'HR Manager',
      manager: 'Sarah Davis',
      joinDate: '2021-03-20',
      status: 'Active'
    }
  ]);

  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee });
  };

  const handleSaveEmployee = () => {
    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id ? editingEmployee : emp
    ));
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleAddEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      name: '',
      email: '',
      department: '',
      position: '',
      manager: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setEmployees([...employees, newEmployee]);
    setEditingEmployee(newEmployee);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Employee Management</h3>
        <button 
          onClick={handleAddEmployee}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedEmployee(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Edit Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                {editingEmployee.name ? 'Edit Employee' : 'Add Employee'}
              </h4>
              <button onClick={() => setEditingEmployee(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editingEmployee.name}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingEmployee.email}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Department"
                value={editingEmployee.department}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Position"
                value={editingEmployee.position}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Manager"
                value={editingEmployee.manager}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, manager: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <select
                value={editingEmployee.status}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEmployee}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Employee Details</h4>
              <button onClick={() => setSelectedEmployee(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div><strong>Name:</strong> {selectedEmployee.name}</div>
              <div><strong>Email:</strong> {selectedEmployee.email}</div>
              <div><strong>Department:</strong> {selectedEmployee.department}</div>
              <div><strong>Position:</strong> {selectedEmployee.position}</div>
              <div><strong>Manager:</strong> {selectedEmployee.manager}</div>
              <div><strong>Join Date:</strong> {selectedEmployee.joinDate}</div>
              <div><strong>Status:</strong> {selectedEmployee.status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Leave Types Management Component
const LeaveTypeManagement = () => {
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([
    { id: 1, name: 'Annual Leave', days: 21, carryForward: true, description: 'Yearly vacation days' },
    { id: 2, name: 'Sick Leave', days: 10, carryForward: false, description: 'Medical leave' },
    { id: 3, name: 'Maternity Leave', days: 90, carryForward: false, description: 'Maternity leave' },
    { id: 4, name: 'Personal Leave', days: 5, carryForward: false, description: 'Personal time off' }
  ]);

  const handleEditLeaveType = (leaveType) => {
    setEditingLeaveType({ ...leaveType });
  };

  const handleSaveLeaveType = () => {
    if (leaveTypes.find(lt => lt.id === editingLeaveType.id)) {
      setLeaveTypes(leaveTypes.map(lt => 
        lt.id === editingLeaveType.id ? editingLeaveType : lt
      ));
    } else {
      setLeaveTypes([...leaveTypes, { ...editingLeaveType, id: Date.now() }]);
    }
    setEditingLeaveType(null);
  };

  const handleDeleteLeaveType = (id) => {
    setLeaveTypes(leaveTypes.filter(lt => lt.id !== id));
  };

  const handleAddLeaveType = () => {
    const newLeaveType = {
      name: '',
      days: 0,
      carryForward: false,
      description: ''
    };
    setEditingLeaveType(newLeaveType);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Leave Types Management</h3>
        <button
          onClick={handleAddLeaveType}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Leave Type</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaveTypes.map((leaveType) => (
          <div key={leaveType.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800">{leaveType.name}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditLeaveType(leaveType)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteLeaveType(leaveType.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm"><strong>Days:</strong> {leaveType.days}</div>
              <div className="text-sm"><strong>Carry Forward:</strong> {leaveType.carryForward ? 'Yes' : 'No'}</div>
              <div className="text-sm text-gray-600">{leaveType.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Type Edit Modal */}
      {editingLeaveType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                {editingLeaveType.id ? 'Edit Leave Type' : 'Add Leave Type'}
              </h4>
              <button onClick={() => setEditingLeaveType(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Leave Type Name"
                value={editingLeaveType.name}
                onChange={(e) => setEditingLeaveType({ ...editingLeaveType, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Number of Days"
                value={editingLeaveType.days}
                onChange={(e) => setEditingLeaveType({ ...editingLeaveType, days: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={editingLeaveType.description}
                onChange={(e) => setEditingLeaveType({ ...editingLeaveType, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows="3"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingLeaveType.carryForward}
                  onChange={(e) => setEditingLeaveType({ ...editingLeaveType, carryForward: e.target.checked })}
                  className="mr-2"
                />
                Allow Carry Forward
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveLeaveType}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setEditingLeaveType(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Department Management Component
const DepartmentManagement = () => {
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', manager: 'Jane Smith', budget: 500000, employeeCount: 15 },
    { id: 2, name: 'HR', manager: 'Mike Wilson', budget: 200000, employeeCount: 5 },
    { id: 3, name: 'Marketing', manager: 'Sarah Davis', budget: 300000, employeeCount: 8 },
    { id: 4, name: 'Finance', manager: 'Tom Brown', budget: 150000, employeeCount: 4 }
  ]);

  const handleEditDepartment = (department) => {
    setEditingDepartment({ ...department });
  };

  const handleSaveDepartment = () => {
    if (departments.find(dept => dept.id === editingDepartment.id)) {
      setDepartments(departments.map(dept => 
        dept.id === editingDepartment.id ? editingDepartment : dept
      ));
    } else {
      setDepartments([...departments, { ...editingDepartment, id: Date.now() }]);
    }
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (id) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  const handleAddDepartment = () => {
    const newDepartment = {
      name: '',
      manager: '',
      budget: 0,
      employeeCount: 0
    };
    setEditingDepartment(newDepartment);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Department Management</h3>
        <button 
          onClick={handleAddDepartment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800">{dept.name}</h4>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditDepartment(dept)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteDepartment(dept.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm"><strong>Manager:</strong> {dept.manager}</div>
              <div className="text-sm"><strong>Budget:</strong> ${dept.budget.toLocaleString()}</div>
              <div className="text-sm"><strong>Employees:</strong> {dept.employeeCount}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Department Edit Modal */}
      {editingDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                {editingDepartment.id ? 'Edit Department' : 'Add Department'}
              </h4>
              <button onClick={() => setEditingDepartment(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Department Name"
                value={editingDepartment.name}
                onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Manager"
                value={editingDepartment.manager}
                onChange={(e) => setEditingDepartment({ ...editingDepartment, manager: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Budget"
                value={editingDepartment.budget}
                onChange={(e) => setEditingDepartment({ ...editingDepartment, budget: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Employee Count"
                value={editingDepartment.employeeCount}
                onChange={(e) => setEditingDepartment({ ...editingDepartment, employeeCount: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border rounded"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveDepartment}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setEditingDepartment(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Approval Flow Level Component
const ApprovalFlowLevel = ({ level, onEdit, onDelete, onMove }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded mb-2">
      <div className="flex items-center space-x-3">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
          Level {level.level}
        </span>
        <span className="font-medium">{level.approver}</span>
        <span className={`px-2 py-1 text-xs rounded ${level.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
          {level.required ? 'Required' : 'Optional'}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onMove(level.level, 'up')}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ↑
        </button>
        <button
          onClick={() => onMove(level.level, 'down')}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ↓
        </button>
        <button
          onClick={() => onEdit(level)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => onDelete(level.level)}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

// Approval Flow Management Component
const ApprovalFlowManagement = () => {
  const [editingApprovalFlow, setEditingApprovalFlow] = useState(null);
  const [editingLevel, setEditingLevel] = useState(null);
  const [approvalFlows, setApprovalFlows] = useState([
    {
      id: 1,
      name: 'Standard Approval',
      description: 'Standard approval process for regular leave requests',
      levels: [
        { level: 1, approver: 'Direct Manager', required: true },
        { level: 2, approver: 'Department Head', required: false }
      ]
    },
    {
      id: 2,
      name: 'HR Approval',
      description: 'HR approval process for extended leave requests',
      levels: [
        { level: 1, approver: 'Direct Manager', required: true },
        { level: 2, approver: 'HR Manager', required: true },
        { level: 3, approver: 'CEO', required: false }
      ]
    }
  ]);

  const handleEditApprovalFlow = (flow) => {
    setEditingApprovalFlow({ ...flow });
  };

  const handleSaveApprovalFlow = () => {
    if (approvalFlows.find(flow => flow.id === editingApprovalFlow.id)) {
      setApprovalFlows(approvalFlows.map(flow => 
        flow.id === editingApprovalFlow.id ? editingApprovalFlow : flow
      ));
    } else {
      setApprovalFlows([...approvalFlows, { ...editingApprovalFlow, id: Date.now() }]);
    }
    setEditingApprovalFlow(null);
  };

  const handleDeleteApprovalFlow = (id) => {
    setApprovalFlows(approvalFlows.filter(flow => flow.id !== id));
  };

  const handleAddApprovalFlow = () => {
    const newFlow = {
      name: '',
      description: '',
      levels: [{ level: 1, approver: '', required: true }]
    };
    setEditingApprovalFlow(newFlow);
  };

  const handleEditLevel = (level) => {
    setEditingLevel({ ...level });
  };

  const handleSaveLevel = () => {
    const updatedLevels = editingApprovalFlow.levels.map(level =>
      level.level === editingLevel.level ? editingLevel : level
    );
    setEditingApprovalFlow({ ...editingApprovalFlow, levels: updatedLevels });
    setEditingLevel(null);
  };

  const handleDeleteLevel = (levelNum) => {
    const updatedLevels = editingApprovalFlow.levels
      .filter(level => level.level !== levelNum)
      .map((level, index) => ({ ...level, level: index + 1 }));
    setEditingApprovalFlow({ ...editingApprovalFlow, levels: updatedLevels });
  };

  const handleAddLevel = () => {
    const newLevel = {
      level: editingApprovalFlow.levels.length + 1,
      approver: '',
      required: false
    };
    setEditingApprovalFlow({
      ...editingApprovalFlow,
      levels: [...editingApprovalFlow.levels, newLevel]
    });
  };

  const handleMoveLevel = (levelNum, direction) => {
    const levels = [...editingApprovalFlow.levels];
    const currentIndex = levels.findIndex(l => l.level === levelNum);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < levels.length) {
      [levels[currentIndex], levels[targetIndex]] = [levels[targetIndex], levels[currentIndex]];
      // Update level numbers
      levels.forEach((level, index) => {
        level.level = index + 1;
      });
      setEditingApprovalFlow({ ...editingApprovalFlow, levels });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Approval Flow Management</h3>
        <button 
          onClick={handleAddApprovalFlow}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Flow</span>
        </button>
      </div>

      <div className="space-y-4">
        {approvalFlows.map((flow) => (
          <div key={flow.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{flow.name}</h4>
                <p className="text-sm text-gray-600">{flow.description}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditApprovalFlow(flow)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteApprovalFlow(flow.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Approval Levels:</h5>
              {flow.levels.map((level) => (
                <div key={level.level} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <span className="font-medium">Level {level.level}:</span> {level.approver}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${level.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {level.required ? 'Required' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Approval Flow Edit Modal */}
      {editingApprovalFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                {editingApprovalFlow.id ? 'Edit Approval Flow' : 'Add Approval Flow'}
              </h4>
              <button onClick={() => setEditingApprovalFlow(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Flow Name"
                value={editingApprovalFlow.name}
                onChange={(e) => setEditingApprovalFlow({ ...editingApprovalFlow, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={editingApprovalFlow.description}
                onChange={(e) => setEditingApprovalFlow({ ...editingApprovalFlow, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows="2"
              />
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-700">Approval Levels:</h5>
                  <button
                    onClick={handleAddLevel}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                  >
                    <Plus size={14} />
                    <span>Add Level</span>
                  </button>
                </div>
                
                {editingApprovalFlow.levels.map((level) => (
                  <ApprovalFlowLevel
                    key={level.level}
                    level={level}
                    onEdit={handleEditLevel}
                    onDelete={handleDeleteLevel}
                    onMove={handleMoveLevel}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveApprovalFlow}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save Flow</span>
                </button>
                <button
                  onClick={() => setEditingApprovalFlow(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Edit Modal */}
      {editingLevel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Edit Approval Level</h4>
              <button onClick={() => setEditingLevel(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level Number</label>
                <input
                  type="number"
                  value={editingLevel.level}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approver</label>
                <input
                  type="text"
                  placeholder="Approver Role/Name"
                  value={editingLevel.approver}
                  onChange={(e) => setEditingLevel({ ...editingLevel, approver: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingLevel.required}
                  onChange={(e) => setEditingLevel({ ...editingLevel, required: e.target.checked })}
                  className="mr-2"
                />
                Required Approval
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveLevel}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setEditingLevel(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Admin Panel Component
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('employees');

  const tabs = [
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'leaveTypes', label: 'Leave Types', icon: Calendar },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'approvalFlow', label: 'Approval Flow', icon: GitBranch }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeeManagement />;
      case 'leaveTypes':
        return <LeaveTypeManagement />;
      case 'departments':
        return <DepartmentManagement />;
      case 'approvalFlow':
        return <ApprovalFlowManagement />;
      default:
        return <EmployeeManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Leave Application Management System</p>
            </div>
            <div className="text-sm text-gray-500">
              Welcome, Admin
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}