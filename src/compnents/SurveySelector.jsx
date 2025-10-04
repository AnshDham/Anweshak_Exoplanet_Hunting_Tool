

const ChevronDownIcon = () => (
  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
  </svg>
);

const SurveySelector = ({ id, value, onChange, label }) => {
  const commonClasses = "w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-3 appearance-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow";

  return (
    <div className="mb-8">
      <label htmlFor={id} className="block text-xl text-cyan-300 font-semibold mb-3">
        {label}
      </label>
      <div className="relative">
        <select id={id} name="survey" value={value} onChange={onChange} className={commonClasses}>
          <option value="K2">K2 Survey</option>
          <option value="KOI">Kepler Object of Interest (KOI)</option>
          <option value="TESS">Transiting Exoplanet Survey Satellite (TESS)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
};

export default SurveySelector;