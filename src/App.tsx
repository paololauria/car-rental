import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import CarDetails from './components/cars/CarsDetails';
import Cars from './components/cars/Cars';
import User from './components/user/User';
import Rental from './components/rental/Rental';
import RentalDetails from './components/rental/RentalDetails';
import UserDetails from './components/user/UserDetails';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} /> 
        <Route path="/rentals" element={<Rental />} />
        <Route path="/rentals/:id" element={<RentalDetails id={0} />} />
        <Route path="/users" element={<User />} />
        <Route path="/users/:id" element={<UserDetails id={0} />} />
      </Routes>
    </div>
  );
};

export default App;
