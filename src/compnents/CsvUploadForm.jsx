// src/components/CsvUploadForm.jsx
import { useState, useRef } from "react";

const CsvUploadForm = ({ csvFile, setCsvFile, csvFileName, setCsvFileName, csvDataType, setCsvDataType }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const isCsv = file.type === "text/csv" || file.name.endsWith(".csv");
    if (!isCsv) {
      alert("Please upload a valid CSV file.");
      return;
    }

    setCsvFile(file);
    setCsvFileName(file.name);
  };

  const handleFileSelect = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  return (
    <div className="text-center mt-10">
      {/* ▼ Survey Type Dropdown */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-cyan-400 mb-2">
          1. Select Survey Type
        </label>
        <select
          value={csvDataType}
          onChange={(e) => setCsvDataType(e.target.value)}
          className="bg-slate-900 text-gray-200 border border-cyan-400/50 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
        >
          <option value="KOI">KOI</option>
          <option value="K2">K2</option>
          <option value="TESS">TESS</option>
        </select>
      </div>

      {/* ▼ Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`transition-colors border-2 border-dashed rounded-2xl py-10 px-6 cursor-pointer ${
          isDragging
            ? "border-cyan-400 bg-slate-800/70"
            : "border-slate-600 hover:border-cyan-300 hover:bg-slate-800/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!csvFile ? (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-cyan-400 mb-3"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
              />
            </svg>
            <p className="text-gray-300 text-lg">
              Drag & drop your <span className="text-cyan-400 font-semibold">CSV</span> file here
            </p>
            <p className="text-gray-500 text-sm mt-1">or click to browse files</p>
          </div>
        ) : (
          <div className="text-green-400 font-medium">
            ✅ File Selected: <span className="text-white">{csvFileName}</span>
          </div>
        )}
      </div>

      {/* ▼ File Info */}
      {csvFile && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-600/50 rounded-lg text-green-300">
          <p className="text-sm">
            <strong>{csvFileName}</strong> is ready for upload.
          </p>
        </div>
      )}
    </div>
  );
};

export default CsvUploadForm;
