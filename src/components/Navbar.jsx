import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">TaskManager</span>
        </div>
        
        {user && (
          <div className="navbar-user-section">
            <span className="welcome-msg">
              Welcome, <span className="user-name">{user.name}</span>
            </span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
