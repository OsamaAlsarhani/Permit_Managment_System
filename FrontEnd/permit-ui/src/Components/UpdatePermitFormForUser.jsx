import React, { useState } from "react";

const copyPermitToForm = (permit) => ({
  status: permit.status || "",
  adminComment: permit.adminComment || "",
});

const UpdatePermitFormForUser = ({ permit, onSubmit, onCancel }) => {
  const [form, setForm] = useState(copyPermitToForm(permit));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    if (name === "fileUrls") {
      const updated = [...form.fileUrls];
      updated[idx] = value;
      setForm((f) => ({ ...f, fileUrls: updated }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(permit.id, form);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to update"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Edit Permit</h2>
        </div>

        {/* Error Message */}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        {/* Form */}
        <form onSubmit={submit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Permit Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="EDIT_REQUESTED">Edit Requested</option>
              </select>
            </div>

            {/* Admin Comment*/}

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium">
                Admin Comment
              </label>
              <textarea
                name="adminComment"
                value={form.adminComment || ""}
                onChange={handleChange}
                placeholder="reason for edit request or admin comment"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
            >
              {submitting ? "Updating..." : "Update Permit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePermitFormForUser;
