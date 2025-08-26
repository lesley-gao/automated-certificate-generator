import React, { useState } from 'react';

export default function AuthStub() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loggedIn ? (
        <>
          <p className="mb-2">Logged in as <strong>Demo User</strong></p>
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setLoggedIn(false)}>
            Logout
          </button>
        </>
      ) : (
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setLoggedIn(true)}>
          Login
        </button>
      )}
    </div>
  );
}
