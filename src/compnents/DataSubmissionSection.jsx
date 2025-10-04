import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApiData from "../store/apidata";

// This hook now uses the browser's `fetch` API to make real network requests.
const useApiData2 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiReq = async (url, payload) => {
    setLoading(true);
    setError(null);
    try {
      const isFormData = payload instanceof FormData;

      // Use the fetch API to make a POST request
      const response = await fetch(url, {
        method: 'POST',
        // Don't set Content-Type for FormData, the browser does it automatically.
        // For JSON, we explicitly set the Content-Type header.
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? payload : JSON.stringify(payload),
      });

      // Handle non-successful HTTP responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      // Parse the JSON response from the API
      const responseData = await response.json();

      console.log("API response received:", responseData);
      setData(responseData);
      return responseData;

    } catch (err) {
      setError(err);
      console.error("API Request failed:", err);
      // We re-throw the error so the calling function can handle it if needed
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, apiReq };
};

// Sample data for the "Load Sample Data" button
const SAMPLE_DATA = {
  K2: {
    features: {
      sy_snum: 1,
      sy_pnum: 2,
      soltype: "Transit",
      pl_orbper: 45.67,
      pl_orbpererr1: 0.2,
      pl_orbpererr2: -0.2,
      pl_rade: 1.9,
      pl_radeerr1: 0.1,
      pl_radeerr2: -0.1,
      pl_radj: 0.18,
      pl_radjerr1: 0.01,
      pl_radjerr2: -0.01,
      ttv_flag: 0,
      st_teff: 5600,
      st_tefferr1: 60,
      st_tefferr2: -60,
      st_rad: 0.95,
      st_raderr1: 0.05,
      st_raderr2: -0.05,
      ra: 285.123,
      dec: 47.456,
      sy_dist: 220.5,
      sy_disterr1: 5.5,
      sy_disterr2: -5.5,
      sy_vmag: 13.2,
      sy_kmag: 11.5,
      sy_kmagerr1: 0.05,
      sy_kmagerr2: -0.05,
      sy_gaiamag: 13.1,
      sy_gaiamagerr1: 0.02,
      sy_gaiamagerr2: -0.02,
    },
  },
  TESS: {
    features: {
      ra: 290.123,
      dec: 45.678,
      st_pmra: 12.3,
      st_pmraerr1: 0.1,
      st_pmraerr2: -0.1,
      st_pmdec: -8.7,
      st_pmdecerr1: 0.1,
      st_pmdecerr2: -0.1,
      pl_tranmid: 2459000.123,
      pl_tranmiderr1: 0.002,
      pl_tranmiderr2: -0.002,
      pl_orbper: 290.0,
      pl_orbpererr1: 0.5,
      pl_orbpererr2: -0.5,
      pl_trandurh: 10.5,
      pl_trandurherr1: 0.1,
      pl_trandurherr2: -0.1,
      pl_trandep: 0.01,
      pl_trandeperr1: 0.001,
      pl_trandeperr2: -0.001,
      pl_rade: 2.1,
      pl_radeerr1: 0.1,
      pl_radeerr2: -0.1,
      pl_insol: 150.0,
      pl_eqt: 500,
      st_tmag: 12.5,
      st_tmagerr1: 0.01,
      st_tmagerr2: -0.01,
      st_dist: 150.0,
      st_disterr1: 5.0,
      st_disterr2: -5.0,
      st_teff: 5800,
      st_tefferr1: 50,
      st_tefferr2: -50,
      st_logg: 4.4,
      st_loggerr1: 0.05,
      st_loggerr2: -0.05,
      st_rad: 1.0,
      st_raderr1: 0.05,
      st_raderr2: -0.05,
    },
  },
  KOI: {
    features: {
      koi_pdisposition: "CANDIDATE",
      koi_score: 0.92,
      koi_fpflag_ss: 0,
      koi_fpflag_co: 0,
      koi_fpflag_ec: 0,
      koi_period: 12.34,
      koi_period_err1: 0.05,
      koi_period_err2: -0.05,
      koi_time0bk: 134.56,
      koi_time0bk_err1: 0.02,
      koi_time0bk_err2: -0.02,
      koi_impact: 0.3,
      koi_duration: 4.2,
      koi_duration_err1: 0.1,
      koi_duration_err2: -0.1,
      koi_depth: 2500.0,
      koi_depth_err1: 100.0,
      koi_depth_err2: -100.0,
      koi_prad: 1.4,
      koi_prad_err1: 0.2,
      koi_prad_err2: -0.2,
      koi_teq: 550,
      koi_insol: 1.1,
      koi_insol_err1: 0.2,
      koi_insol_err2: -0.2,
      koi_model_snr: 15.2,
      koi_tce_plnt_num: 1,
      koi_tce_delivname: "q1_q16_tce",
      koi_steff: 5750,
      koi_steff_err1: 80,
      koi_steff_err2: -80,
      koi_slogg: 4.3,
      koi_slogg_err1: 0.05,
      koi_slogg_err2: -0.05,
      koi_srad: 0.95,
      koi_srad_err1: 0.05,
      koi_srad_err2: -0.05,
      ra: 297.445,
      dec: 45.123,
      koi_kepmag: 14.2,
    },
  },
};

