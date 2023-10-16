import React from "react";

const Register = () => {
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
            <label className="form-label">Role</label>
            <input className="form-control" type="password" placeholder="password"></input>
          </div>
          <div className="d-flex justify-content-end mx-2 my-4">
            <button className="btn btn-dark">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;