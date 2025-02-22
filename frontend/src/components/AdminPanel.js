import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const AdminPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

const API_URL = 'https://admin-panel-wz40.onrender.com/api';


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [participantsRes, eventsRes, usersRes, teamsRes] = await Promise.all([
        fetch(`${API_URL}/participants`),
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/teams`)
      ]);

      if (!participantsRes.ok) throw new Error('Failed to fetch participants');
      if (!eventsRes.ok) throw new Error('Failed to fetch events');
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      if (!teamsRes.ok) throw new Error('Failed to fetch teams');

      const participantsData = await participantsRes.json();
      const eventsData = await eventsRes.json();
      const usersData = await usersRes.json();
      const teamsData = await teamsRes.json();

      setParticipants(participantsData);
      setEvents(eventsData);
      setUsers(usersData);
      setTeams(teamsData);
      setError(null);
    } catch (error) {
      setError(`Error fetching data: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (id) => {
    try {
      setLoadingStates(prev => ({ ...prev, [id]: true }));
      const response = await fetch(`${API_URL}/participants/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const updatedParticipant = await response.json();
      setParticipants(participants.map(part => 
        part._id === id ? updatedParticipant : part
      ));
    } catch (error) {
      setError(`Error updating verification status: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
      
      const aValue = a[sortConfig.key].toString().toLowerCase();
      const bValue = b[sortConfig.key].toString().toLowerCase();
      
      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  };

  const filterParticipants = () => {
    return participants.filter(participant => {
      const matchesEvent = selectedEvent === 'all' || participant.eventId?._id === selectedEvent;
      const matchesTeam = selectedTeam === 'all' || participant.teamId?._id === selectedTeam;
      const matchesSearch = searchTerm === '' || 
        Object.values(participant).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesEvent && matchesTeam && matchesSearch;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search participants..."
              className="px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event._id} value={event._id}>{event.name}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border rounded-lg"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </div>

          {/* Participants Table */}
          <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Participants</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th className="p-3 text-left">Event</th>
                    <th className="p-3 text-left">Team</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Mobile</th>
                    <th className="p-3 text-left">College</th>
                    <th className="p-3 text-left">Class</th>
                    <th className="p-3 text-left">Roll No</th>
                    <th className="p-3 text-left">Transaction ID</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortData(filterParticipants()).map((participant) => (
                    <tr key={participant._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{participant.userId?.name || 'N/A'}</td>
                      <td className="p-3">{participant.eventId?.name || 'N/A'}</td>
                      <td className="p-3">{participant.teamId?.name || 'N/A'}</td>
                      <td className="p-3">{participant.email}</td>
                      <td className="p-3">{participant.mobile}</td>
                      <td className="p-3">{participant.college}</td>
                      <td className="p-3">{participant.classname}</td>
                      <td className="p-3">{participant.rollNo}</td>
                      <td className="p-3">{participant.transactionID}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full flex items-center gap-2 ${
                          participant.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {participant.isVerified ? (
                            <><CheckCircle className="h-4 w-4" /> Verified</>
                          ) : (
                            <><AlertCircle className="h-4 w-4" /> Pending</>
                          )}
                        </span>
                      </td>
                      <td className="p-3">
                        {!participant.isVerified && (
                          <button 
                            className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                              loadingStates[participant._id]
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                            onClick={() => handlePaymentVerification(participant._id)}
                            disabled={loadingStates[participant._id]}
                          >
                            {loadingStates[participant._id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Events Table */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Events</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Location</th>
                    <th className="p-3 text-left">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{event.name}</td>
                      <td className="p-3">{event.description}</td>
                      <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="p-3">{event.location}</td>
                      <td className="p-3">{event.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teams Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Teams</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Leader</th>
                    <th className="p-3 text-left">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{team.name}</td>
                      <td className="p-3">{team.leadername }</td>
                      <td className="p-3">{team.eventId?.name || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
