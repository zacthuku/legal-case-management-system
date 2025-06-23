import React, { useEffect, useState } from 'react';
import CaseDetails from './CaseDetails';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchCases = () => {
    fetch('http://127.0.0.1:5000/cases', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCases(data);
        else console.error('Unexpected response format', data);
      })
      .catch((err) => console.error('Failed to fetch cases:', err));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  if (selectedCaseId) {
    return (
      <CaseDetails
        selectedCaseId={selectedCaseId}
        onBack={() => {
          setSelectedCaseId(null);
          fetchCases(); // Refresh data when returning
        }}
      />
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Cases</h1>
      <p className="text-gray-600 mb-6">Visible to all logged-in users.</p>
      <div className="grid gap-4">
        {cases.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCaseId(c.id)}
            className="text-left block p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition"
          >
            <h2 className="text-lg font-semibold text-blue-700">{c.title}</h2>
            <p className="text-sm text-gray-600 mt-1">Click to view details</p>
            <p
             className={`px-2 py-1 rounded-full font-semibold text-sm inline-block ${
      c.status === 'Open'
        ? 'bg-green-100 text-green-700'
        : c.status === 'In Progress'
        ? 'bg-blue-100 text-blue-900'
        : c.status === 'Closed'
        ? 'bg-red-100 text-red-700'
        : 'bg-gray-100 text-blue-700'
        
    }`}
            >
              Status: {c.status}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Cases;
