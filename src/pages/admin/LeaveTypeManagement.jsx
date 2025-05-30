import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaveTypeManagement = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  // Fetch leave types
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/leave-types");
      setLeaveTypes(res.data);
    } catch (error) {
      console.error("Failed to fetch leave types", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leaveTypeId) => {
     navigate(`/admin-panel/leave-type/edit/${leaveTypeId}`);
    console.log("Edit leave type with ID:", leaveTypeId);
    // Navigate or open modal for editing
  };

const handleDelete = async (leaveTypeId) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete employee ${leaveTypeId}? This action cannot be undone.`);
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8080/api/leave-types/${leaveTypeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert(`Leave type ${leaveTypeId} deleted successfully.`);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete employee: ' + (error.response?.data?.message || error.message));
  }
};

  const handleAdd = () => {
    navigate(`/admin-panel/leave-type/add`);
    console.log("Add new leave type");
    // Navigate or open modal for adding
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leave Types</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAdd}
        >
          Add Leave Type
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Leave Type Name</th>
            <th className="p-2 border">Total Days</th>
            <th className="p-2 border">Year Start</th>
            <th className="p-2 border">Year End</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map((type) => (
            <tr key={type.id}>
              <td className="p-2 border">{type.leaveTypeId}</td>
              <td className="p-2 border">{type.typeName}</td>
              <td className="p-2 border">{type.maxAllowedPerYear}</td>
              <td className="p-2 border">{type.academicYearStart}</td>
              <td className="p-2 border">{type.academicYearEnd}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(type.leaveTypeId)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(type.leaveTypeId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {leaveTypes.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No leave types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTypeManagement;
