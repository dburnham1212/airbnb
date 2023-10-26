import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "./context/AuthContext";

// Import pages
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Register from './pages/Register';
import Listings from './pages/Listings';
import MyBookings from "./pages/MyBookings";
import NewListing from "./pages/NewListing";
import ViewListing from "./pages/ViewListing";
import MyListings from "./pages/MyListings";

// Import components
import UpdateListing from "./pages/UpdateListing";
import UpdateBooking from "./pages/UpdateBooking";

function App() {
  // Import user object from context
  const {
    user,
  } = useContext(authContext);

  return (
    <div>
      <NavBar/>
      <Routes>
        {/* Listings Page */}
        <Route path="/" element={<Listings/>}/>
        {/* View a specific listing and its history */}
        <Route path="/viewListing/:listingId" element={<ViewListing/>} />
        {/* History Page */}
        <Route path="/history" element={user ? <MyBookings/> : <Login/>}/>
        {/* Update Booking Page*/}
        <Route path="/updateBooking/:bookingId" element={user ? <UpdateBooking/> : <Login/>}/>
        {/* Create Listing Page */}
        <Route path="/newlisting" element={(user && user.role === "admin") ? <NewListing/> : <Login/>}/>
        {/* Update Listing Page*/}
        <Route path="/updateListing/:listingId" element={(user && user.role === "admin") ? <UpdateListing/> : <Login/>}/>
        {/* View My Listings Page */}
        <Route path="/viewlistings" element={(user && user.role === "admin") ? <MyListings/> : <Login/>}/>
        {/* Login Page */}
        <Route path="/login" element={<Login/>}/>
        {/* Registration Page*/}
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </div>
  );
}

export default App;
