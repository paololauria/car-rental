import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            {showSidebar && (
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/">Homepage</Link></li>
                <li><Link to="/cars">Auto</Link></li>
                <li><Link to="/rentals">Noleggi</Link></li>
                <li><Link to="/users">Utenti</Link></li>
              </ul>
            )}
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">ParkWiNK</a>
        </div>
        <div className="navbar-end">
      
        </div>
      </div>
    </div>
  );
}

export default Navbar;
