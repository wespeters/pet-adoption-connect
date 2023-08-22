import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from './NavBar';
import Home from './Home';
import PetDetail from './PetDetail';
import AvailablePets from "./AvailablePets";
import Messages from "./Messages";
import Post from "./Post";
import Register from './Register';
import ResourcesForAdopters from './ResourcesForAdopters';
import ResourceDetail from "./ResourceDetail";
import Search from "./Search";
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
        <NavBar loggedInUser={loggedInUser} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/pets/:id" element={<PetDetail loggedInUser={loggedInUser} />} />
          <Route path="/pets/available" element={<AvailablePets />} />
          <Route path="/messages" element={<Messages loggedInUser={loggedInUser} />} />
          <Route path="/resources" element={<ResourcesForAdopters />} />
          <Route path="/resources/:resource_id" element={<ResourceDetail />} />
          <Route path="/post" element={<Post loggedInUser={loggedInUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
