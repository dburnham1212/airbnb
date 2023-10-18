import React, { useState } from "react";
import { graphql } from '@apollo/client'
import { useMutation, gql } from '@apollo/client';

const REGISTER_USER = gql`
mutation RegisterUser($first_name: String, $last_name: String, $phone_number: String, $email: String, $password: String){
  registerUser(first_name: $first_name, last_name: $last_name, phone_number: $phone_number, email: $email, password: $password) {
    id
    first_name
    last_name
  	phone_number
    email
  }
}
`

const Register = () => {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: ""
    
  })

  const handleChange = (event) => {

  }

  return(
    <div className="d-flex justify-content-center py-5">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-4 text-center">
        <div className="card-header">
          <h2>Register</h2>
        </div>
        <form className="px-3">
          <div className="form-group pt-4">
            <label className="form-label">First Name</label>
            <input className="form-control" type="text" placeholder="First Name"></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Last Name</label>
            <input className="form-control" type="text" placeholder="Last Name"></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" placeholder="example@gmail.com"></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="password"></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Phone Number</label>
            <input className="form-control" type="tel" placeholder="(555)-555-5555"></input>
          </div>
          
          
          <div className="form-group pt-4">
            <div className="px-4">
              <label className="form-label w-25 px-4">User</label>
              <input type="radio" name="role" checked="checked"></input>
            </div>
            <div className="px-4">
              <label className="form-label w-25 px-4">Admin</label>
              <input type="radio" name="role"></input>
            </div>
          </div>
          <div className="d-flex justify-content-end mx-2 my-4">
            <button className="btn btn-dark">Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;