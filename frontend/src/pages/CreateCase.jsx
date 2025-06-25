import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { api_url } from '../config.json';
const CreateCase = () => {
  const { token, currentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    lawyer_id: '',
    status: 'open',
  });
  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    const fetchUsers = async (endpoint, setter) => {
      try {
        const res = await fetch(`${api_url}/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const data = await res.json();
        setter(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (token) {
      fetchUsers('clients', setClients);
      fetchUsers('lawyers', setLawyers);
    }
  }, [token]);

  if (!currentUser || currentUser.role !== 'admin') {
    return <p className="text-center mt-10 text-red-500">Access Denied. Admins only.</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api_url}/admin/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) toast.error(data.error);
      else {
        toast.success('Case created successfully!');
        setFormData({
          title: '',
          description: '',
          client_id: '',
          lawyer_id: '',
          status: 'open',
        });
      }
    } catch (err) {
      toast.error('Failed to create case.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Create New Case</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Client */}
        <div>
          <label htmlFor="client_id" className="block text-sm font-medium">Client</label>
          <select
            id="client_id"
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.username} ({client.email})
              </option>
            ))}
          </select>
        </div>

        {/* Lawyer */}
        <div>
          <label htmlFor="lawyer_id" className="block text-sm font-medium">Lawyer</label>
          <select
            id="lawyer_id"
            name="lawyer_id"
            value={formData.lawyer_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a Lawyer</option>
            {lawyers.map((lawyer) => (
              <option key={lawyer.id} value={lawyer.id}>
                {lawyer.username} ({lawyer.email})
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
};

export default CreateCase;
