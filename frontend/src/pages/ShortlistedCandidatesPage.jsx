import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getShortlistedCandidates } from '../services/api';
import Chat from '../components/Chat';

const ShortlistedCandidatesPage = () => {
  const [groupedCandidates, setGroupedCandidates] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidates = await getShortlistedCandidates(token);
        setGroupedCandidates(candidates);
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
      <div className="space-y-8">
        {groupedCandidates.length > 0 ? (
          groupedCandidates.map((jobGroup) => (
            <div key={jobGroup._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">{jobGroup.jobTitle}</h2>
              <div className="space-y-4">
                {jobGroup.applicants.map((applicant) => (
                  <div key={applicant._id} className="flex justify-between items-center border-t pt-4">
                    <div>
                      <h3 className="text-lg font-semibold">{applicant.firstName} {applicant.lastName}</h3>
                      <p>Email: {applicant.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedApplicant(applicant)}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Chat
                    </button>
                  </div>
                ))}
              </div>
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
