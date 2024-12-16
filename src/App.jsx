import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components /Home';
import Detailes from './components /Detailes';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/coin/:coinId" element={<Detailes />} />
      </Routes>
    </Router>
  );
}
export default App;
