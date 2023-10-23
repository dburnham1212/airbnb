import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const NavBar = () => {
  const {
    user,
    setUser,
    clearToken
  } = useContext(authContext);

  const navigate = useNavigate();

  const onLogout = () => {
    clearToken();
    setUser(null);
    navigate("/login")
  }

  return(
    <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-dark py-4">
      <div className="container-fluid">
        <Link className="navbar-brand text-light px-4" to="/">Airbnb</Link>
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
              <Link className="nav-link link-light link-opacity-50-hover" to="/listings">Listings</Link>
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
              <span className="text-warning">User: {user.first_name} {user.last_name}</span>
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