import React, { useState, useContext } from "react";
import { useMutation, gql } from '@apollo/client';
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const REGISTER_USER = gql`
mutation RegisterUser($first_name: String!, $last_name: String!, $phone_number: String!, $email: String!, $password: String!, $role: String!){
  registerUser(first_name: $first_name, last_name: $last_name, phone_number: $phone_number, email: $email, password: $password, role: $role) {
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

const Register = () => {
  const {
    setUser,
    setToken
  } = useContext(authContext);
  const [formState, setFormState] = useState({role: "user"})
  const [errorText, setErrorText] = useState("");

  const navigate = useNavigate();

  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);

  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
  }

  const onSubmit= async (e) => {
    e.preventDefault();
      
    registerUser({variables: 
        {first_name: formState.firstName, last_name: formState.lastName, phone_number: formState.phoneNumber, email: formState.email, password: formState.password, role: formState.role}
    }).then((res) => {
      // On Successful registration
      // Update user
      setUser(res.data.registerUser);
      console.log(res.data);
      // Set token in local storage
      setToken(res.data.registerUser);
      // Navigate to listings page
      navigate("/listings")
    }).catch((err) => {
      setErrorText(err.message)
    })
      
  }

  return(
    <div className="d-flex justify-content-center py-5">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-4 text-center">
        <div className="card-header">
          <h2>Register</h2>
        </div>
        <form className="px-3" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group pt-4">
            <label className="form-label">First Name</label>
            <input className="form-control "type="text"  placeholder="First Name" name="firstName" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Last Name</label>
            <input className="form-control "type="text" placeholder="Last Name" name="lastName" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Email</label>
            <input className="form-control " type="email" placeholder="example@gmail.com" name="email" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="password" name="password" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Phone Number 555-555-5555</label>
            <input className="form-control" type="tel" placeholder="555-555-5555" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="phoneNumber" required onChange={(e) => handleChange(e)}></input>
          </div>
          
          
          <div className="form-group pt-4">
            <div className="px-4">
              <label className="form-label w-25 px-4">User</label>
              <input type="radio" name="role" defaultChecked="user" value="user" onChange={(e) => handleChange(e)}></input>
            </div>
            <div className="px-4">
              <label className="form-label w-25 px-4">Admin</label>
              <input type="radio" name="role" value="admin" onChange={(e) => handleChange(e)}></input>
            </div>
          </div>
          {errorText && <div className="alert alert-danger" role="alert">
            {errorText}
          </div>}
          <div className="d-flex justify-content-end mx-2 my-4">
            <button className="btn btn-dark" type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;