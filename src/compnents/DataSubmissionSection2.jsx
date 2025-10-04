// src/components/DataSubmissionSection2.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiData2 from "../store/apidata.js";
import { SURVEY_FIELDS } from "../constants/surveyFields.js";
import ManualInputForm from "./ManualInputForm.jsx"; // Assuming you create this
import CsvUploadForm from "./CsvUploadForm.jsx";
import ResponseDisplay from "./ResponseDisplay.jsx";

// API Endpoints
const API_BASE_URL = "https://cutaneously-unliable-argentina.ngrok-free.dev";
const API_PREDICT_ENDPOINT = `${API_BASE_URL}/predict/csv/`;

const DataSubmissionSection2 = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState("manual");
  const [survey, setSurvey] = useState("K2");
  const [csvFile, setCsvFile] = useState(null);
  const [csvFileName, setCsvFileName] = useState("");
  const [submittedJson, setSubmittedJson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data, apiReq } = useApiData2();

  const handleManualSubmit = async (e) => {
    const formData = new FormData(e.target);
    const features = {};
    const fieldTypeMap = SURVEY_FIELDS[survey].reduce((acc, field) => {
      acc[field.backend] = field.type;
      return acc;
    }, {});

    for (let [key, value] of formData.entries()) {
      if (key === 'survey' || !value) continue;
      const type = fieldTypeMap[key];
      features[key] = (type === 'int' || type === 'float') ? parseFloat(value) : value;
    }

    return { data_type: survey.toLowerCase(), features };
  };

  const handleCsvSubmit = () => {
    const formData = new FormData();
    formData.append('data_type', survey);
    formData.append('file', csvFile);
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmittedJson(null);

    try {
      const payload = inputType === 'manual'
        ? await handleManualSubmit(e)
        : handleCsvSubmit();

      await apiReq(API_PREDICT_ENDPOINT, payload);
      // For manual submissions, show what was sent. For CSV, show what was received.
      setSubmittedJson(inputType === 'manual' ? payload : data); 
      navigate('/response');
    } catch (error) {
      console.error('Error:', error);
      setSubmittedJson({ error: "Failed to fetch.", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  const isSubmitDisabled = (inputType === 'csv' && !csvFile) || isLoading;

  return (
    <section id="find-planet" className="py-20 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        {/* ... Header and Title ... */}
        <div className="max-w-6xl mx-auto bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20 shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* ... Input Method Toggle ... */}
            
            {inputType === "manual" ? (
              <ManualInputForm survey={survey} setSurvey={setSurvey} surveyFields={SURVEY_FIELDS[survey]} />
            ) : (
              <CsvUploadForm 
                  csvFile={csvFile}
                  setCsvFile={setCsvFile}
                  csvFileName={csvFileName}
                  setCsvFileName={setCsvFileName}
                  csvDataType={survey}
                  setCsvDataType={setSurvey}
              />
            )}

            <div className="text-center mt-8">
              <button type="submit" disabled={isSubmitDisabled} className="...">
                {isLoading ? 'Submitting...' : 'Analyze & Submit'}
              </button>
            </div>
          </form>

          <ResponseDisplay data={submittedJson} title="Submitted Data" />
        </div>
      </div>
    </section>
  );
};

export default DataSubmissionSection2;