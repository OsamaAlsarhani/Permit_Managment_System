import React, { useState, useContext } from "react";
import { uploadFile, createPermit } from "../Services/authService";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const initialForm = {
  nationalIdOrCr: "",
  permitType: "",
  description: "",
  area: "",
  location: "",
  startDate: "",
  endDate: "",
  contactNumber: "",
  email: "",
};

const PermitForm = () => {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let filesURL = [];
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

        filesURL = await Promise.all(uploadPromises);

        // Flatten if uploadFile returns array of strings instead of string
        if (Array.isArray(filesURL[0])) {
          filesURL = filesURL.flat();
        }

        console.log("Uploaded file URLs:", filesURL);
      }

      const response = await createPermit(form, filesURL);

      alert("Permit created successfully!");
      setForm(initialForm);
      setFiles([]);
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Failed to create permit:", error);
      alert(
        `Failed to create permit: ${error.response?.data || error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Permit</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Your existing form inputs (unchanged) */}
          <div>
            <label className="block text-gray-700 font-medium">
              National ID or CR
            </label>
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

          <div>
            <label className="block text-gray-700 font-medium">
              Contact Number
            </label>
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
            <label className="block text-gray-700 font-medium">
              Description
            </label>
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

          <div className="md:col-span-2">
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
              placeholder="example@hotmail.com"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Files Section */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
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

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selected Files:</h3>
            <ul className="space-y-2">
              {files.map((file, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <div className="flex-1">
                    <span>{file.name}</span>
                    {uploadProgress[file.name]?.status === "uploading" && (
                      <span className="ml-2 text-blue-600">Uploading...</span>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Creating Permit..." : "Create Permit"}
        </button>
      </form>
    </div>
  );
};

export default PermitForm;
