import React, { useState } from "react";

const CreateListing = () => {
  const [formState, setFormState] = useState({});
  const [addressState, setAddressState] = useState({});

  const handleChange = (event) => {
    setFormState({...formState, [event.target.name]: event.target.value}); 
  }

  const handleAddressChange = (event) => {
    setAddressState({...addressState, [event.target.name]: event.target.value})
  }

  const onSubmit = () => {
    const address = `${addressState.street}, ${addressState.city}, ${addressState}`
  }

  return(
    <div className="d-flex justify-content-center py-5">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-4 text-center">
      <div className="card-header">
          <h2>Create Listing</h2>
        </div>
        <form className="px-3" onSubmit={onSubmit}>
          <div className="form-group pt-4">
            <label className="form-label">Name</label>
            <input className="form-control" type="text" placeholder="Name" name="name" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Description</label>
            <textarea className="form-control" type="text" placeholder="Description" name="description" required onChange={(e) => handleChange(e)}></textarea>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Street Address</label>
            <input className="form-control" type="text" placeholder="123 New Street" required onChange={(e) => handleAddressChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">City</label>
            <input className="form-control" type="text" placeholder="City" required onChange={(e) => handleAddressChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Postal Code</label>
            <input className="form-control" type="text" placeholder="Postal Code" required onChange={(e) => handleAddressChange(e)}></input>
          </div>
          <div className="form-group pt-4">
            <label className="form-label">Price Per Night</label>
            <input className="form-control" type="text" placeholder="Price" name="description" required onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="d-flex justify-content-end mx-2 my-4">
            <button className="btn btn-dark" type="submit">Create Listing</button>
          </div>
        </form>
      </div>
    </div>
    
  )
}

export default CreateListing;