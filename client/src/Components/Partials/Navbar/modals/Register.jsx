import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useState } from "react";

function RegisterModal({ show, handleClose, handleModalShow }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    state: "",
    streetNo: "",
    zipCode: "",
    phoneNumber: "",
    profilePic: "",
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="clean_modal clean_modal-lg"
      >
        <div className="modal-content">
          <div className="form-group mb-3 p-3 bg-light d-flex justify-content-between align-items-center">
            <h4 className=" mb-0 text-dark">Register</h4>
            <button
              type="button"
              className="close text-dark"
              onClick={handleClose}
            >
              {" "}
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="register_error d-none">
              <div className="alert f-size-16" role="alert"></div>
            </div>
            <form action="" method="POST" id="register_form">
              <div className="form-group mb-3">
                <input
                  onChange={handleChangeForm}
                  className="form-control"
                  required
                  name="fullName"
                  placeholder="Full Name"
                  type="text"
                  value={formData.fullName}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  onChange={handleChangeForm}
                  className="form-control rounded"
                  value={formData.email}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={handleChangeForm}
                  className="form-control rounded"
                  value={formData.password}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  name="country"
                  type="text"
                  required
                  placeholder="Country"
                  onChange={handleChangeForm}
                  className="form-control rounded"
                  value={formData.country}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  name="state"
                  type="text"
                  required
                  placeholder="State"
                  onChange={handleChangeForm}
                  className="form-control rounded"
                  value={formData.state}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  name="streetNo"
                  type="text"
                  required
                  placeholder="Street No"
                  onChange={handleChangeForm}
                  className="form-control rounded"
                  value={formData.streetNo}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  name="zipCode"
                  type="text"
                  required
                  placeholder="Zip Code"
                  onChange={handleChangeForm}
                  className="form-control rounded"
                  value={formData.zipCode}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  name="phoneNumber"
                  type="text"
                  required
                  placeholder="Phone Number"
                  onChange={handleChangeForm}
                  className="form-control rounded"
                  value={formData.phoneNumber}
                />
              </div>
              <div className="form-group mb-3">
                <label for="profilePic">Choose a profile picture:</label>
                <input
                  name="profilePic"
                  type="file"
                  required
                  placeholder="Choose a profile picture:"
                  onChange={handleChangeForm}
                  className="form-control rounded pb-1"
                  value={formData.profilePic}
                />
              </div>

              <button
                type="submit"
                id="register_btn"
                name="submit"
                className="btn btn-primary btn-full btn-medium rounded"
              >
                Register
              </button>

              <div className="form-group text-center small font-weight-bold mt-3">
                By continuing you agree to our{" "}
                <Link to="#"> Terms and conditions.</Link>
              </div>
              <hr className="my-4" />
              <div className="form-group text-center small font-weight-bold mb-0">
                Don’t have an account?{" "}
                <Link to="#" onClick={() => handleModalShow("login")}>
                  {" "}
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RegisterModal;
