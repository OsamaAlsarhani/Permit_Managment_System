import React, { useState,useContext } from 'react';
import { createPermit } from '../Services/authService';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  applicantName: '',
  nationalIdOrCr: '',
  permitType: '',
  description: '',
  area: '',
  location: '',
  startDate: '',
  endDate: '',
  contactNumber: '',
  email: '',
  fileUrls: [''],
};

const PermitForm = () => {
  const [form, setForm] = useState(initialForm);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

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
      fileUrls: f.fileUrls.filter((_, i) => i !== idx),
    }));
  };

  const handleDummySelect = (idx) => {
    // placeholder behavior: simulate selecting a file by inserting a dummy URL
    const dummy = `https://example.com/selected-file-${idx + 1}.pdf`;
    const updated = [...form.fileUrls];
    updated[idx] = dummy;
    setForm(f => ({ ...f, fileUrls: updated }));
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();
    const data = await createPermit(form);
    if (data) {
      alert('Permit created successfully!');
      console.log('Would submit:', form);
      setForm(initialForm); // Reset form after submission
      navigate('/user-dashboard'); // Redirect to user dashboard
    } else {
      alert('Failed to create permit');
    }   
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Permit</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-gray-700 font-medium">Applicant Name</label>
            <input
              name="applicantName"
              value={form.applicantName}
              onChange={handleChange}
              placeholder="Name of Applicant"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">National ID or CR</label>
            <input
              name="nationalIdOrCr"
              value={form.nationalIdOrCr}
              onChange={handleChange}
              placeholder="1234567890"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Permit Type</label>
            <select
              name="permitType"
              value={form.permitType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="Building">Building</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Commercial">Commercial</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Riyadh"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Building a small office"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Area</label>
            <input
              name="area"
              type="number"
              step="0.1"
              value={form.area}
              onChange={handleChange}
              placeholder="Area in square meters"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Contact Number</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="+966**********"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

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

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@hotmail  .com"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        {/* File URLs section (placeholder) */}
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-medium">Files / Documents</div>
            <button
              type="button"
              onClick={addFileUrl}
              className="text-sm text-blue-600 underline"
            >
              Add another
            </button>
          </div>
          {form.fileUrls.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-3">
              <input
                name="fileUrls"
                value={url}
                placeholder="https://example.com/doc1.pdf"
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
          <p className="text-sm text-gray-500">
            (File selection is placeholder only; no real upload)
          </p>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition hover:cursor-pointer"
          >
            Create Permit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PermitForm;
