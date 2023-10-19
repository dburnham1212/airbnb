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
  const {
    setUser,
    setToken
  } = useContext(authContext);

  const [formState, setFormState] = useState({});
  const [fieldError, setFieldError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const navigate = useNavigate();

  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
    console.log(formState)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    // Check if form fields have been entered correctly
    if(formState.email && formState.password) {
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
        navigate("/listings")
      }).catch((err) => {
        // If there is an error returned
        setErrorText(err.message)
        // Display error in alert box
        setFieldError(true);
      })
    } else {
      setErrorText("Missing Required Fields")
      setFieldError(true);
    }
  }

  return(
    <div className="d-flex justify-content-center py-5">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-4 text-center">
        <div className="card-header">
          <h2>Login</h2>
        </div>
        <form className="px-3">
          <div className="form-group pt-4">
            <label className="form-label">Email</label>
            <input className={"form-control " + (fieldError && !formState.email && "is-invalid")} type="email" placeholder="Email" name="email" onChange={(e) => {handleChange(e)}}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Password</label>
            <input className={"form-control " + (fieldError && !formState.password && "is-invalid")} type="password" placeholder="password" name="password" onChange={(e) => handleChange(e)}></input>
          </div>
          {fieldError && <div class="alert alert-danger mt-4" role="alert">
            {errorText}
          </div>}
          <div className="d-flex justify-content-end mx-2 my-4">
            <button className="btn btn-dark" onClick={(e => {onSubmit(e)})}>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;