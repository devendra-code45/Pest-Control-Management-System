import React, { useState } from 'react';
import ComplaintManagement from './Pages/complaint/complaintmanagement.jsx';
import NewComplaint from './Pages/complaint/newcomplaint.jsx';
import './App.css';

// ----------------------------------------------------------------------------
// Temporary dev-only preview shell.
// Your real project already has Sidebar / Navbar / Routing — this file just
// gives you a quick way to toggle between the two complaint pages while you
// wire up the actual routes (e.g. React Router).
// ----------------------------------------------------------------------------

function App() {
  const [activePage, setActivePage] = useState('list');

  return (
    <div className="preview-app">
      <div className="preview-app__switcher">
        <button
          type="button"
          className={`preview-app__tab ${activePage === 'list' ? 'preview-app__tab--active' : ''}`}
          onClick={() => setActivePage('list')}
        >
          Complaint Management
        </button>
        <button
          type="button"
          className={`preview-app__tab ${activePage === 'new' ? 'preview-app__tab--active' : ''}`}
          onClick={() => setActivePage('new')}
        >
          New Complaint
        </button>
      </div>

      <div className="preview-app__content">
        {activePage === 'list' ? <ComplaintManagement /> : <NewComplaint />}
      </div>
    </div>
  );
}

export default App;