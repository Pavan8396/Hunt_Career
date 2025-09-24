import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getShortlistedCandidates } from '../services/api';
import Chat from '../components/Chat';

const ShortlistedCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const shortlistedCandidates = await getShortlistedCandidates(token);
        setCandidates(shortlistedCandidates);
      } catch (error) {
        console.error('Failed to fetch shortlisted candidates:', error);
      }
    };
    if (token) {
      fetchCandidates();
    }
  }, [token]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shortlisted Candidates</h1>
      <div className="space-y-4">
        {candidates.length > 0 ? (
          candidates.map((app) => (
            <div key={app._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{app.applicant.firstName} {app.applicant.lastName}</h3>
                <p>Applied for: {app.job.title}</p>
                <p>Email: {app.applicant.email}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(app.applicant)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Chat
              </button>
            </div>
          ))
        ) : (
          <p>No shortlisted candidates to display.</p>
        )}
      </div>
      {selectedApplicant && (
        <Chat applicant={selectedApplicant} employer={user} />
      )}
    </div>
  );
};

export default ShortlistedCandidatesPage;
