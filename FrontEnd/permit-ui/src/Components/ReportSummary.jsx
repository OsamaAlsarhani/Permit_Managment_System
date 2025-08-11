import React, { useState, useEffect } from 'react';
import { reportSummary } from '../Services/authService';

const statusMap = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  EDIT_REQUESTED: 'Edit Requested',
  TOTAL: 'Total', // ✅ Added
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  TOTAL: 'bg-blue-100 text-blue-800', // ✅ Added color for TOTAL
};

const ReportSummary = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchReportSummary = async () => {
      try {
        const data = await reportSummary();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching report summary:', error);
      }
    };

    fetchReportSummary();
  }, []);

  const getCount = (key) => {
    const item = summary.find(([status]) => status === key);
    return item && item[1] != null ? item[1] : 0;
  };
  const totalCount = summary.reduce((acc, [status, count]) => {
    return acc + (count || 0);
  }, 0);    
  summary.push(['TOTAL', totalCount]); // ✅ Add total count to summary
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Permit Report Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {Object.keys(statusMap).map((status) => (
          <div
            key={status}
            className={`p-4 rounded shadow ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
          >
            <h3 className="text-sm font-medium uppercase">{statusMap[status]}</h3>
            <p className="text-2xl font-bold">{getCount(status)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportSummary;
