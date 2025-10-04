import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import  useApiData2  from '../store/apidata.js';


// const { data, isResponse } = useApiData2();
// Mock data provided by the user to build and style the response page.




/**
 * A standalone component to display the prediction results in a filterable table.
*/
const ResponsePage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const {data} = useApiData2();
  const mockData = {
  "Planet Name": [ "BD+20 594 b", "BD+20 594 b", "BD+20 594 b", "EPIC 201111557.01", "EPIC 201111557.01", "EPIC 201126503.01", "EPIC 201127519.01", "EPIC 201127519.01", "EPIC 201147085.01", "EPIC 201152065.01", "EPIC 201160662.01", "EPIC 201164625.01", "EPIC 201166680.01", "EPIC 201170410.02", "EPIC 201176672.01", "EPIC 201176672.02", "EPIC 201180665.01", "EPIC 201182911.01", "EPIC 201197348.01", "EPIC 201197348.01", "EPIC 201231940.01", "EPIC 201238110", "EPIC 201238110" ],
  "Host Name": [ "BD+20 594", "BD+20 594", "BD+20 594", "EPIC 201111557", "EPIC 201111557", "EPIC 201126503", "EPIC 201127519", "EPIC 201127519", "EPIC 201147085", "EPIC 201152065", "EPIC 201160662", "EPIC 201164625", "K2-243", "EPIC 201170410", "EPIC 201176672", "EPIC 201176672", "EPIC 201180665", "EPIC 201182911", "EPIC 201197348", "EPIC 201197348", "EPIC 201231940", "EPIC 201238110", "EPIC 201238110" ],
  "Prediction": [ "Confirmed Exoplanet", "Confirmed Exoplanet", "Confirmed Exoplanet", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", "Confirmed Exoplanet", "Confirmed Exoplanet", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", " Planet candidate", "Non-Planet Candidate", "Confirmed Exoplanet", "Confirmed Exoplanet" ]
};

// Transform the mock data into a more usable array of objects for rendering.
 

  // const mockData = data;
 
  const tableData = useMemo(() => {
    const planetNames = mockData["Planet Name"] || [];
    const hostNames = mockData["Host Name"] || [];
    const predictions = mockData["Prediction"] || [];
    const maxLength = Math.max(planetNames.length, hostNames.length, predictions.length);
    
    let combined = [];
    for (let i = 0; i < maxLength; i++) {
        combined.push({
            id: i,
            planetName: planetNames[i] || 'N/A',
            hostName: hostNames[i] || 'N/A',
            prediction: (predictions[i] || 'N/A').trim(), // Trim whitespace from prediction
        });
    }
    return combined;
  }, []);

  // Filter the data based on user input in the search bar.
  const filteredData = useMemo(() => {
    if (!filter) return tableData;
    return tableData.filter(item =>
      item.planetName.toLowerCase().includes(filter.toLowerCase()) ||
      item.hostName.toLowerCase().includes(filter.toLowerCase()) ||
      item.prediction.toLowerCase().includes(filter.toLowerCase())
    );
  }, [tableData, filter]);

  // Helper function to determine the color class for the prediction badge.
  const getPredictionClass = (prediction) => {
    if (prediction.includes('Confirmed Exoplanet')) {
        return 'bg-green-500/20 text-green-300';
    }
    if (prediction.includes('Planet candidate')) {
        return 'bg-yellow-500/20 text-yellow-300';
    }
    if (prediction.includes('Non-Planet Candidate')) {
        return 'bg-red-500/20 text-red-400';
    }
    return 'bg-slate-600/30 text-slate-300';
  };
  
  // In a real multi-page app, this would trigger navigation.
  const handleGoBack = () => {
    // Reload the page and navigate back to home
    window.location.href = '/';
  };

  const handleReloadResults = () => {
    // Force reload the page to refresh the data
    window.location.reload();
  };

  return (
    <div id="response-page" className="bg-slate-900">
        <section id="response-page" className="py-20 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-white mb-4 font-orbitron">Analysis Results</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                The submitted data has been processed. Below are the predictions for each planetary candidate.
              </p>
            </div>

            <div className="max-w-5xl mx-auto bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-cyan-500/20 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filter by Planet Name, Host Name, or Prediction..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full sm:w-64 bg-slate-800 border border-slate-700 text-white rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleGoBack}
                    className="w-full sm:w-auto bg-slate-700 text-white font-bold py-2 px-6 rounded-md text-sm hover:bg-slate-600 transition-colors duration-300"
                  >
                    Analyze New Data
                  </button>
                  
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Planet Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Host Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Prediction</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800/50 divide-y divide-slate-700">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.planetName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.hostName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPredictionClass(item.prediction)}`}>
                            {item.prediction}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-400">No results found for your filter.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </section>
    </div>
  );
};

export default ResponsePage;

