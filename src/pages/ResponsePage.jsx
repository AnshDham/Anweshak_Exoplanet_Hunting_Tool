import React, { useState, useMemo, useEffect } from 'react';
import useApiData from '../store/apidata.js';

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

  // PDF Download Function
  const downloadAsPDF = () => {
    try {
      // Create a new window for the PDF content
      const printWindow = window.open('', '_blank');
      
      // Generate HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Exo-AI Analysis Report - ${csvType?.toUpperCase() || 'Unknown'} Dataset</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background: white;
              color: black;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #1f2937;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0 0 0;
              color: #6b7280;
              font-size: 14px;
            }
            .summary {
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f9fafb;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .summary p {
              margin: 5px 0;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 8px;
              text-align: left;
              word-wrap: break-word;
            }
            th {
              background-color: #f3f4f6;
              font-weight: bold;
              color: #1f2937;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .prediction-confirmed {
              background-color: #dcfce7;
              color: #166534;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
            }
            .prediction-candidate {
              background-color: #fef3c7;
              color: #92400e;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
            }
            .prediction-non {
              background-color: #fee2e2;
              color: #991b1b;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Exo-AI Analysis Report</h1>
            <p>Dataset: ${csvType?.toUpperCase() || 'Unknown'} | Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="summary">
            <p><strong>Total Records:</strong> ${filteredData.length.toLocaleString()}</p>
            <p><strong>Filter Applied:</strong> ${debouncedFilter || 'None'}</p>
            <p><strong>Columns:</strong> ${allColumns.join(', ')}</p>
          </div>

          <table>
            <thead>
              <tr>
                ${allColumns.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(row => `
                <tr>
                  ${allColumns.map(col => {
                    const value = row[col];
                    if (col === 'Prediction') {
                      const p = String(value).toLowerCase();
                      let className = '';
                      if (p.includes('confirmed exoplanet')) className = 'prediction-confirmed';
                      else if (p.includes('planet candidate')) className = 'prediction-candidate';
                      else if (p.includes('non-planet candidate')) className = 'prediction-non';
                      
                      return `<td><span class="${className}">${value}</span></td>`;
                    }
                    return `<td>${value}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>This report was generated by Exo-AI Analysis System</p>
            <p>Page 1 of 1 | Total Records: ${filteredData.length.toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;

      // Write content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // CSV Download Function (bonus feature)
  const downloadAsCSV = () => {
    try {
      const csvContent = [
        // Header row
        allColumns.join(','),
        // Data rows
        ...filteredData.map(row => 
          allColumns.map(col => {
            const value = String(row[col] || '');
            // Escape commas and quotes in CSV
            return value.includes(',') || value.includes('"') 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `exo-ai-analysis-${csvType || 'data'}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Error generating CSV. Please try again.');
    }
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
                
                {/* Search and Download Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
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
                  
                  {/* Download Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={downloadAsPDF}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                        <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.701 19.701 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.716 5.716 0 0 1-.911-.95 11.642 11.642 0 0 0-1.997.406 11.311 11.311 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.793.793 0 0 1-.58.029z"/>
                      </svg>
                      Download PDF
                    </button>
                    
                    <button
                      onClick={downloadAsCSV}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                      </svg>
                      Download CSV
                    </button>
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