import React, { useState, useContext } from "react";
import { useMutation, gql } from '@apollo/client';
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!){
  loginUser(email: $email, password: $password) {
    id
    first_name
    last_name
  	phone_number
    email
    role
    token
  }
}
`
const Login = () => {
  // Import functions from context
  const {
    setUser,
    setToken
  } = useContext(authContext);

  // State objects 
  const [formState, setFormState] = useState({});
  const [errorText, setErrorText] = useState("");

  // Use Navigate to handle navigation
  const navigate = useNavigate();

  // Query to login as a user a user
  const [loginUser] = useMutation(LOGIN_USER);

  // Function to handle form changes
  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
  }

  // Function to submit login form
  const onSubmit = (e) => {
    e.preventDefault();
    // Attempt to login
    loginUser({variables: 
        {email: formState.email, password: formState.password}       
    }).then((res) => { 
      // On Successful login
      // Update user
      setUser(res.data.loginUser);
      // Set token in local storage
      setToken(res.data.loginUser);
      // Navigate to listings page 
      navigate("/")
    }).catch((err) => {
      // If there is an error returned
      setErrorText(err.message)
    })
  }

  return(
    <div className="d-flex justify-content-center py-5 mx-2">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-4 text-center">
        <div className="card-header bg-dark">
          <h2 className="text-light">Login</h2>
        </div>
        {/* Submit login form body */}
        <form className="px-3" onSubmit={(e) => {onSubmit(e)}}>
          <div className="form-group pt-4">
            <label className="form-label">Email</label>
            <input className="form-control " type="email" placeholder="Email" name="email" required onChange={(e) => {handleChange(e)} }></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="password" name="password" required onChange={(e) => handleChange(e)}></input>
          </div>
          {/* Error handling for form */}
          {errorText && <div class="alert alert-danger mt-4" role="alert">
            {errorText}
          </div>}
          <div className="d-flex justify-content-end mx-2 my-4">
            <button className="btn btn-dark" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;