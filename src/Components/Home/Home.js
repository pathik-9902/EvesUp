import React from 'react';

function Home({ setUserState, fname }) {
  return (
    <div>
      <div>
        <h1>Welcome to the Event Management System</h1>
        {fname && <p>Hello, {fname}!</p>}
      </div>
    </div>
  );
}

export default Home;
