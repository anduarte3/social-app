import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login'
import Register from './components/Register'
import Feed from './components/Feed'
import './assets/global.css'
import './assets/tailwind.css';

function App() {
  
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<div className='main-section'><Login/></div>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/feed' element={<Feed/>}></Route>
        <Route path="/*" element={<Navigate to="/"/>} />
      </Routes>
    </div>
  );
}

export default App;
