import React, { useMemo, useRef, useEffect } from 'react';
import SurveySelector from './SurveySelector.jsx'; // Assuming this is in a separate file

// This component is also a dependency, so it's included here.
// In a real project, this would be in its own file: components/AutoSizingTextarea.js
const AutoSizingTextarea = (props) => {
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [props.value]);

  const handleInput = (e) => {
    resizeTextarea();
    if (props.onInput) {
      props.onInput(e);
    }
  };

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


const ManualInputForm = ({ survey, setSurvey, surveyFields }) => {
  
  const renderInputFields = useMemo(() => {
    const commonInputClass = "bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow w-full";
    
    return surveyFields.map((field) => {
      if (!field.csv) return null;

      // Dynamically adjust column span based on label length for better layout
      const labelLength = field.csv.length;
      let colSpanClass = "md:col-span-1";
      if (labelLength > 55) {
        colSpanClass = "md:col-span-4";
      } else if (labelLength > 30) {
        colSpanClass = "md:col-span-2";
      }
      
      const isTextField = ['string', 'String', 'text'].includes(field.type);

      return (
        <div key={`${survey}-${field.backend}`} className={`flex flex-col ${colSpanClass}`}>
          <label htmlFor={field.backend} className="text-sm text-cyan-200 mb-1">
            {field.csv}
          </label>
          {isTextField ? (
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
  }, [surveyFields, survey]); // Reruns only when survey or its fields change

  return (
    <>
      <SurveySelector
        id="survey-select"
        label="2. Select Survey Type"
        value={survey}
        onChange={(e) => setSurvey(e.target.value)}
      />

      <div className="mb-8">
        <h3 className="text-xl text-cyan-300 font-semibold mb-4 border-b border-cyan-500/20 pb-2">
          3. Enter Data Parameters for {survey}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6 mt-4">
          {renderInputFields}
        </div>
      </div>
    </>
  );
};

export default ManualInputForm;