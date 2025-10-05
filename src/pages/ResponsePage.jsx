import React, { useState, useMemo, useEffect } from 'react';
import useApiData from '../store/apidata.js';

/**
 * A mandatory hook to simulate fetching data from a backend.
 * In a real app, this would live in '../store/apidata.js', but is included here
 * to create a self-contained, runnable component.
*/
// const useApiData = () => {
//   const [apiState, setApiState] = useState({ data: null, isResponse: false, csvType: null });

//   useEffect(() => {
//     // Reset state before fetching to show loading indicator
//     setApiState({ data: null, isResponse: false, csvType: null });
    
//     const timer = setTimeout(() => {
//       // This function simulates a backend response
//       const generateMockData = () => {
//         const numRows = 5000;
//         const csvTypes = ['k2', 'koi', 'tess'];
//         // Randomly pick a CSV type to simulate different API responses
//         const selectedCsvType = csvTypes[Math.floor(Math.random() * csvTypes.length)];
//         let data = {};
        
//         const predictions = Array.from({ length: numRows }, () => {
//             const options = ["Confirmed Exoplanet", "Planet candidate", "Non-Planet Candidate"];
//             return options[Math.floor(Math.random() * options.length)];
//         });

//         // Generate data structure based on the randomly selected CSV type
//         switch (selectedCsvType) {
//           case 'koi':
//             data = {
//               "Kepler ID": Array.from({ length: numRows }, (_, i) => 10797460 + i),
//               "KOI Name": Array.from({ length: numRows }, (_, i) => `K00752.${String(i + 1).padStart(2, '0')}`),
//               "Prediction": predictions,
//             };
//             break;
//           case 'tess':
//             data = {
//               "TESS Object of Interest": Array.from({ length: numRows }, (_, i) => `${1000 + i}.01`),
//               "Community TOI Alias": Array.from({ length: numRows }, (_, i) => `${50365310 + i}.01`),
//               "Prediction": predictions,
//             };
//             break;
//           case 'k2':
//           default:
//             data = {
//               "Planet Name": Array.from({ length: numRows }, (_, i) => `P-${1000 + i}`),
//               "Host Name": Array.from({ length: numRows }, (_, i) => `H-${200 + i}`),
//               "Prediction": predictions,
//             };
//             break;
//         }
//         return { data, csvType: selectedCsvType };
//       };

//       const { data, csvType } = generateMockData();
      
//       setApiState({
//         data: data,
//         isResponse: true,
//         csvType: csvType
//       });
//     }, 1500); // 1.5-second delay to simulate network request

//     return () => clearTimeout(timer); // Cleanup on unmount
//   }, []); // Empty dependency array ensures this runs only once on mount

//   return apiState;
// };


/**
 * A standalone component to display the prediction results fetched from a backend.
 * It is designed to handle thousands of rows efficiently and adapt to different column structures.
*/
function App() {
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const { data, isResponse, csvType } = useApiData();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  console.log(data);
  console.log(isResponse);
  console.log(csvType);

  // Debounce filter input to improve performance on large datasets
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 300); // Wait 300ms after user stops typing
    return () => clearTimeout(handler);
  }, [filter]);
  
  const allColumns = useMemo(() => data ? Object.keys(data) : [], [data]);

  const tableData = useMemo(() => {
    if (!data || allColumns.length === 0) return [];
    const numRows = data[allColumns[0]]?.length || 0;
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const row = { id: `${csvType}-${i}` };
      for (const col of allColumns) {
        row[col] = data[col]?.[i] ?? 'N/A';
      }
      rows.push(row);
    }
    return rows;
  }, [data, allColumns, csvType]);

  const filteredData = useMemo(() => {
    if (!debouncedFilter) return tableData;
    const lowercasedFilter = debouncedFilter.toLowerCase();
    return tableData.filter(row => 
      allColumns.some(col => 
        String(row[col]).toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [tableData, debouncedFilter, allColumns]);
  
  // Reset to page 1 whenever the filter changes
  useEffect(() => {
      setCurrentPage(1);
  },[debouncedFilter]);

  const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const getPredictionClass = (prediction) => {
    const p = String(prediction).toLowerCase();
    if (p.includes('confirmed exoplanet')) return 'bg-green-500/20 text-green-400';
    if (p.includes('planet candidate')) return 'bg-yellow-500/20 text-yellow-400';
    if (p.includes('non-planet candidate')) return 'bg-red-500/20 text-red-400';
    return 'bg-slate-600/30 text-slate-300';
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white">
        <svg className="animate-spin h-12 w-12 text-cyan-400 mb-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-2xl font-bold mb-2 tracking-wider">ANALYZING STARLIGHT...</h2>
        <p className="text-slate-400">Please wait while we process the results from the backend.</p>
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between text-sm text-slate-400 mt-6">
            <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
                Previous
            </button>
            <span>Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages.toLocaleString()}</span></span>
            <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
            </button>
        </div>
    );
  };

  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, filteredData.length);

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-200 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <main className="py-12 md:py-20 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6">
          {!isResponse ? <LoadingState /> : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Exo-AI Analysis Report</h1>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                  Processed results from the <span className="font-medium text-cyan-400 uppercase">{csvType}</span> dataset.
                </p>
              </div>

              <div className="max-w-7xl mx-auto bg-slate-800/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl shadow-slate-900/50">
                <div className="flex justify-center mb-6">
                  <div className="relative w-full md:w-auto">
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                      type="text"
                      placeholder="Filter results..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full md:w-96 bg-slate-900/50 border border-slate-700 text-white rounded-lg pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="text-sm text-slate-400 mb-4 px-1">
                  Showing rows <span className="font-bold text-white">{filteredData.length > 0 ? startRow.toLocaleString() : 0}</span>-
                  <span className="font-bold text-white">{endRow.toLocaleString()}</span> of <span className="font-bold text-white">{filteredData.length.toLocaleString()}</span>
                </div>
                
                <div className="overflow-auto max-h-[60vh] rounded-lg border border-slate-700/80">
                  <table className="min-w-full divide-y divide-slate-700 text-left">
                    <thead className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10">
                      <tr>
                        {allColumns.map(header => (
                          <th key={header} scope="col" className="px-6 py-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-slate-800/50 divide-y divide-slate-700">
                      {paginatedData.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-700/50 transition-colors duration-200">
                           {allColumns.map(col => (
                              <td key={col} className="px-6 py-4 whitespace-nowrap text-sm">
                                  {col === 'Prediction' ? (
                                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPredictionClass(row[col])}`}>
                                          {row[col]}
                                      </span>
                                  ) : (
                                      <span className="text-slate-300">{row[col]}</span>
                                  )}
                              </td>
                           ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredData.length === 0 && (
                      <div className="text-center py-16 bg-slate-800/50">
                          <p className="text-slate-400">{tableData.length > 0 ? "No results found for your filter." : "No data to display."}</p>
                      </div>
                  )}
                </div>
                <Pagination />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

