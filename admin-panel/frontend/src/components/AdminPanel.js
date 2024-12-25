import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRegistration, setNewRegistration] = useState({
    name: "",
    email: "",
    phone: "",
    paymentAmount: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/registrations`);
      setRegistrations(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching registrations: ' + (error.response?.data?.message || error.message));
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/registrations/${id}`, { paymentStatus: status });
      setRegistrations(registrations.map(reg => 
        reg._id === id ? response.data : reg
      ));
      setError(null);
    } catch (error) {
      setError('Error updating payment status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleNewRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/registrations`, {
        ...newRegistration,
        paymentAmount: Number(newRegistration.paymentAmount)
      });
      setRegistrations([...registrations, response.data]);
      setNewRegistration({ name: "", email: "", phone: "", paymentAmount: "" });
      setShowModal(false);
      setError(null);
    } catch (error) {
      setError('Failed to create registration: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Club Admin Panel</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-6"
        >
          Add New Registration
        </button>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">New Registration</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleNewRegistration} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    value={newRegistration.name}
                    onChange={(e) => setNewRegistration({
                      ...newRegistration,
                      name: e.target.value
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    value={newRegistration.email}
                    onChange={(e) => setNewRegistration({
                      ...newRegistration,
                      email: e.target.value
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newRegistration.phone}
                    onChange={(e) => setNewRegistration({
                      ...newRegistration,
                      phone: e.target.value
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                  <input
                    type="number"
                    value={newRegistration.paymentAmount}
                    onChange={(e) => setNewRegistration({
                      ...newRegistration,
                      paymentAmount: e.target.value
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map((registration) => (
                <tr key={registration._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{registration._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{registration.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{registration.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{registration.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{registration.paymentAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-sm rounded-full ${
                      registration.paymentStatus === 'accepted' 
                        ? 'bg-green-100 text-green-800'
                        : registration.paymentStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{registration.registrationDate}</td>
                  <td className="px-6 py-4">
                    {registration.paymentStatus === 'pending' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handlePaymentVerification(registration._id, 'accepted')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handlePaymentVerification(registration._id, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;