// SVG icon for the file upload area
const UploadIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <path
      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// A reusable textarea component that automatically adjusts its height to fit the content.
const AutoSizingTextarea = (props) => {
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Adjust height on input change
  const handleInput = (e) => {
    resizeTextarea();
    if (props.onInput) {
      props.onInput(e);
    }
  };

  // Adjust height on initial render and when value changes externally
  useEffect(() => {
    resizeTextarea();
  }, [props.value]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      {...props}
      onInput={handleInput}
      className={`${props.className} resize-none overflow-hidden`}
    />
  );
};

// Data structure defining the fields for each survey type
const SURVEY_FIELDS = {
    K2: [
        { "backend": "sy_snum", "csv": "Number of Stars", "type": "int" },
        { "backend": "sy_pnum", "csv": "Number of Planets", "type": "int" },
        { "backend": "soltype", "csv": "Solution Type", "type": "string" },
        { "backend": "pl_orbper", "csv": "Orbital Period [days]", "type": "float" },
        { "backend": "pl_orbpererr1", "csv": "Orbital Period [positive (+ve) Error]", "type": "float" },
        { "backend": "pl_orbpererr2", "csv": "Orbital Period [negative (-ve) Error]", "type": "float" },
        { "backend": "pl_rade", "csv": "Planet Radius [Earth radii]", "type": "float" },
        { "backend": "pl_radeerr1", "csv": "Planet Radius [positive (+ve) Error]", "type": "float" },
        { "backend": "pl_radeerr2", "csv": "Planet Radius [negative (-ve) Error]", "type": "float" },
        { "backend": "pl_radj", "csv": "Planet Radius [Jupiter radii]", "type": "float" },
        { "backend": "pl_radjerr1", "csv": "Planet Radius [positive (+ve) Error]", "type": "float" },
        { "backend": "pl_radjerr2", "csv": "Planet Radius [negative (-ve) Error]", "type": "float" },
        { "backend": "ttv_flag", "csv": "Data show Transit Timing Variations", "type": "int" },
        { "backend": "st_teff", "csv": "Stellar Effective Temperature [K]", "type": "float" },
        { "backend": "st_tefferr1", "csv": "Stellar Effective Temperature [positive (+ve) Error]", "type": "float" },
        { "backend": "st_tefferr2", "csv": "Stellar Effective Temperature [negative (-ve) Error]", "type": "float" },
        { "backend": "st_rad", "csv": "Stellar Radius [Solar radii]", "type": "float" },
        { "backend": "st_raderr1", "csv": "Stellar Radius [positive (+ve) Error]", "type": "float" },
        { "backend": "st_raderr2", "csv": "Stellar Radius [negative (-ve) Error]", "type": "float" },
        { "backend": "ra", "csv": "RA [decimal degrees]", "type": "float" },
        { "backend": "dec", "csv": "Dec [decimal degrees]", "type": "float" },
        { "backend": "sy_dist", "csv": "Distance [pc]", "type": "float" },
        { "backend": "sy_disterr1", "csv": "Distance [pc] [positive (+ve) Error]", "type": "float" },
        { "backend": "sy_disterr2", "csv": "Distance [pc] [negative (-ve) Error]", "type": "float" },
        { "backend": "sy_vmag", "csv": "V-(Johnson) [magnitude]", "type": "float" },
        { "backend": "sy_kmag", "csv": "Ks-band (2MASS) [magnitude]", "type": "float" },
        { "backend": "sy_kmagerr1", "csv": "Ks-band (2MASS) [positive (+ve) Error]", "type": "float" },
        { "backend": "sy_kmagerr2", "csv": "Ks-band (2MASS) [negative (-ve) Error]", "type": "float" },
        { "backend": "sy_gaiamag", "csv": "Gaia Magnitude", "type": "float" },
        { "backend": "sy_gaiamagerr1", "csv": "Gaia Magnitude [positive (+ve) Error]", "type": "float" },
        { "backend": "sy_gaiamagerr2", "csv": "Gaia Magnitude [negative (-ve) Error]", "type": "float" }
      ],
      KOI: [
        { "backend": "koi_pdisposition", "csv": "Disposition Using Kepler Data", "type": "string" },
        { "backend": "koi score", "csv": "Disposition Score", "type": "float" },
        { "backend": "koi_fpflag_ss", "csv": "Stellar Eclipse False Positive Flag", "type": "int" },
        { "backend": "koi_fpflag_co", "csv": "Centroid Offset False Positive Flag", "type": "int" },
        { "backend": "koi_fpflag_ec", "csv": "Ephemeris Match Indicates Contamination False Positive Flag", "type": "int" },
        { "backend": "koi_period", "csv": "Orbital Period (days)", "type": "float" },
        { "backend": "koi_period_err1", "csv": "Orbital Period [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_period_err2", "csv": "Orbital Period [negative (-ve) Error]", "type": "float" },
        { "backend": "koi_time0bk", "csv": "Transit Epoch (BKJD)", "type": "float" },
        { "backend": "koi_time0bk_err1", "csv": "Transit Epoch [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_time0bk_err2", "csv": "Transit Epoch [negative (-ve) Error]", "type": "float" },
        { "backend": "koi_impact", "csv": "Impact Parameter", "type": "float" },
        { "backend": "koi_duration", "csv": "Transit Duration (hours)", "type": "float" },
        { "backend": "koi_duration_err1", "csv": "Transit Duration [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_duration_err2", "csv": "Transit Duration [negative (-ve) Error]", "type": "float" },
        { "backend": "koi_depth", "csv": "Transit Depth (parts per million)", "type": "float" },
        { "backend": "koi_depth_err1", "csv": "Transit Depth [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_depth_err2", "csv": "Transit Depth [negative (-ve) Error]", "type": "float" },
        { "backend": "koi_prad", "csv": "Planetary Radius (Earth radii)", "type": "float" },
        { "backend": "koi_prad_err1", "csv": "Planetary Radius [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_prad_err2", "csv": "Planetary Radius [negative (-ve) Error]", "type": "float" },
        { "backend": "koi_teq", "csv": "Equilibrium Temperature (Kelvin)", "type": "float" },
        { "backend": "koi_insol", "csv": "Insolation Flux [Earth flux]", "type": "float" },
        { "backend": "koi_insol_err1", "csv": "Insolation Flux [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_insol_err2", "csv": "Insolation Flux [negative (-ve) Error]", "type": "float" },
        { "backend": "koi model snr", "csv": "Transit Signal-to-Noise", "type": "float" },
        { "backend": "koi_tce_plnt_num", "csv": "TCE Planet Number", "type": "int" },
        { "backend": "koi tce delivname", "csv": "TCE Delivery Name", "type": "String" },
        { "backend": "koi_steff", "csv": "Stellar Effective Temperature (Kelvin)", "type": "float" },
        { "backend": "koi_steff_err1", "csv": "Stellar Effective Temperature [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_steff_err2", "csv": "Stellar Effective Temperature [negative (-ve) Error]", "type": "float" },
        { "backend": "koi_slogg", "csv": "Stellar Surface Gravity (log10(cm s-2)", "type": "float" },
        { "backend": "koi_slogg_err1", "csv": "Stellar Surface Gravity [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_slogg_err2", "csv": "Stellar Surface Gravity [negative (-ve) Error]", "type": "float" },
        { "backend": "koi_srad", "csv": "Stellar Radius (solar radii)", "type": "float" },
        { "backend": "koi_srad_err1", "csv": "Stellar Radius (solar radii) [positive (+ve) Error]", "type": "float" },
        { "backend": "koi_srad_err2", "csv": "Stellar Radius (solar radii) [negative (-ve) Error]", "type": "float" },
        { "backend": "ra", "csv": "RA (decimal degrees)", "type": "float" },
        { "backend": "dec", "csv": "Dec (decimal degrees)", "type": "float" },
        { "backend": "koi_kepmag", "csv": "Kepler-band (magnitude)", "type": "float" }
      ],
      TESS: [
       { "backend": "ra", "csv": "RA [decimal degrees]", "type": "float" },
        { "backend": "dec", "csv": "Dec [decimal degrees]", "type": "float" },
        { "backend": "st_pmra", "csv": "PMRA [mas/yr]", "type": "float" },
        { "backend": "st_pmraerr1", "csv": "PMRA [positive (+ve) Error]", "type": "float" },
        { "backend": "st_pmraerr2", "csv": "PMRA [negative (-ve) Error]", "type": "float" },
        { "backend": "st_pmdec", "csv": "PMDec [mas/yr]", "type": "float" },
        { "backend": "st_pmdecerr1", "csv": "PMDec [positive (+ve) Error]", "type": "float" },
        { "backend": "st_pmdecerr2", "csv": "PMDec [negative (-ve) Error]", "type": "float" },
        { "backend": "pl_tranmid", "csv": "Planet Transit Midpoint [BJD]", "type": "float" },
        { "backend": "pl_tranmiderr1", "csv": "Planet Transit Midpoint [positive (+ve) Error]", "type": "float" },
        { "backend": "pl_tranmiderr2", "csv": "Planet Transit Midpoint [negative (-ve) Error]", "type": "float" },
        { "backend": "pl_orbper", "csv": "Planet Orbital Period [days]", "type": "float" },
        { "backend": "pl_orbpererr1", "csv": "Planet Orbital Period [positive (+ve) Error]", "type": "float" },
        { "backend": "pl_orbpererr2", "csv": "Planet Orbital Period [negative (-ve) Error]", "type": "float" },
        { "backend": "pl_trandurh", "csv": "Planet Transit Duration [hours]", "type": "float" },
        { "backend": "pl_trandurherr1", "csv": "Planet Transit Duration [positive (+ve) Error]", "type": "float" },
        { "backend": "pl_trandurherr2", "csv": "Planet Transit Duration [negative (-ve) Error]", "type": "float" },
        { "backend": "pl_trandep", "csv": "Planet Transit Depth [ppm]", "type": "float" },
        { "backend": "pl_trandeperr1", "csv": "Planet Transit Depth [positive (+ve) Error]", "type": "float" },
        { "backend": "pl_trandeperr2", "csv": "Planet Transit Depth [negative (-ve) Error]", "type": "float" },
        { "backend": "pl_rade", "csv": "Planet Radius [R_Earth]", "type": "float" },
        { "backend": "pl_radeerr1", "csv": "Planet Radius [R_Earth] [positive (+ve) Error]", "type": "float" },
        { "backend": "pl_radeerr2", "csv": "Planet Radius [R_Earth] [negative (-ve) Error]", "type": "float" },
        { "backend": "pl_insol", "csv": "Planet Insolation [Earth flux]", "type": "float" },
        { "backend": "pl_eqt", "csv": "Planet Equilibrium Temperature [K]", "type": "float" },
        { "backend": "st_tmag", "csv": "TESS Magnitude", "type": "float" },
        { "backend": "st_tmagerr1", "csv": "TESS Magnitude [positive (+ve) Error]", "type": "float" },
        { "backend": "st_tmagerr2", "csv": "TESS Magnitude [negative (-ve) Error]", "type": "float" },
        { "backend": "st_dist", "csv": "Stellar Distance [pc]", "type": "float" },
        { "backend": "st_disterr1", "csv": "Stellar Distance [positive (+ve) Error]", "type": "float" },
        { "backend": "st_disterr2", "csv": "Stellar Distance [negative (-ve) Error]", "type": "float" },
        { "backend": "st_teff", "csv": "Stellar Effective Temperature [K]", "type": "float" },
        { "backend": "st_tefferr1", "csv": "Stellar Effective Temperature [positive (+ve) Error]", "type": "float" },
        { "backend": "st_tefferr2", "csv": "Stellar Effective Temperature [negative (-ve) Error]", "type": "float" },
        { "backend": "st_logg", "csv": "Stellar log(g) [cm/s**2]", "type": "float" },
        { "backend": "st_loggerr1", "csv": "Stellar log(g) [positive (+ve) Error]", "type": "float" },
        { "backend": "st_loggerr2", "csv": "Stellar log(g) [negative (-ve) Error]", "type": "float" },
        { "backend": "st_rad", "csv": "Stellar Radius [R_Sun]", "type": "float" },
        { "backend": "st_raderr1", "csv": "Stellar Radius [positive (+ve) Error]", "type": "float" },
        { "backend": "st_raderr2", "csv": "Stellar Radius [negative (-ve) Error]", "type": "float" }
      ],
};

