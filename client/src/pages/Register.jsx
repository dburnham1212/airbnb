import React, { useState, useContext } from "react";
import { useMutation, gql } from '@apollo/client';
import { authContext } from "../context/AuthContext";
const REGISTER_USER = gql`
mutation RegisterUser($first_name: String!, $last_name: String!, $phone_number: String!, $email: String!, $password: String!, $role: String!){
  registerUser(first_name: $first_name, last_name: $last_name, phone_number: $phone_number, email: $email, password: $password, role: $role) {
    id
    first_name
    last_name
  	phone_number
    email
  }
}
`

const Register = () => {
  const {
    setUser
  } = useContext(authContext);
  const [formState, setFormState] = useState({})
  const [fieldError, setFieldError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);

  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
    console.log(formState)
  }

  const onSubmit= async (e) => {
    e.preventDefault();
    if(formState.firstName && formState.lastName && formState.phoneNumber && formState.email && formState.password ) {
      
      registerUser({variables: 
          {first_name: formState.firstName, last_name: formState.lastName, phone_number: formState.phoneNumber, email: formState.email, password: formState.password, role: formState.role}
      }).then((res) => {
        setUser(res.data.registerUser);
        setFieldError(false);
      }).catch((err) => {
        setErrorText(err.message)
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
          <h2>Register</h2>
        </div>
        <form className="px-3">
          <div className="form-group pt-4">
            <label className="form-label">First Name</label>
            <input className={"form-control " + (fieldError && !formState.firstName && "is-invalid")} type="text"  placeholder="First Name" name="firstName" onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Last Name</label>
            <input className={"form-control " + (fieldError && !formState.lastName && "is-invalid")} type="text" placeholder="Last Name" name="lastName" onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Email</label>
            <input className={"form-control " + (fieldError && !formState.email && "is-invalid")} type="email" placeholder="example@gmail.com" name="email" onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Password</label>
            <input className={"form-control " + (fieldError && !formState.password && "is-invalid")} type="password" placeholder="password" name="password" onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Phone Number</label>
            <input className={"form-control " + (fieldError && !formState.phoneNumber && "is-invalid")} type="tel" placeholder="(555)-555-5555" name="phoneNumber" onChange={(e) => handleChange(e)}></input>
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
          {fieldError && <div class="alert alert-danger" role="alert">
            {errorText}
          </div>}
          <div className="d-flex justify-content-end mx-2 my-4">
            <button className="btn btn-dark" onClick={(e) => onSubmit(e)}>Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;