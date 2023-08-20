import React from 'react';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle'; // Import DarkModeToggle
import './NavBar.css';

function NavBar({ loggedInUser, handleLogout }) {
    const handlePostNewPet = (e) => {
        if (!loggedInUser || loggedInUser.role !== 'owner') {
            alert('You must be registered and logged in as an owner to post a new pet.');
            e.preventDefault(); // Prevent the link from navigating
        }
    };

    return (
        <div className="navbar">
            <div className='navbar-title'>
                <h1>Pet Adoption Connect</h1>
            </div>
            <div className="dark-mode-toggle-container">
                <DarkModeToggle /> {/* Render DarkModeToggle */}
            </div>
            <div className='navbar-links'>
                <Link to="/">Home</Link>
                <Link to="/post" onClick={handlePostNewPet}>Post a New Pet</Link>
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
