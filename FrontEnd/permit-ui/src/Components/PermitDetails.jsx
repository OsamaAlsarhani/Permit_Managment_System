import React from 'react';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EDIT_REQUESTED: 'bg-gray-100 text-gray-800',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const DetailPermit = ({ permit, onClose }) => {
  if (!permit) return null;

  const statusStyle = statusColors[permit.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] p-6 overflow-y-auto relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6">Permit Details</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><strong>ID:</strong> {permit.id}</p>
            <p><strong>Applicant Name:</strong> {permit.applicantName}</p>
            <p><strong>Permit Type:</strong> {permit.permitType}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${statusStyle}`}>
                {permit.status}
              </span>
            </p>
            <p><strong>National ID / CR:</strong> {permit.nationalIdOrCr}</p>
            <p><strong>Location:</strong> {permit.location}</p>
            <p><strong>Area:</strong> {permit.area} m²</p>
            <p><strong>Contact:</strong> {permit.contactNumber}</p>
            <p><strong>Email:</strong> {permit.email}</p>
            <p><strong>Start Date:</strong> {formatDate(permit.startDate)}</p>
            <p><strong>End Date:</strong> {formatDate(permit.endDate)}</p>
          </div>

          <div>
            <strong>Description:</strong>
            <p className="mt-1 text-gray-700">{permit.description || '-'}</p>
          </div>

          {permit.adminComment && (
            <div>
              <strong>Admin Comment:</strong>
              <p className="mt-1 text-gray-700 bg-gray-100 p-2 rounded">{permit.adminComment}</p>
            </div>
          )}

          {permit.fileUrls?.length > 0 && (
            <div>
              <strong>Files:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {permit.fileUrls.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPermit;
