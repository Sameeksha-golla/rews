import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import MyTickets from './components/MyTickets';
import CreateTicket from './components/CreateTicket';
// import Header from './components/Header';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/MyTickets" element={<MyTickets />} />
      <Route path="/CreateTicket" element={<CreateTicket/>} />
    </Routes>
  );
}

export default App;
