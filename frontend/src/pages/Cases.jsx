import React, { useEffect, useState } from 'react';
import CaseDetails from './CaseDetails';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
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
  }, []);

  if (selectedCaseId) {
    return (
      <CaseDetails
        selectedCaseId={selectedCaseId}
        onBack={() => setSelectedCaseId(null)}
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
            <h2 className="text-lg font-semibold text-blue-600">{c.title}</h2>
            <p className="text-sm text-gray-600 mt-1">Click to view details</p>
            <p
              className={`mt-2 text-sm font-semibold ${
                c.status === 'Open'
                  ? 'text-green-600'
                  : c.status === 'In Progress'
                  ? 'text-yellow-600'
                  : 'text-red-600'
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
