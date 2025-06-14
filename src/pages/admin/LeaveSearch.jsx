import React, { useState } from 'react';
import axios from 'axios';

const LeaveSearch = ({ setLeaveRequests }) => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert('Please enter a search keyword');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Create the filter object that matches your LeaveSearchFilterDTO
      const searchFilter = {
        keyword: keyword.trim(),
        // Add other filter properties if needed by your DTO
        // startDate: null,
        // endDate: null,
        // status: null,
        // empId: null,
        // etc.
      };
      
      console.log('Searching with filter:', searchFilter);

      const response = await axios.post(
        `http://localhost:8080/api/leave-request/search`, 
        searchFilter, // Send the filter object in request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Search response:', response.data);
      setLeaveRequests(response.data);
      
    } catch (error) {
      console.error('Search failed:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      if (error.response?.status === 403) {
        setError('Access denied. You need ADMIN privileges to search.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError(`Search failed: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setKeyword('');
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/leave-request/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Failed to reload data:', error);
      setError('Failed to reload data');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search leave requests..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{ 
            padding: '8px', 
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button 
          onClick={handleClearSearch}
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
      
      {error && (
        <div style={{ 
          color: '#721c24', 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default LeaveSearch;