import AccountLayout from "./Partials/AccountLayout";
import countryList from "react-select-country-list";
import React, { useState, useMemo } from "react";
import Layout from "./Partials/Layout";
import Select from "react-select";

function Checkout() {
  const [contactForm, setContactForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    suit: "",
    city: "",
    zipCode: "",
    address: "",
    country: "",
    state: "",
  });
  const [memberData, setmemberData] = useState({
    members: 1, // Defaulting members to 1
    renewal: "monthly", // Defaulting renewal to monthly
  });

  const [paymentForm, setPaymentForm] = useState({
    firstName: "",
    lastName: "",
    billingAddress: "",
    paymentCity: "",
    zipCode: "",
    phoneNumber: "",
    faxNumber: "",
    cardType: "",
    securityCode: "",
    cardNumber: "",
    country: "",
    paymentstate: "",
  });
  const handleChangeContact = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value,
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setmemberData({
      ...memberData,
      [name]: value,
    });
  };
  const handleChangePayment = (e) => {
    const { name, value } = e.target;
    setPaymentForm({
      ...paymentForm,
      [name]: value,
    });
  };

  const [value, setValue] = useState("");
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setValue(value);
  };

  // Function to calculate total cost based on members and renewal
  const calculateTotalCost = () => {
    const memberCharge = memberData.members; // $1 per member
    const durationFactor = memberData.renewal === "monthly" ? 1 : 12; // Monthly or yearly
    return memberCharge * durationFactor;
  };

  const [errors, setErrors] = useState({}); // State to hold form validation errors

  const validateForm = () => {
    let formErrors = {};

    // Validate contact form fields
    if (contactForm.fullName.trim() === "") formErrors.fullName = "Error";
    if (contactForm.phoneNumber.trim() === "") formErrors.phoneNumber = "Error";
    if (contactForm.email.trim() === "") formErrors.email = "Error";
    if (contactForm.suit.trim() === "") formErrors.suit = "Error";
    if (contactForm.city.trim() === "") formErrors.city = "Error";
    if (contactForm.zipCode.trim() === "") formErrors.zipCode = "Error";
    if (contactForm.address.trim() === "") formErrors.address = "Error";
    if (contactForm.country.trim() === "") formErrors.country = "Error";
    if (contactForm.state.trim() === "") formErrors.state = "Error";
    if (paymentForm.firstName.trim() === "") formErrors.firstName = "Error";
    if (paymentForm.lastName.trim() === "") formErrors.lastName = "Error";
    if (paymentForm.billingAddress.trim() === "")
      formErrors.billingAddress = "Error";
    if (paymentForm.paymentCity.trim() === "") formErrors.paymentCity = "Error";
    if (paymentForm.zipCode.trim() === "") formErrors.zipCode = "Error";
    if (paymentForm.phoneNumber.trim() === "") formErrors.phoneNumber = "Error";
    if (paymentForm.faxNumber.trim() === "") formErrors.faxNumber = "Error";
    if (paymentForm.securityCode.trim() === "")
      formErrors.securityCode = "Error";
    if (paymentForm.cardNumber.trim() === "") formErrors.cardNumber = "Error";
    if (paymentForm.paymentstate.trim() === "")
      formErrors.paymentstate = "Error";

    // Validate membership data fields
    if (memberData.members <= 0)
      formErrors.members = "Number of members must be greater than 0";

    // Validate payment form fields
    if (paymentForm.firstName.trim() === "")
      formErrors.firstName = "First name is ";

    // Set errors state
    setErrors(formErrors);

    // Return true if there are no errors
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate form
    if (validateForm()) {
      // Form is valid, proceed with submission
      // Your form submission logic goes here
    } else {
      // Form is invalid, do not submit
      // You can display error messages or take other actions
    }
  };
  return (
    <>
      <Layout>
        <AccountLayout title="Payment" subTitle="Add The Payment">
          <div className="container">
            <form className="row align-items-start" onSubmit={handleSubmit}>
              <div className="col-7">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-4">CONTACT INFORMATION</h5>
                    <div className="row align-items-start">
                      <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="fullName" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          className={`form-control ${
                            errors.fullName ? "is-invalid" : ""
                          }`}
                          value={contactForm.fullName}
                          onChange={handleChangeContact}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="email">
                          Email address
                        </label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="Email address"
                          value={contactForm.email}
                          onChange={handleChangeContact}
                        />
                      </div>
                      <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="phoneNumber" className="form-label">
                          Phone Number*
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          className={`form-control ${
                            errors.phoneNumber ? "is-invalid" : ""
                          }`}
                          value={contactForm.phoneNumber}
                          onChange={handleChangeContact}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="suit" className="form-label">
                          Suit/Apt
                        </label>
                        <input
                          type="text"
                          name="suit"
                          className={`form-control ${
                            errors.suit ? "is-invalid" : ""
                          }`}
                          value={contactForm.suit}
                          onChange={handleChangeContact}
                          placeholder="Suit"
                        />
                      </div>
                      <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="city" className="form-label">
                          City*
                        </label>
                        <input
                          type="text"
                          name="city"
                          className={`form-control ${
                            errors.city ? "is-invalid" : ""
                          }`}
                          value={contactForm.city}
                          onChange={handleChangeContact}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="zipCode" className="form-label">
                          ZIP Code*
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          className={`form-control ${
                            errors.zipCode ? "is-invalid" : ""
                          }`}
                          value={contactForm.zipCode}
                          onChange={handleChangeContact}
                          placeholder="Enter ZIP code"
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          className={`form-control ${
                            errors.address ? "is-invalid" : ""
                          }`}
                          value={contactForm.address}
                          onChange={handleChangeContact}
                          placeholder="Enter address"
                        />
                      </div>
                      <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="country" className="form-label">
                          Country*
                        </label>
                        <input
                          type="text"
                          name="country"
                          className={`form-control ${
                            errors.country ? "is-invalid" : ""
                          }`}
                          value={contactForm.country}
                          onChange={handleChangeContact}
                          placeholder="Enter country"
                        />
                      </div>
                      <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="state" className="form-label">
                          State*
                        </label>
                        <input
                          type="text"
                          name="state"
                          className={`form-control ${
                            errors.state ? "is-invalid" : ""
                          }`}
                          value={contactForm.state}
                          onChange={handleChangeContact}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-5">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title mb-4">Number of Member</h6>
                    <div className="mb-3">
                      <select
                        name="members"
                        className={`form-control`}
                        value={memberData.members}
                        style={{ maxWidth: "50%" }}
                        onChange={handleChange}
                        placeholder="Enter number of members"
                      >
                        {new Array(10).fill().map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="renewal">
                        Member Subscription
                      </label>
                      <select
                        name="renewal"
                        className={`form-control`}
                        value={memberData.renewal}
                        style={{ maxWidth: "50%" }}
                        onChange={handleChange}
                        placeholder="Enter subscription renewal"
                      >
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <table width="100%">
                      <thead>
                        <tr style={{ borderBottom: "1px solid #E6E3F1" }}>
                          <td>Member Charges</td>
                          <td>
                            <span className="d-block text-right py-2 mt-1">
                              ${calculateTotalCost().toFixed(2)}
                            </span>
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #E6E3F1" }}>
                          <td>Sub Total</td>
                          <td>
                            <span className="d-block text-right py-2 mt-1">
                              ${calculateTotalCost().toFixed(2)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h4 className="mt-4">Grand Total</h4>
                          </td>
                          <td>
                            <h4 className="mt-4 d-block text-right">
                              ${calculateTotalCost().toFixed(2)}
                            </h4>
                          </td>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
                <h4 className="my-5">Payment Information</h4>
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-end">
                      <div className="mb-3 col-12">
                        <label htmlFor="firstName" className="form-label">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          className={`form-control ${
                            errors.firstName ? "is-invalid" : ""
                          }`}
                          value={paymentForm.firstName}
                          onChange={handleChangePayment}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="lastName" className="form-label">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          className={`form-control ${
                            errors.lastName ? "is-invalid" : ""
                          }`}
                          value={paymentForm.lastName}
                          onChange={handleChangePayment}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <input
                          type="checkbox"
                          name="sameAddress"
                          id="sameAddress"
                        />
                        &nbsp;<span>Same As Contact Information</span>
                        <br />
                        <label
                          htmlFor="billingAddress"
                          className="form-label mt-2"
                        >
                          Billing Address
                        </label>
                        <input
                          type="text"
                          name="billingAddress"
                          className={`form-control ${
                            errors.billingAddress ? "is-invalid" : ""
                          }`}
                          value={paymentForm.billingAddress}
                          onChange={handleChangePayment}
                          placeholder="Enter Billing Address"
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="city" className="form-label">
                          City*
                        </label>
                        <input
                          type="text"
                          name="city"
                          className={`form-control ${
                            errors.paymentCity ? "is-invalid" : ""
                          }`}
                          value={paymentForm.city}
                          onChange={handleChangePayment}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="zipCode" className="form-label">
                          ZIP Code*
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          className={`form-control ${
                            errors.zipCode ? "is-invalid" : ""
                          }`}
                          value={paymentForm.zipCode}
                          onChange={handleChangePayment}
                          placeholder="Enter ZIP code"
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="phoneNumber" className="form-label">
                          Phone Number*
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          className={`form-control ${
                            errors.phoneNumber ? "is-invalid" : ""
                          }`}
                          value={paymentForm.phoneNumber}
                          onChange={handleChangePayment}
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="faxNumber" className="form-label">
                          Fax Number*
                        </label>
                        <input
                          type="text"
                          name="faxNumber"
                          className={`form-control ${
                            errors.faxNumber ? "is-invalid" : ""
                          }`}
                          value={paymentForm.faxNumber}
                          onChange={handleChangePayment}
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="cardType" className="form-label">
                          Card Type*
                        </label>
                        <select
                          name="cardType"
                          className={`form-control ${
                            errors.cardType ? "is-invalid" : ""
                          }`}
                          value={paymentForm.cardType}
                          onChange={handleChangePayment}
                        >
                          <option disabled selected>
                            ---Select One ---
                          </option>
                          <option value="visa">Visa</option>
                          <option value="mastercard">MasterCard</option>
                          <option value="discover">Discover</option>
                          <option value="discover">Amarican Express</option>
                        </select>
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="cardNumber" className="form-label">
                          Card Number*
                        </label>
                        <input
                          type="number"
                          name="cardNumber"
                          className={`form-control ${
                            errors.cardNumber ? "is-invalid" : ""
                          }`}
                          value={paymentForm.cardNumber}
                          onChange={handleChangePayment}
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="securityCode" className="form-label">
                          Security Code*
                        </label>
                        <input
                          type="number"
                          name="securityCode"
                          className={`form-control ${
                            errors.securityCode ? "is-invalid" : ""
                          }`}
                          style={{ width: "50%" }}
                          value={paymentForm.securityCode}
                          onChange={handleChangePayment}
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="securityCode" className="form-label">
                          Country*
                        </label>
                        <Select
                          options={options}
                          value={value}
                          onChange={changeHandler}
                        />
                      </div>
                      <div className="mb-3 col-12">
                        <label htmlFor="state" className="form-label">
                          State*
                        </label>
                        <input
                          type="text"
                          name="paymentstate"
                          className={`form-control ${
                            errors.paymentstate ? "is-invalid" : ""
                          }`}
                          value={paymentForm.state}
                          onChange={handleChangePayment}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </AccountLayout>
      </Layout>
    </>
  );
}

export default Checkout;
