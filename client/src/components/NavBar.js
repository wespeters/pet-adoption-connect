import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ loggedInUser, handleLogout }) {
    return (
        <div className="navbar">
            <div className='navbar-title'>
                <h1>Pet Adoption Connect</h1>
            </div>
            <div className='navbar-links'>
                <Link to="/">Home</Link>
                {loggedInUser ? (
                    <>
                        <Link to="/messages">View Message Inbox</Link>
                        <button className="task-button" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/">Login</Link>
                )}
            </div>
        </div>
    );
}

export default NavBar;
