import React, { useState } from "react";
import { uploadFile, updatePermit } from "../Services/authService";
const copyPermitToForm = (permit) => ({
  applicantName: permit.applicantName || "",
  nationalIdOrCr: permit.nationalIdOrCr || "",
  permitType: permit.permitType || "",
  description: permit.description || "",
  area: permit.area || "",
  location: permit.location || "",
  startDate: permit.startDate || "",
  endDate: permit.endDate || "",
  contactNumber: permit.contactNumber || "",
  email: permit.email || "",
  fileUrls: permit.fileUrls?.length ? [...permit.fileUrls] : [""],
});

const UpdatePermitForm = ({ permit, onSubmit, onCancel }) => {
  const [form, setForm] = useState(copyPermitToForm(permit));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFilesAdded = (newFiles) => {
    const fileArray = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index) => {
    const updatedFileUrls = [...form.fileUrls];
    updatedFileUrls.splice(index, 1);
    setForm((f) => ({ ...f, fileUrls: updatedFileUrls }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let newFileUrls = [];

      // Upload new files if any
      if (files.length > 0) {
        const uploadPromises = files.map((file) =>
          uploadFile(file)
            .then((url) => {
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: { status: "completed" },
              }));
              return url;
            })
            .catch((error) => {
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: { status: "failed", error },
              }));
              throw error;
            })
        );

        newFileUrls = await Promise.all(uploadPromises);

        // Flatten if uploadFile returns array of strings instead of string
        if (Array.isArray(newFileUrls[0])) {
          newFileUrls = newFileUrls.flat();
        }
      }

      // Combine existing file URLs with newly uploaded ones
      const allFileUrls = [...form.fileUrls, ...newFileUrls].filter(
        (url) => url
      );

      await onSubmit(permit.id, {
        ...form,
        fileUrls: allFileUrls,
      });
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
              <label className="block text-gray-700 font-medium">
                National ID or CR
              </label>
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
              <label className="block text-gray-700 font-medium">
                Permit Type
              </label>
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

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-medium">
                Location
              </label>
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
              <label className="block text-gray-700 font-medium">
                Contact Number
              </label>
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
              <label className="block text-gray-700 font-medium">
                Start Date
              </label>
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
              <label className="block text-gray-700 font-medium">
                End Date
              </label>
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
              <label className="block text-gray-700 font-medium">
                Description
              </label>
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

          {/* Files Section */}
          <div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-400 rounded-md p-6 text-center cursor-pointer mb-4"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p className="text-gray-600 mb-2">
                Drag & drop files here, or click to browse
              </p>
              <input
                id="fileInput"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFilesAdded(e.target.files)}
              />
            </div>

            {/* Existing Files List */}
            {form.fileUrls.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Existing Files:</h3>
                <ul className="space-y-2">
                  {form.fileUrls
                    .filter((url) => url && url.trim() !== "")
                    .map((url, idx) => (
                      <li
                        key={`existing-${idx}`}
                        className="flex justify-between items-center"
                      >
                        <div className="flex-1 truncate">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {url.split("/").pop() || `Document ${idx + 1}`}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingFile(idx)}
                          className="ml-4 px-2 py-1 text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* New Files List */}
            {files.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">New Files to Upload:</h3>
                <ul className="space-y-2">
                  {files.map((file, idx) => (
                    <li
                      key={`new-${idx}`}
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <span>{file.name}</span>
                        {uploadProgress[file.name]?.status === "uploading" && (
                          <span className="ml-2 text-blue-600">
                            Uploading...
                          </span>
                        )}
                        {uploadProgress[file.name]?.status === "failed" && (
                          <span className="ml-2 text-red-600">Failed</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="ml-4 px-2 py-1 text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Permit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePermitForm;
