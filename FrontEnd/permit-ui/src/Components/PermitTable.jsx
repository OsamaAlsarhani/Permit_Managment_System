import React, { useState } from "react";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  EDIT_REQUESTED: "bg-gray-100 text-gray-800",
};

const PermitTable = ({
  permits = [],
  onUpdate,
  onDetails,
  onDelete,
  emptyMessage = "No permits found.",
}) => {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle sorting logic
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Apply filter
  let filteredPermits =
    filterStatus === "ALL"
      ? permits
      : permits.filter((p) => p.status?.toUpperCase() === filterStatus);

  // Apply sorting
  if (sortConfig.key) {
    filteredPermits = [...filteredPermits].sort((a, b) => {
      let aValue = a[sortConfig.key] ?? "";
      let bValue = b[sortConfig.key] ?? "";

      // Always compare uppercase strings for consistent sorting
      aValue = typeof aValue === "string" ? aValue.toUpperCase() : aValue;
      bValue = typeof bValue === "string" ? bValue.toUpperCase() : bValue;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {/* Filter Dropdown */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          Filter by Status:
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="EDIT_REQUESTED">Edit Request</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("applicantName")}
              >
                Applicant Name{" "}
                {sortConfig.key === "applicantName" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("permitType")}
              >
                Permit Type{" "}
                {sortConfig.key === "permitType" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPermits.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredPermits.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {p.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {p.applicantName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {p.permitType}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[p.status?.toUpperCase()] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.status || "UNKNOWN"}
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
    </div>
  );
};

export default PermitTable;
