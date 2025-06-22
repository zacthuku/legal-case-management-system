import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const MyCases = () => {
  const { currentUser, userCases, fetch_user_cases } = useContext(UserContext);

  useEffect(() => {
    if (currentUser) {
      fetch_user_cases(currentUser.role, currentUser.id);
    }
  }, [currentUser]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Cases</h1>
      {userCases.length === 0 ? (
        <p className="text-gray-500">No cases assigned yet.</p>
      ) : (
        <ul className="space-y-2">
          {userCases.map((caseItem) => (
            <li key={caseItem.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{caseItem.title}</h2>
              <p className="text-sm text-gray-600">{caseItem.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCases;
