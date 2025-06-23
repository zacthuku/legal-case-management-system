import React, { useEffect, useState, useContext } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const CaseDetails = ({ selectedCaseId, onBack }) => {
  const [caseData, setCaseData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState('');

  const { currentUser } = useContext(UserContext);
  const token = localStorage.getItem('token');

  // Fetch case, comments, and documents
  useEffect(() => {
    if (!selectedCaseId) return;

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch case data
    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch case details');
        return res.json();
      })
      .then(data => {
        setCaseData(data);
        setStatus(data.status);
      })
      .catch(err => console.error('Case fetch error:', err));

    // Fetch comments
    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/comments`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
      })
      .then(setComments)
      .catch(err => console.error('Comments fetch error:', err));

    // Fetch documents
    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/documents`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch documents');
        return res.json();
      })
      .then(setDocuments)
      .catch(err => console.error('Documents fetch error:', err));
  }, [selectedCaseId]);

  // Add new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to post comment');
        return res.json();
      })
      .then(data => {
        setComments(prev => [...prev, data]);
        setNewComment('');
      })
      .catch(err => {
        console.error('Post comment error:', err);
        toast.error('Error posting comment');
      });
  };

  // Admin status update
  const handleStatusUpdate = () => {
    fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Status update failed');
        return res.json();
      })
      .then((data) => {
        setCaseData((prev) => ({ ...prev, status: data.status }));
        toast.success('Case status updated');
      })
      .catch(err => {
        console.error(err);
        toast.error('Error updating status');
      });
  };

  // File selection handler
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    toast.info('Files selected. Click "Save Files" to upload.');
  };

  // Remove file from preview
  const handleRemoveFile = (index) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    toast.warning('File removed from queue.');
  };

  // Confirm upload
  const handleSaveFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('documents', file));

    try {
      const res = await fetch(`http://127.0.0.1:5000/cases/${selectedCaseId}/documents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const uploaded = await res.json();
      setDocuments((prev) => [...prev, uploaded]);
      setSelectedFiles([]);
      toast.success('Documents uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Error uploading documents.');
    }
  };
const handleDeleteDocument = async (docId) => {
  try {
    const res = await fetch(`http://127.0.0.1:5000/documents/${docId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      toast.success(data.success);
    } else {
      toast.error(data.error || "Failed to delete document.");
    }
  } catch (err) {
    console.error("Document delete error:", err);
    toast.error("Error deleting document.");
  }
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
        <span className="font-semibold">Status:</span>{' '}
        <span
          className={`px-2 py-1 rounded-full font-semibold text-sm inline-block ${
            caseData.status === 'Open'
              ? 'bg-green-100 text-green-700'
              : caseData.status === 'In Progress'
              ? 'bg-blue-100 text-blue-900'
              : caseData.status === 'Closed'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-blue-700'
          }`}
        >
          {caseData.status}
        </span>
      </p>

      {/* Documents */}
      <div className="mb-6">
  <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
  
  {documents.length > 0 ? (
    <ul className="list-disc ml-4">
      {documents.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {doc.filename}
          </a>
          {currentUser?.id === doc.uploaded_by && (
            <button
              onClick={() => handleDeleteDocument(doc.id)}
              className="ml-4 text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No documents uploaded.</p>
  )}

  {/* Show upload input only if user has permission AND case is not closed */}
  {(currentUser?.role === 'admin' ||
    (currentUser?.role === 'lawyer' && caseData?.lawyer_id === currentUser.id) ||
    (currentUser?.role === 'client' && caseData?.client_id === currentUser.id)) &&
    caseData?.status !== 'Closed' && (
    <>
      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="mt-4 block w-full text-sm text-gray-700
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Files to be uploaded:</h4>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span className="text-sm">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSaveFiles}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Save Files
          </button>
        </div>
      )}
    </>
  )}
</div>


      {/* Comments */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {comments.length === 0 && (
          <p className="text-gray-500 mb-4">No comments yet.</p>
        )}
        <ul className="space-y-2 mb-4">
          {comments.map((c) => (
            <li key={c.id} className="bg-gray-100 p-3 rounded relative">
              <p className="text-sm text-gray-800 mb-6">{c.content}</p>
              <span className="absolute bottom-1 right-2 text-xs text-blue-500 italic">
                — {c.role}
              </span>
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

      {/* Admin-only status update */}
      {currentUser?.role === 'admin' && (
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
