import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../context/AuthContext";


const NavBar = () => {
  // Get user object and functions to be used in the navbar
  const {
    user,
    onLogout
  } = useContext(authContext);

  return(
    <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-dark py-4">
      <div className="container-fluid">
        <div className="navbar-brand text-light px-4" style={{ fontFamily: "Pacifico", fontSize: 25 }}>Airbnb</div>
        <button 
          className="navbar-toggler bg-light mx-4" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse mx-4" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item active">
              <Link className="nav-link link-light link-opacity-50-hover" to="/">Listings</Link>
            </li>
            {user && 
              <li className="nav-item active">
                <Link className="nav-link link-light link-opacity-50-hover" to="/history">My Bookings</Link>
              </li>}
            {user && user.role==="admin" && <>
              
              <li className="nav-item active">
                <Link className="nav-link link-light link-opacity-50-hover" to="/newlisting">New Listing</Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link link-light link-opacity-50-hover" to="/viewlistings">My Listings</Link>
              </li> 
            </>
            }
          </ul>
          
          {user ?
          <ul className="navbar-nav d-flex justify-content-end"> 
            <li className="nav-item m-auto">
              <span className="text-warning">User: <span className="text-capitalize">{user.first_name}</span> <span className="text-capitalize">{user.last_name}</span></span>
            </li>
            <li className="nav-item active">
              <button className="nav-link link-light link-opacity-50-hover" onClick={onLogout}>Logout</button>
            </li>
          </ul>
          :<ul className="navbar-nav d-flex justify-content-end">  
            <li className="nav-item active">
              <Link className="nav-link link-light link-opacity-50-hover" to="/login">Login</Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link link-light link-opacity-50-hover" to="/register">Register</Link>
            </li>
          </ul>
          
          }
          
        </div>
      </div>
    </nav>
  )
}

export default NavBar;