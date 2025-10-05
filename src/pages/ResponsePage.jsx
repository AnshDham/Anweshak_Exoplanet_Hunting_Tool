import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApiData from '../store/apidata.js';

/**
 * Enhanced component to display prediction results with optimized pagination for large datasets.
 * Handles 1000+ rows efficiently with 5 rows per page and improved UI.
 */
function ResponsePage() {
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const { data, isResponse, csvType } = useApiData();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); // Fixed to 5 per page, no dropdown
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  // Redirect to home on page reload/mount if no data
  useEffect(() => {
    if (!isResponse && !data) {
      navigate('/');
    }
  }, [isResponse, data, navigate]);

  console.log(data);
  console.log(isResponse);
  console.log(csvType);

  // Debounce filter input to improve performance on large datasets
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 300);
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

  // Enhanced sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      // Handle numeric sorting
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // Handle string sorting
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);
  
  // Reset to page 1 whenever the filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilter, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Enhanced prediction stats
  const stats = useMemo(() => {
    const confirmed = filteredData.filter(row => 
      String(row['Prediction']).toLowerCase().includes('confirmed exoplanet')
    ).length;
    const candidate = filteredData.filter(row => 
      String(row['Prediction']).toLowerCase().includes('planet candidate')
    ).length;
    const nonPlanet = filteredData.filter(row => 
      String(row['Prediction']).toLowerCase().includes('non-planet candidate')
    ).length;
    
    return { total: filteredData.length, confirmed, candidate, nonPlanet };
  }, [filteredData]);

  const getPredictionClass = (prediction) => {
    const p = String(prediction).toLowerCase();
    if (p.includes('confirmed exoplanet')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (p.includes('planet candidate')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (p.includes('non-planet candidate')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-slate-600/30 text-slate-300 border-slate-500/30';
  };

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Enhanced pagination with jump to page
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // PDF Download Function
  const downloadAsPDF = () => {
    try {
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Exo-AI Analysis Report - ${csvType?.toUpperCase() || 'Unknown'} Dataset</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: white; color: black; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { margin: 0; color: #1f2937; font-size: 24px; }
            .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
            .stat-card { padding: 15px; background-color: #f9fafb; border-radius: 8px; text-align: center; }
            .stat-number { font-size: 24px; font-weight: bold; color: #1f2937; }
            .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .prediction-confirmed { background-color: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; }
            .prediction-candidate { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; }
            .prediction-non { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Exo-AI Analysis Report</h1>
            <p>Dataset: ${csvType?.toUpperCase() || 'Unknown'} | Generated: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat-card"><div class="stat-number">${stats.total}</div><div class="stat-label">Total Records</div></div>
            <div class="stat-card"><div class="stat-number">${stats.confirmed}</div><div class="stat-label">Confirmed</div></div>
            <div class="stat-card"><div class="stat-number">${stats.candidate}</div><div class="stat-label">Candidates</div></div>
            <div class="stat-card"><div class="stat-number">${stats.nonPlanet}</div><div class="stat-label">Non-Planet</div></div>
          </div>

          <table>
            <thead>
              <tr>${allColumns.map(col => `<th>${col}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${sortedData.map(row => `
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
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
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

  const downloadAsCSV = () => {
    try {
      const csvContent = [
        allColumns.join(','),
        ...sortedData.map(row => 
          allColumns.map(col => {
            const value = String(row[col] || '');
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
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Error generating CSV. Please try again.');
    }
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white min-h-[400px]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <h2 className="text-2xl font-bold mb-2 tracking-wider mt-6">ANALYZING STARLIGHT...</h2>
      <p className="text-slate-400">Processing large dataset, please wait...</p>
    </div>
  );

  const StatCard = ({ title, value, color, percentage }) => (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
        </div>
        {percentage !== undefined && (
          <div className={`text-xs ${color} bg-current/10 px-2 py-1 rounded-full`}>
            {percentage}%
          </div>
        )}
      </div>
    </div>
  );

  const EnhancedPagination = () => {
    if (totalPages <= 1) return null;
    
    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = Math.min(currentPage * rowsPerPage, sortedData.length);
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        {/* Results info */}
        <div className="text-sm text-slate-400">
          Showing <span className="font-medium text-white">{startRow}</span> to{' '}
          <span className="font-medium text-white">{endRow}</span> of{' '}
          <span className="font-medium text-white">{sortedData.length.toLocaleString()}</span> results
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === '...'}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                page === currentPage
                  ? 'bg-cyan-500 text-white'
                  : page === '...'
                  ? 'text-slate-500 cursor-default'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-200 relative z-10 pt-20 pb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {!isResponse ? <LoadingState /> : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Exo-AI Analysis Report</h1>
              <p className="text-slate-400">
                Dataset: <span className="text-cyan-400 font-medium uppercase">{csvType}</span> • 
                Total Records: <span className="text-white font-medium">{stats.total.toLocaleString()}</span>
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Total Objects" 
                value={stats.total} 
                color="text-cyan-400"
                percentage={100}
              />
              <StatCard 
                title="Confirmed Exoplanets" 
                value={stats.confirmed} 
                color="text-emerald-400"
                percentage={stats.total ? Math.round((stats.confirmed / stats.total) * 100) : 0}
              />
              <StatCard 
                title="Planet Candidates" 
                value={stats.candidate} 
                color="text-amber-400"
                percentage={stats.total ? Math.round((stats.candidate / stats.total) * 100) : 0}
              />
              <StatCard 
                title="Non-Planet Objects" 
                value={stats.nonPlanet} 
                color="text-red-400"
                percentage={stats.total ? Math.round((stats.nonPlanet / stats.total) * 100) : 0}
              />
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search across all columns..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  />
                  {debouncedFilter && (
                    <button
                      onClick={() => setFilter('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Download buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={downloadAsPDF}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    </svg>
                    PDF
                  </button>
                  <button
                    onClick={downloadAsCSV}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-900/70">
                    <tr>
                      {allColumns.map(header => (
                        <th
                          key={header}
                          onClick={() => handleSort(header)}
                          className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800/50 transition-colors select-none"
                        >
                          <div className="flex items-center gap-2">
                            {header}
                            {getSortIcon(header)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800/30 divide-y divide-slate-700">
                    {paginatedData.map((row, index) => (
                      <tr 
                        key={row.id} 
                        className="hover:bg-slate-700/50 transition-colors duration-150"
                      >
                        {allColumns.map(col => (
                          <td key={col} className="px-6 py-4 whitespace-nowrap text-sm">
                            {col === 'Prediction' ? (
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPredictionClass(row[col])}`}>
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

                {/* Empty state */}
                {sortedData.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-500 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0120 12a8 8 0 10-2.343 5.656l.343.343" />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-lg">
                      {tableData.length > 0 ? "No results match your search criteria" : "No data available"}
                    </p>
                    {debouncedFilter && (
                      <button
                        onClick={() => setFilter('')}
                        className="mt-2 text-cyan-400 hover:text-cyan-300 underline"
                      >
                        Clear search filter
                      </button>
                    )}
                  </div>
                )}
              </div>

              <EnhancedPagination />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponsePage;