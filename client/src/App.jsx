import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import Login from './pages/Login';
import NavBar from './components/NavBar';
import Register from './pages/Register';
import Home from './pages/Home';
import Listings from './pages/Listings';
import History from "./pages/History";
import CreateListing from "./pages/CreateListing";
import ViewListings from "./pages/ViewListings";
import ViewListing from "./pages/ViewListing";

import './App.css';
import { authContext } from "./context/AuthContext";
import UpdateListing from "./pages/UpdateListing";
import UpdateBooking from "./pages/UpdateBooking";

function App() {

  const {
    user,
  } = useContext(authContext);

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
          <Route path="/history" element={user ? <History/> : <Login/>}/>
          {/* Update Booking Page*/}
          <Route path="/updateBooking/:bookingId" element={user ? <UpdateBooking/> : <Login/>}/>
          {/* View a specific listing and its history */}
          <Route path="/viewListing/:listingId" element={user ? <ViewListing/> : <Login/>}/>
          {/* Create Listing Page */}
          <Route path="/newlisting" element={(user && user.role === "admin") ? <CreateListing/> : <Login/>}/>
          {/* Update Listing Page*/}
          <Route path="/updateListing/:listingId" element={(user && user.role === "admin") ? <UpdateListing/> : <Login/>}/>
          {/* View My Listings Page */}
          <Route path="/viewlistings" element={(user && user.role === "admin") ? <ViewListings/> : <Login/>}/>
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
