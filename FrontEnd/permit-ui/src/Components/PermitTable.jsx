import React from 'react';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EDIT_REQUESTED: 'bg-gray-100 text-gray-800',
};

const PermitTable = ({ permits = [], onUpdate, onDetails    , onDelete, emptyMessage = 'No permits found.' }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applicant Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Permit Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {permits.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            permits.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.applicantName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.permitType}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status?.toUpperCase()] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {p.status || 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                    <button
                    type="button"
                    onClick={() => onDetails && onDetails(p)}
                    className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdate && onUpdate(p)}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(p)}
                    className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PermitTable;
