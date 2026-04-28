import { useState } from "react";
import { uploadExcel } from "../services/customerService";
import "../css/UploadExcel.css";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.type === "application/vnd.ms-excel")) {
      setFile(selectedFile);
      setMessage({ type: "", text: "" });
    } else {
      setMessage({ type: "error", text: "Please select a valid Excel file (.xlsx or .xls)" });
      e.target.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file first" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadExcel(formData);
      setMessage({ 
        type: "success", 
        text: response.data?.message || "Customers uploaded successfully!" 
      });
      setFile(null);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to upload file. Please check the format." 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Customer Data</h2>
        <p className="upload-description">
          Upload an Excel file with customer data. The file should contain columns:
          Name, NIC, DOB
        </p>
        
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={uploading}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? file.name : "Choose Excel File"}
          </label>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="upload-btn"
        >
          {uploading ? "Uploading..." : "Upload Customers"}
        </button>
      </div>
    </div>
  );
}