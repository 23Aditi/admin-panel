// import React, { useState, useEffect } from 'react';

// const AdminPanel = () => {
//   const [registrations, setRegistrations] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [showRegistrationModal, setShowRegistrationModal] = useState(false);
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [showTeamModal, setShowTeamModal] = useState(false);
//   const [newRegistration, setNewRegistration] = useState({
//     userId: '',
//     eventId: '',
//     teamId: '',
//     email: '',
//     mobile: '',
//     transactionID: '',
//   });
//   const [newEvent, setNewEvent] = useState({
//     name: '',
//     description: '',
//     date: '',
//     location: '',
//     capacity: 100,
//   });
//   const [newTeam, setNewTeam] = useState({
//     name: '',
//     leader: '',
//     members: [],
//     event: '',
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_URL = 'http://localhost:5000/api';

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [registrationsRes, eventsRes, usersRes, teamsRes] = await Promise.all([
//         fetch(`${API_URL}/registrations`),
//         fetch(`${API_URL}/events`),
//         fetch(`${API_URL}/users`),
//         fetch(`${API_URL}/teams`)
//       ]);

//       const registrationsData = await registrationsRes.json();
//       const eventsData = await eventsRes.json();
//       const usersData = await usersRes.json();
//       const teamsData = await teamsRes.json();

//       setRegistrations(registrationsData);
//       setEvents(eventsData);
//       setUsers(usersData);
//       setTeams(teamsData);
//       setError(null);
//     } catch (error) {
//       setError('Error fetching data: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentVerification = async (id, status) => {
//     try {
//       const response = await fetch(`${API_URL}/registrations/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           paymentStatus: status,
//           isVerified: status === 'accepted' 
//         })
//       });
      
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//       const updatedRegistration = await response.json();
//       setRegistrations(registrations.map(reg => 
//         reg._id === id ? updatedRegistration : reg
//       ));
//     } catch (error) {
//       setError('Error updating payment status: ' + error.message);
//     }
//   };

//   const handleNewRegistration = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_URL}/registrations`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...newRegistration,
//           paymentStatus: 'pending',
//           isVerified: false
//         })
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       setRegistrations([...registrations, data]);
//       setNewRegistration({ 
//         userId: '', 
//         eventId: '', 
//         teamId: '',
//         email: '', 
//         mobile: '', 
//         transactionID: '' 
//       });
//       setShowRegistrationModal(false);
//     } catch (error) {
//       setError('Failed to create registration: ' + error.message);
//     }
//   };

//   const handleNewEvent = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_URL}/events`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newEvent)
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       setEvents([...events, data]);
//       setNewEvent({
//         name: '',
//         description: '',
//         date: '',
//         location: '',
//         capacity: 100,
//       });
//       setShowEventModal(false);
//     } catch (error) {
//       setError('Failed to create event: ' + error.message);
//     }
//   };

//   const handleNewTeam = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_URL}/teams`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newTeam)
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       setTeams([...teams, data]);
//       setNewTeam({
//         name: '',
//         leader: '',
//         members: [],
//         event: '',
//       });
//       setShowTeamModal(false);
//     } catch (error) {
//       setError('Failed to create team: ' + error.message);
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <div className="bg-white shadow-md rounded-lg">
//         <div className="p-4 border-b">
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//         </div>
//         <div className="p-4">
//           <div className="flex space-x-4 mb-4">
//             <button 
//               onClick={() => setShowRegistrationModal(true)}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Add New Registration
//             </button>
//             <button 
//               onClick={() => setShowEventModal(true)}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             >
//               Create New Event
//             </button>
//             <button 
//               onClick={() => setShowTeamModal(true)}
//               className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
//             >
//               Create New Team
//             </button>
//           </div>

//           {error && <div className="text-red-500 mb-4">{error}</div>}

//           {/* Registrations Table */}
//           <div className="bg-white shadow rounded-lg mb-6">
//             <div className="p-4 border-b">
//               <h2 className="text-xl font-semibold">Registrations</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-3 text-left">User</th>
//                     <th className="p-3 text-left">Event</th>
//                     <th className="p-3 text-left">Team</th>
//                     <th className="p-3 text-left">Email</th>
//                     <th className="p-3 text-left">Mobile</th>
//                     <th className="p-3 text-left">Transaction ID</th>
//                     <th className="p-3 text-left">Payment Status</th>
//                     <th className="p-3 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {registrations.map((registration) => (
//                     <tr key={registration._id} className="border-b">
//                       <td className="p-3">{registration.userId?.name || 'N/A'}</td>
//                       <td className="p-3">{registration.eventId?.name || 'N/A'}</td>
//                       <td className="p-3">{registration.teamId?.name || 'N/A'}</td>
//                       <td className="p-3">{registration.email}</td>
//                       <td className="p-3">{registration.mobile}</td>
//                       <td className="p-3">{registration.transactionID}</td>
//                       <td className="p-3">
//                         <span className={`px-2 py-1 rounded ${
//                           registration.paymentStatus === 'accepted' ? 'bg-green-200 text-green-800' :
//                           registration.paymentStatus === 'rejected' ? 'bg-red-200 text-red-800' :
//                           'bg-yellow-200 text-yellow-800'
//                         }`}>
//                           {registration.paymentStatus}
//                         </span>
//                       </td>
//                       <td className="p-3">
//                         {registration.paymentStatus === 'pending' && (
//                           <div className="flex space-x-2">
//                             <button 
//                               className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                               onClick={() => handlePaymentVerification(registration._id, 'accepted')}
//                             >
//                               Accept
//                             </button>
//                             <button 
//                               className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                               onClick={() => handlePaymentVerification(registration._id, 'rejected')}
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Events Table */}
//           <div className="bg-white shadow rounded-lg mb-6">
//             <div className="p-4 border-b">
//               <h2 className="text-xl font-semibold">Events</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-3 text-left">Name</th>
//                     <th className="p-3 text-left">Description</th>
//                     <th className="p-3 text-left">Date</th>
//                     <th className="p-3 text-left">Location</th>
//                     <th className="p-3 text-left">Capacity</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {events.map((event) => (
//                     <tr key={event._id} className="border-b">
//                       <td className="p-3">{event.name}</td>
//                       <td className="p-3">{event.description}</td>
//                       <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
//                       <td className="p-3">{event.location}</td>
//                       <td className="p-3">{event.capacity}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Teams Table */}
//           <div className="bg-white shadow rounded-lg">
//             <div className="p-4 border-b">
//               <h2 className="text-xl font-semibold">Teams</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-3 text-left">Name</th>
//                     <th className="p-3 text-left">Leader</th>
//                     <th className="p-3 text-left">Members</th>
//                     <th className="p-3 text-left">Event</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {teams.map((team) => (
//                     <tr key={team._id} className="border-b">
//                       <td className="p-3">{team.name}</td>
//                       <td className="p-3">{team.leader?.name || 'N/A'}</td>
//                       <td className="p-3">
//                         {team.members?.map(member => member.name).join(', ') || 'No members'}
//                       </td>
//                       <td className="p-3">{team.event?.name || 'N/A'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Modals for creating registrations, events, and teams */}
//           {/* (Previous modal code would be placed here) */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;



import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newRegistration, setNewRegistration] = useState({
    userId: '',
    eventId: '',
    teamId: '',
    email: '',
    mobile: '',
    transactionID: '',
  });
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    capacity: 100,
  });
  const [newTeam, setNewTeam] = useState({
    name: '',
    leader: '',
    members: [],
    event: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [registrationsRes, eventsRes, usersRes, teamsRes] = await Promise.all([
        fetch(`${API_URL}/registrations`),
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/teams`)
      ]);

      const registrationsData = await registrationsRes.json();
      const eventsData = await eventsRes.json();
      const usersData = await usersRes.json();
      const teamsData = await teamsRes.json();

      setRegistrations(registrationsData);
      setEvents(eventsData);
      setUsers(usersData);
      setTeams(teamsData);
      setError(null);
    } catch (error) {
      setError('Error fetching data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentStatus: status,
          isVerified: status === 'accepted' 
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const updatedRegistration = await response.json();
      setRegistrations(registrations.map(reg => 
        reg._id === id ? updatedRegistration : reg
      ));
    } catch (error) {
      setError('Error updating payment status: ' + error.message);
    }
  };

  const handleNewRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRegistration,
          paymentStatus: 'pending',
          isVerified: false
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setRegistrations([...registrations, data]);
      setNewRegistration({ 
        userId: '', 
        eventId: '', 
        teamId: '',
        email: '', 
        mobile: '', 
        transactionID: '' 
      });
      setShowRegistrationModal(false);
    } catch (error) {
      setError('Failed to create registration: ' + error.message);
    }
  };

  const handleNewEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setEvents([...events, data]);
      setNewEvent({
        name: '',
        description: '',
        date: '',
        location: '',
        capacity: 100,
      });
      setShowEventModal(false);
    } catch (error) {
      setError('Failed to create event: ' + error.message);
    }
  };

  const handleNewTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setTeams([...teams, data]);
      setNewTeam({
        name: '',
        leader: '',
        members: [],
        event: '',
      });
      setShowTeamModal(false);
    } catch (error) {
      setError('Failed to create team: ' + error.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="p-4">
          <div className="flex space-x-4 mb-4">
            
            <button 
              onClick={() => setShowEventModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create New Event
            </button>
           
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Registrations Table */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Registrations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Event</th>
                    <th className="p-3 text-left">Team</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Mobile</th>
                    <th className="p-3 text-left">Transaction ID</th>
                    <th className="p-3 text-left">Payment Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration._id} className="border-b">
                      <td className="p-3">{registration.userId?.name || 'N/A'}</td>
                      <td className="p-3">{registration.eventId?.name || 'N/A'}</td>
                      <td className="p-3">{registration.teamId?.name || 'N/A'}</td>
                      <td className="p-3">{registration.email}</td>
                      <td className="p-3">{registration.mobile}</td>
                      <td className="p-3">{registration.transactionID}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded ${
                          registration.paymentStatus === 'accepted' ? 'bg-green-200 text-green-800' :
                          registration.paymentStatus === 'rejected' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {registration.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {registration.paymentStatus === 'pending' && (
                          <div className="flex space-x-2">
                            <button 
                              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              onClick={() => handlePaymentVerification(registration._id, 'accepted')}
                            >
                              Accept
                            </button>
                            <button 
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              onClick={() => handlePaymentVerification(registration._id, 'rejected')}
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
                    <tr key={event._id} className="border-b">
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
                    <th className="p-3 text-left">Members</th>
                    <th className="p-3 text-left">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team._id} className="border-b">
                      <td className="p-3">{team.name}</td>
                      <td className="p-3">{team.leader?.name || 'N/A'}</td>
                      <td className="p-3">
                        {team.members?.map(member => member.name).join(', ') || 'No members'}
                      </td>
                      <td className="p-3">{team.event?.name || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Registration Modal */}
          {showRegistrationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Create New Registration</h2>
                <form onSubmit={handleNewRegistration}>
                  <div className="mb-4">
                    <label className="block mb-2">User</label>
                    <select 
                      value={newRegistration.userId} 
                      onChange={(e) => setNewRegistration({...newRegistration, userId: e.target.value})}
                      className="w-full border rounded p-2"
                      required
                    >
                      <option value="">Select User</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Event</label>
                    <select 
                      value={newRegistration.eventId} 
                      onChange={(e) => setNewRegistration({...newRegistration, eventId: e.target.value})}
                      className="w-full border rounded p-2"
                      required
                    >
                      <option value="">Select Event</option>
                      {events.map(event => (
                        <option key={event._id} value={event._id}>{event.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Team (Optional)</label>
                    <select 
                      value={newRegistration.teamId} 
                      onChange={(e) => setNewRegistration({...newRegistration, teamId: e.target.value})}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Select Team</option>
                      {teams.map(team => (
                        <option key={team._id} value={team._id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
  <label className="block mb-2">Mobile</label>
  <input 
    type="tel" 
    value={newRegistration.mobile}
    onChange={(e) => setNewRegistration({...newRegistration, mobile: e.target.value})}
    className="w-full border rounded p-2"
    required
  />
</div>
<div className="mb-4">
  <label className="block mb-2">Transaction ID</label>
  <input 
    type="text" 
    value={newRegistration.transactionID}
    onChange={(e) => setNewRegistration({...newRegistration, transactionID: e.target.value})}
    className="w-full border rounded p-2"
    required
  />
</div>
<div className="flex justify-end space-x-2">
  <button 
    type="button" 
    onClick={() => setShowRegistrationModal(false)}
    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
  >
    Cancel
  </button>
  <button 
    type="submit" 
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Create Registration
  </button>
</div>
</form>
</div>
</div>
)}

{/* Event Modal */}
{showEventModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
<div className="bg-white p-6 rounded-lg w-96">
<h2 className="text-xl font-bold mb-4">Create New Event</h2>
<form onSubmit={handleNewEvent}>
<div className="mb-4">
  <label className="block mb-2">Name</label>
  <input 
    type="text" 
    value={newEvent.name}
    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
    className="w-full border rounded p-2"
    required
  />
</div>
<div className="mb-4">
  <label className="block mb-2">Description</label>
  <textarea 
    value={newEvent.description}
    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
    className="w-full border rounded p-2"
    required
  />
</div>
<div className="mb-4">
  <label className="block mb-2">Date</label>
  <input 
    type="date" 
    value={newEvent.date}
    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
    className="w-full border rounded p-2"
    required
  />
</div>
<div className="mb-4">
  <label className="block mb-2">Location</label>
  <input 
    type="text" 
    value={newEvent.location}
    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
    className="w-full border rounded p-2"
    required
  />
</div>
<div className="mb-4">
  <label className="block mb-2">Capacity</label>
  <input 
    type="number" 
    value={newEvent.capacity}
    onChange={(e) => setNewEvent({...newEvent, capacity: parseInt(e.target.value)})}
    className="w-full border rounded p-2"
    min="1"
    required
  />
</div>
<div className="flex justify-end space-x-2">
  <button 
    type="button" 
    onClick={() => setShowEventModal(false)}
    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
  >
    Cancel
  </button>
  <button 
    type="submit" 
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    Create Event
  </button>
</div>
</form>
</div>
</div>
)}

{/* Team Modal */}
{showTeamModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
<div className="bg-white p-6 rounded-lg w-96">
<h2 className="text-xl font-bold mb-4">Create New Team</h2>
<form onSubmit={handleNewTeam}>
<div className="mb-4">
  <label className="block mb-2">Team Name</label>
  <input 
    type="text" 
    value={newTeam.name}
    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
    className="w-full border rounded p-2"
    required
  />
</div>
<div className="mb-4">
  <label className="block mb-2">Team Leader</label>
  <select 
    value={newTeam.leader} 
    onChange={(e) => setNewTeam({...newTeam, leader: e.target.value})}
    className="w-full border rounded p-2"
    required
  >
    <option value="">Select Leader</option>
    {users.map(user => (
      <option key={user._id} value={user._id}>{user.name}</option>
    ))}
  </select>
</div>
<div className="mb-4">
  <label className="block mb-2">Team Members</label>
  <select 
    multiple
    value={newTeam.members} 
    onChange={(e) => {
      const selectedMembers = Array.from(e.target.selectedOptions, option => option.value);
      setNewTeam({...newTeam, members: selectedMembers});
    }}
    className="w-full border rounded p-2"
  >
    {users.map(user => (
      <option key={user._id} value={user._id}>{user.name}</option>
    ))}
  </select>
</div>
<div className="mb-4">
  <label className="block mb-2">Event</label>
  <select 
    value={newTeam.event} 
    onChange={(e) => setNewTeam({...newTeam, event: e.target.value})}
    className="w-full border rounded p-2"
    required
  >
    <option value="">Select Event</option>
    {events.map(event => (
      <option key={event._id} value={event._id}>{event.name}</option>
    ))}
  </select>
</div>
<div className="flex justify-end space-x-2">
  <button 
    type="button" 
    onClick={() => setShowTeamModal(false)}
    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
  >
    Cancel
  </button>
  <button 
    type="submit" 
    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
  >
    Create Team
  </button>
</div>
</form>
</div>
</div>
)}
</div>
</div>
</div>
  );
};

export default AdminPanel;