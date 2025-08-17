import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { generateFileURL } from "../Services/authService";

const ViewFile = () => {
  const { encodedUrl } = useParams();
  const objectName = decodeURIComponent(encodedUrl);
  const [fileUrl, setFileUrl] = useState(null);
  const fileName = objectName.split("/").pop();

  useEffect(() => {
    // Get the fresh presigned URL on component mount
    generateFileURL(objectName).then(setFileUrl).catch(console.error);
  }, [objectName]);

  const downloadFile = async () => {
    if (!fileUrl) return alert("File URL not loaded yet");

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">File Viewer</h1>
      <p className="mb-4">
        File: <strong>{fileName}</strong>
      </p>

      {/* Download button */}
      <button
        onClick={downloadFile}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={!fileUrl}
      >
        {fileUrl ? "Download" : "Loading..."}
      </button>

      {/* Preview for images or PDFs */}
      {fileUrl && fileUrl.endsWith(".pdf") ? (
        <iframe
          src={fileUrl}
          title="PDF Viewer"
          className="w-full h-[80vh] mt-4"
        />
      ) : (
        fileUrl && (
          <img src={fileUrl} alt={fileName} className="mt-4 max-w-full" />
        )
      )}
    </div>
  );
};

export default ViewFile;
