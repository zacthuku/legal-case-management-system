import React, { useEffect, useState, useContext } from 'react';
import CaseDetails from './CaseDetails';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const { currentUser, token } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) return;

    // Allow only lawyers and clients
    if (currentUser.role === 'admin') {
      toast.error('Admins cannot access My Cases.');
      return;
    }

    // Determine API endpoint
    let endpoint = null;
    if (currentUser.role === 'lawyer') endpoint = 'lawyer/cases';
    else if (currentUser.role === 'client') endpoint = 'client/cases';
    else return;

    fetch(`http://127.0.0.1:5000/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCases(data);
        else toast.error('Failed to load your cases');
      })
      .catch(() => toast.error('Error fetching your cases.'));
  }, [currentUser, token]);

  if (!currentUser || currentUser.role === 'admin') {
    return <div className="p-8 text-red-500">Access denied.</div>;
  }

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
      <h1 className="text-2xl font-bold mb-4">My Cases</h1>
      <p className="text-gray-600 mb-6">
        Only visible to you as a {currentUser.role}.
      </p>
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

export default MyCases;
