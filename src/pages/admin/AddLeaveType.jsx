import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function AddLeaveType() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    typeName: '',
    maxAllowedPerYear: '',
    maxAllowedPerMonth: null,
    minAllowedDays: null,
    academicYearStart: '',
    academicYearEnd: '',
    canBeCarriedForward: false,
    maxCarryForward: null,
    active: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      maxAllowedPerYear: formData.maxAllowedPerYear === '' ? null : parseInt(formData.maxAllowedPerYear),
      maxAllowedPerMonth: formData.maxAllowedPerMonth === '' ? null : parseInt(formData.maxAllowedPerMonth),
      minAllowedDays: formData.minAllowedDays === '' ? null : parseInt(formData.minAllowedDays),
      maxCarryForward: formData.maxCarryForward === '' ? null : parseInt(formData.maxCarryForward)
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/leave-types/create', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Leave type added successfully.');
      navigate('/admin-panel/leave-type'); // Redirect to leave type management page
      // Reset form
      setFormData({
        typeName: '',
        maxAllowedPerYear: '',
        maxAllowedPerMonth: '',
        minAllowedDays: '',
        academicYearStart: '',
        academicYearEnd: '',
        canBeCarriedForward: false,
        maxCarryForward: '',
        active: true
      });
    } catch (error) {
      console.error(error);
      alert('Failed to add leave type.');
    }
  };

  return (
    <div className="add-leave-type-form">
      <h2>Add New Leave Type</h2>
      <form onSubmit={handleSubmit}>
        <label>Type Name:
          <input type="text" name="typeName" value={formData.typeName} onChange={handleChange} required />
        </label>

        <label>Max Allowed Per Year:
          <input type="number" name="maxAllowedPerYear" value={formData.maxAllowedPerYear} onChange={handleChange} />
        </label>

        <label>Academic Year Start:
          <input type="date" name="academicYearStart" value={formData.academicYearStart} onChange={handleChange} />
        </label>

        <label>Academic Year End:
          <input type="date" name="academicYearEnd" value={formData.academicYearEnd} onChange={handleChange} />
        </label>

        <label>
          Active:
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
        </label>

        <button type="submit">Add Leave Type</button>
      </form>
    </div>
  );
}
