import React, { useState, useEffect } from 'react';

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
      const response = await fetch(`${API_URL}/registrations`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRegistrations(data);
      setError(null);
    } catch (error) {
      setError('Error fetching registrations: ' + error.message);
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: status })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedRegistration = await response.json();
      setRegistrations(registrations.map(reg => 
        reg._id === id ? updatedRegistration : reg
      ));
      setError(null);
    } catch (error) {
      setError('Error updating payment status: ' + error.message);
    }
  };

  const handleNewRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newRegistration,
          paymentAmount: Number(newRegistration.paymentAmount)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRegistrations([...registrations, data]);
      setNewRegistration({ name: "", email: "", phone: "", paymentAmount: "" });
      setShowModal(false);
      setError(null);
    } catch (error) {
      setError('Failed to create registration: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-primary-light">
        <div className="text-xl text-primary-dark">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light">
      <header className="bg-primary-dark p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/club-logo.png" alt="Club Logo" className="h-12 w-auto" />
            <h1 className="text-3xl font-bold text-text-light">Xenia Admin Panel</h1>
          </div>
          <img src="/images/event-logo.JPEG" alt="Event Logo" className="h-12 w-auto" />
        </div>
      </header>

      <div className="p-4">
        <div className="max-w-7xl mx-auto bg-text-light rounded-lg shadow p-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-dark hover:bg-primary-dark/90 text-text-light font-semibold py-2 px-4 rounded mb-6"
          >
            Add New Registration
          </button>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {showModal && (
            <div className="fixed inset-0 bg-primary-dark/50 flex items-center justify-center">
              <div className="bg-text-light rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-primary-dark">New Registration</h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-primary-dark hover:text-primary-dark/80"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleNewRegistration} className="space-y-4">
                  <div>
                    <label className="block text-primary-dark text-sm font-bold mb-2">Name</label>
                    <input
                      type="text"
                      value={newRegistration.name}
                      onChange={(e) => setNewRegistration({
                        ...newRegistration,
                        name: e.target.value
                      })}
                      className="w-full p-2 border rounded focus:outline-none focus:border-primary-dark"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-dark text-sm font-bold mb-2">Email</label>
                    <input
                      type="email"
                      value={newRegistration.email}
                      onChange={(e) => setNewRegistration({
                        ...newRegistration,
                        email: e.target.value
                      })}
                      className="w-full p-2 border rounded focus:outline-none focus:border-primary-dark"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-dark text-sm font-bold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newRegistration.phone}
                      onChange={(e) => setNewRegistration({
                        ...newRegistration,
                        phone: e.target.value
                      })}
                      className="w-full p-2 border rounded focus:outline-none focus:border-primary-dark"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-dark text-sm font-bold mb-2">Amount</label>
                    <input
                      type="number"
                      value={newRegistration.paymentAmount}
                      onChange={(e) => setNewRegistration({
                        ...newRegistration,
                        paymentAmount: e.target.value
                      })}
                      className="w-full p-2 border rounded focus:outline-none focus:border-primary-dark"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-primary-dark hover:text-primary-dark/80 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-dark hover:bg-primary-dark/90 text-text-light font-semibold py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-dark/10">
              <thead>
                <tr className="bg-primary-light">
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-dark uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-text-light divide-y divide-primary-dark/10">
                {registrations.map((registration) => (
                  <tr key={registration._id} className="hover:bg-primary-light/50">
                    <td className="px-6 py-4 text-sm text-text-dark">{registration._id}</td>
                    <td className="px-6 py-4 text-sm text-text-dark">{registration.name}</td>
                    <td className="px-6 py-4 text-sm text-text-dark">{registration.email}</td>
                    <td className="px-6 py-4 text-sm text-text-dark">{registration.phone}</td>
                    <td className="px-6 py-4 text-sm text-text-dark">₹{registration.paymentAmount}</td>
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
                    <td className="px-6 py-4 text-sm text-text-dark">{registration.registrationDate}</td>
                    <td className="px-6 py-4">
                      {registration.paymentStatus === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handlePaymentVerification(registration._id, 'accepted')}
                            className="bg-green-500 hover:bg-green-600 text-text-light px-3 py-1 rounded text-sm font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handlePaymentVerification(registration._id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-text-light px-3 py-1 rounded text-sm font-medium"
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
    </div>
  );
};

export default AdminPanel;