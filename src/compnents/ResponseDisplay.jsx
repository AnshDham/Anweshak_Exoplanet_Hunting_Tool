// src/components/ResponseDisplay.js

import React from 'react';

const ResponseDisplay = ({ data, title = "Server Response" }) => {
  // Don't render anything if there's no data
  if (!data) {
    return null;
  }

  // Check if the data object contains an error key for styling
  const hasError = data.hasOwnProperty('error');
  const codeColorClass = hasError ? 'text-red-400' : 'text-green-300';

  return (
    <div className="mt-10 animate-fade-in">
      <h3 className="text-xl text-cyan-300 font-semibold mb-4 border-b border-cyan-500/20 pb-2">
        {title}
      </h3>
      <div className="bg-slate-900 rounded-md border border-slate-700 p-4">
        <pre className={`text-sm whitespace-pre-wrap break-all ${codeColorClass}`}>
          <code>
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default ResponseDisplay;