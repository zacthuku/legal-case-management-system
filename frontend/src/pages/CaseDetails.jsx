import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const CaseDetails = ({ selectedCaseId, onBack }) => {
  const [caseData, setCaseData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!selectedCaseId) return;

    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCaseData(data);
        setStatus(data.status);
      });

    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setComments(data));

    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDocuments(data));
  }, [selectedCaseId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments((prev) => [...prev, data]);
        setNewComment('');
      });
  };

  const handleStatusUpdate = () => {
    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCaseData((prev) => ({ ...prev, status: data.status }));
      });
  };

  if (!caseData) return <div className="p-8">Loading case details...</div>;

  return (
    <div className="p-8">
      <button onClick={onBack} className="flex items-center text-blue-600 mb-4">
        <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Cases
      </button>

      <h2 className="text-2xl font-bold mb-2">{caseData.title}</h2>
      <p className="text-gray-700 mb-2">{caseData.description}</p>
      <p className="text-sm mb-4">
        <span className="font-semibold">Status:</span> {caseData.status}
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
        {documents.length > 0 ? (
          <ul className="list-disc ml-4">
            {documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {doc.filename}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No documents uploaded.</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        <ul className="space-y-2 mb-4">
          {comments.map((c) => (
            <li key={c.id} className="bg-gray-100 p-2 rounded">
              <p className="text-sm text-gray-800">{c.text}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add comment..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </form>
      </div>

      {caseData.role === 'admin' && (
        <div className="mt-6">
          <h4 className="font-semibold mb-1">Change Status</h4>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            className="ml-2 bg-green-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default CaseDetails;
