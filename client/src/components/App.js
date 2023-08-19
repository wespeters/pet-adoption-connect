import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from './NavBar';
import Home from './Home';
import PetDetail from './PetDetail';
import Messages from "./Messages";

import { DarkModeProvider } from '../contexts/DarkModeContext';

function App() {
  const storedUser = sessionStorage.getItem('loggedInUser');
  const [loggedInUser, setLoggedInUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
    if (loggedInUser) {
      sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    } else {
      sessionStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);

  const handleLogout = () => {
    setLoggedInUser(null);
    sessionStorage.removeItem('loggedInUser');
  };

  return (
    <DarkModeProvider>
      <BrowserRouter>
        <NavBar loggedInUser={loggedInUser} handleLogout={handleLogout} /> {/* Use NavBar */}
        <Routes>
          <Route path="/" element={<Home loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
          <Route path="/pets/:id" element={<PetDetail/>} />
          <Route path="/messages" element={<Messages loggedInUser={loggedInUser} />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