const DataSubmissionSection = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [inputType, setInputType] = useState("manual");
  const [survey, setSurvey] = useState("K2");
  const [csvDataType, setCsvDataType] = useState("K2");
  const [csvFile, setCsvFile] = useState(null);
  const [csvFileName, setCsvFileName] = useState("");
  const [submittedJson, setSubmittedJson] = useState(null);
  const { data, apiReq, loading: isLoading } = useApiData();

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCsvFileName(file.name);
      setCsvFile(file);
    } else {
      setCsvFileName("");
      setCsvFile(null);
    }
  };

  const handleLoadSampleData = () => {
    const sampleFeatures = SAMPLE_DATA[survey]?.features;

    if (!formRef.current || !sampleFeatures) {
      console.warn(`No sample data available for survey: ${survey}`);
      return;
    }

    // Clear existing values for the current survey's fields first
    const fields = SURVEY_FIELDS[survey] || [];
    fields.forEach((field) => {
      const inputElement = formRef.current.elements[field.backend];
      if (inputElement) {
        inputElement.value = "";
      }
    });

    // Set new values from sample data
    for (const [key, value] of Object.entries(sampleFeatures)) {
      const inputElement = formRef.current.elements[key];
      if (inputElement) {
        inputElement.value = value;
        // Dispatch an 'input' event to make sure autosizing textareas update their height
        const event = new Event("input", { bubbles: true });
        inputElement.dispatchEvent(event);
      } else {
        console.warn(`Could not find form element for key: ${key}`);
      }
    }
  };

  const renderInputFields = useMemo(() => {
    const fields = SURVEY_FIELDS[survey] || [];
    const commonInputClass =
      "bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow w-full";
    return fields.map((field) => {
      const labelLength = field.csv.length;
      let colSpanClass = "md:col-span-1";
      if (labelLength > 55) {
        colSpanClass = "md:col-span-4";
      } else if (labelLength > 30) {
        colSpanClass = "md:col-span-2";
      }
      if (!field.csv) return null;
      return (
        <div
          key={`${survey}-${field.backend}`}
          className={`flex flex-col ${colSpanClass}`}
        >
          <label htmlFor={field.backend} className="text-sm text-cyan-200 mb-1">
            {field.csv}
          </label>
          {field.type === "text" ||
          field.type === "string" ||
          field.type === "String" ? (
            <AutoSizingTextarea
              id={field.backend}
              name={field.backend}
              placeholder={`Enter ${field.csv}`}
              className={commonInputClass}
            />
          ) : (
            <input
              type="number"
              step="any"
              id={field.backend}
              name={field.backend}
              placeholder={`Enter ${field.csv}`}
              className={commonInputClass}
            />
          )}
        </div>
      );
    });
  }, [survey]);

  const handleManualSubmit = async (formElement) => {
    const formData = new FormData(formElement);
    const features = {};

    const fields = SURVEY_FIELDS[survey] || [];
    const fieldTypeMap = fields.reduce((acc, field) => {
      acc[field.backend] = field.type;
      return acc;
    }, {});

    for (let [key, value] of formData.entries()) {
      if (key === "survey" || value === "") continue; // Skip survey selector and empty fields

      const type = fieldTypeMap[key];

      switch (type) {
        case "int":
        case "float":
          const floatValue = parseFloat(value);
          if (!isNaN(floatValue)) {
            features[key] = floatValue;
          }
          break;
        default: // Covers 'string' and 'String'
          features[key] = value;
          break;
      }
    }

    const payload = {
      data_type: survey.toLowerCase(),
      features: features,
    };

    // Log the JSON data to be sent
    console.log("JSON data to be sent:", JSON.stringify(payload, null, 2));

    const url =
      "https://cutaneously-unliable-argentina.ngrok-free.dev/predict/manual/";

    try {
      const response = await apiReq(url, payload);
      console.log("API Response received:", response);
      setSubmittedJson(response);
    } catch (error) {
      console.error("Error:", error);
      setSubmittedJson({
        error: "Failed to fetch. See console for details.",
        message: error.message,
      });
    }
  };

  const handleUploadSubmit = async () => {
    if (!csvFile) {
      console.log("No CSV file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("data_type", csvDataType);
    formData.append("file", csvFile);

    // Log the file and formData to be sent
    console.log("File to be sent:", csvFile);
    console.log("FormData to be sent:", formData); // Note: FormData is best inspected in the Network tab

    const url = "https://cutaneously-unliable-argentina.ngrok-free.dev/predict/csv/";

    try {
      const response = await apiReq(url, formData);
      console.log("API Response received:", response);
      setSubmittedJson(response);
    } catch (error) {
      console.error("Error:", error);
      setSubmittedJson({
        error: "Failed to fetch. See console for details.",
        message: error.message,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedJson(null);

    if (inputType === "manual") {
      await handleManualSubmit(e.target);
    } else if (inputType === "csv") {
      await handleUploadSubmit();
    }
  };

  const isSubmitDisabled = (inputType === "csv" && !csvFile) || isLoading;

  return (
    <section id="find-planet" className="py-20 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4 font-orbitron">
            Submit Planetary Data
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Contribute to our cosmic database. Select an input method and
            provide the required data to begin analysis.
          </p>
        </div>
        <div className="max-w-6xl mx-auto bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-cyan-500/20 shadow-lg">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-xl text-cyan-300 font-semibold mb-3">
                1. Choose Input Method
              </label>
              <div className="flex bg-slate-900/50 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setInputType("manual");
                    setSubmittedJson(null);
                  }}
                  className={`w-1/2 py-2 rounded-md transition-colors text-sm font-bold ${
                    inputType === "manual"
                      ? "bg-cyan-500 text-slate-900 shadow"
                      : "text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  Manual Input
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputType("csv");
                    setSubmittedJson(null);
                  }}
                  className={`w-1/2 py-2 rounded-md transition-colors text-sm font-bold ${
                    inputType === "csv"
                      ? "bg-cyan-500 text-slate-900 shadow"
                      : "text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  Upload CSV
                </button>
              </div>
            </div>
            {inputType === "manual" && (
              <>
                <div className="mb-8">
                  <label
                    htmlFor="survey-select"
                    className="block text-xl text-cyan-300 font-semibold mb-3"
                  >
                    2. Select Survey Type
                  </label>
                  <div className="relative">
                    <select
                      id="survey-select"
                      name="survey"
                      value={survey}
                      onChange={(e) => setSurvey(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-3 appearance-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow"
                    >
                      <option value="K2">K2 Survey</option>
                      <option value="KOI">
                        Kepler Object of Interest (KOI)
                      </option>
                      <option value="TESS">
                        Transiting Exoplanet Survey Satellite (TESS)
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4 border-b border-cyan-500/20 pb-2">
                    <h3 className="text-xl text-cyan-300 font-semibold">
                      3. Enter Data Parameters for {survey}
                    </h3>
                    <button
                      type="button"
                      onClick={handleLoadSampleData}
                      className="bg-slate-700 text-cyan-300 hover:bg-slate-600 text-xs font-bold py-1 px-3 rounded-md transition-colors"
                    >
                      Load Sample Data
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6 mt-4">
                    {renderInputFields}
                  </div>
                </div>
              </>
            )}
            {inputType === "csv" && (
              <>
                <div className="mb-8">
                  <label
                    htmlFor="csv-survey-select"
                    className="block text-xl text-cyan-300 font-semibold mb-3"
                  >
                    2. Select Survey Type for CSV
                  </label>
                  <div className="relative">
                    <select
                      id="csv-survey-select"
                      value={csvDataType}
                      onChange={(e) => setCsvDataType(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-3 appearance-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow"
                    >
                      <option value="K2">K2 Survey</option>
                      <option value="KOI">
                        Kepler Object of Interest (KOI)
                      </option>
                      <option value="TESS">
                        Transiting Exoplanet Survey Satellite (TESS)
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-xl text-cyan-300 font-semibold mb-3">
                    3. Upload CSV File
                  </label>

                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadIcon className="mx-auto h-12 w-12 text-slate-500" />
                      <div className="flex text-sm text-gray-400 justify-center items-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-slate-700 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-cyan-500 px-3 py-2"
                        >
                          <span>
                            {csvFileName
                              ? `Selected: ${csvFileName}`
                              : "Upload a file"}
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".csv, text/csv"
                            onChange={handleFileChange}
                          />
                        </label>
                        {!csvFileName && (
                          <p className="pl-2">or drag and drop</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">CSV up to 10MB</p>
                    </div>
                  </div>
                  {csvFileName && (
                    <div className="mt-4 text-center text-green-400 bg-green-900/50 border border-green-700 rounded-md py-2 px-4">
                      <p className="text-sm">
                        File ready:{" "}
                        <span className="font-semibold">{csvFileName}</span>
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="text-center mt-8">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-cyan-500 text-slate-900 font-bold py-3 px-10 rounded-full text-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
              >
                {isLoading ? "Submitting..." : "Analyze & Submit"}
              </button>
            </div>
          </form>

          {submittedJson && (
            <div className="mt-10">
              <h3 className="text-xl text-cyan-300 font-semibold mb-4 border-b border-cyan-500/20 pb-2">
                Analysis Result
              </h3>
              <div className="bg-slate-900 rounded-md border border-slate-700 p-4">
                {submittedJson.error ? (
                  <pre className="text-sm whitespace-pre-wrap break-all text-red-400">
                    <code>{JSON.stringify(submittedJson, null, 2)}</code>
                  </pre>
                ) : (
                  <div>
                    {submittedJson.Prediction &&
                      submittedJson.Prediction[0] && (
                        <p
                          className={`text-lg font-bold ${
                            submittedJson.Prediction[0] ===
                            "Confirmed Exoplanet"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          Prediction: {submittedJson.Prediction[0]}
                        </p>
                      )}
                    {/* For CSV response */}
                    {submittedJson.message && (
                      <p className="text-green-400">{submittedJson.message}</p>
                    )}
                    <p className="text-gray-400 text-sm mt-2">
                      Note: The full API response has been logged to the
                      developer console.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DataSubmissionSection;