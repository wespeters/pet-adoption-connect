import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

  return (
    <DarkModeProvider>
      <BrowserRouter>
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
