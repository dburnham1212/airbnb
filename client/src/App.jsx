import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './components/Login';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Home from './components/Home';
import Listings from './components/Listings';
import History from "./components/History";
import CreateListing from "./components/CreateListing";
import ViewListings from "./components/ViewListings";

import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<Home/>}/>
          {/* Listings Page */}
          <Route path="/listings" element={<Listings/>}/>
          {/* History Page */}
          <Route path="/history" element={<History/>}/>
          {/* Create Listing Page */}
          <Route path="/newlisting" element={<CreateListing/>}/>
          {/* View My Listings Page */}
          <Route path="/viewlistings" element={<ViewListings/>}/>
          {/* Login Page */}
          <Route path="/login" element={<Login/>}/>
          {/* Registration Page*/}
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
