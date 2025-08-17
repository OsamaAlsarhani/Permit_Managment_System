import React, { useState } from 'react';

const copyPermitToForm = (permit) => ({
  applicantName: permit.applicantName || '',
  nationalIdOrCr: permit.nationalIdOrCr || '',
  permitType: permit.permitType || '',
  description: permit.description || '',
  area: permit.area || '',
  location: permit.location || '',
  startDate: permit.startDate || '',
  endDate: permit.endDate || '',
  contactNumber: permit.contactNumber || '',
  email: permit.email || '',
  fileUrls: permit.fileUrls?.length ? [...permit.fileUrls] : [''],
});

const UpdatePermitForm = ({ permit, onSubmit, onCancel }) => {
  const [form, setForm] = useState(copyPermitToForm(permit));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    if (name === 'fileUrls') {
      const updated = [...form.fileUrls];
      updated[idx] = value;
      setForm(f => ({ ...f, fileUrls: updated }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const addFileUrl = () => {
    setForm(f => ({ ...f, fileUrls: [...f.fileUrls, ''] }));
  };

  const removeFileUrl = (idx) => {
    setForm(f => ({
      ...f,
      fileUrls: form.fileUrls.filter((_, i) => i !== idx),
    }));
  };

  const handleDummySelect = (idx) => {
    const dummy = `https://example.com/selected-file-${idx + 1}.pdf`;
    const updated = [...form.fileUrls];
    updated[idx] = dummy;
    setForm(f => ({ ...f, fileUrls: updated }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(permit.id, form);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update');
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

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Edit Permit</h2>
        </div>

        {error && <div className="mb-2 text-red-600">{error}</div>}

        <form onSubmit={submit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* National ID or CR */}
            <div>
              <label className="block text-gray-700 font-medium">National ID or CR</label>
              <input
                name="nationalIdOrCr"
                value={form.nationalIdOrCr}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Permit Type */}
            <div>
              <label className="block text-gray-700 font-medium">Permit Type</label>
              <select
                name="permitType"
                value={form.permitType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="" disabled>Select type</option>
                <option value="Building">Building</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Commercial">Commercial</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-medium">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-gray-700 font-medium">Area</label>
              <input
                name="area"
                type="number"
                step="0.1"
                value={form.area}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-gray-700 font-medium">Contact Number</label>
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Start / End Date */}
            <div>
              <label className="block text-gray-700 font-medium">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">End Date</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
                required
              />
            </div>
          </div>

          {/* Files */}
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-medium">Files / Documents</div>
              <button type="button" onClick={addFileUrl} className="text-sm text-blue-600 underline">
                Add another
              </button>
            </div>
            {form.fileUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2 mb-3">
                <input
                  name="fileUrls"
                  value={url}
                  onChange={(e) => handleChange(e, idx)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => handleDummySelect(idx)}
                  className="px-3 py-2 bg-gray-100 border rounded-md"
                >
                  Select file
                </button>
                {form.fileUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFileUrl(idx)}
                    className="px-3 py-2 bg-red-100 rounded-md"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
            >
              {submitting ? 'Updating...' : 'Update Permit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePermitForm;
