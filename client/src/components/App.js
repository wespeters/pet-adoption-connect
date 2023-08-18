import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Home';
import PetDetail from './PetDetail';

import { DarkModeProvider } from '../contexts/DarkModeContext';

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/pets/:id" element={<PetDetail/>} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
