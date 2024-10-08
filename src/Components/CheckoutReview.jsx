import AccountLayout from "./Partials/AccountLayout";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Layout from "./Partials/Layout";

function CheckoutReview() {
  // Destructure formData to access individual fields
  const [formData, setFormData] = useState({
    fullName: "Demo",
    phoneNumber: "Demo",
    email: "Demo",
    suit: "Demo",
    city: "Demo",
    zipCode: "Demo",
    address: "Demo",
    country: "Demo",
    state: "Demo",
    subscriptionFee: 120,
    discount: 30,
    subTotal: 90,
    members: 40,
    memberFee: 30,
    firstName: "Naeem",
    lastName: "Lashari",
    billingAddress:
      "Plot No 45C 3rd Floor, Street No 12, Badar Commercial, DHA Phase V",
    faxNumber: "+92 300-2662914",
    cardType: "MASTERCARD",
    expirationDate: "09/2025",
    cardNumber: "xxxx-xxxx-xxxx-5986",
    cardSecurityCode: "xx1",
  });

  return (
    <Layout>
      <AccountLayout title="Payment" subTitle="Review The Payment">
        <div className="container">
          <div className="row">
            <div className="col-7">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Contact Information</h5>

                  <table class="table table-striped">
                    <tbody>
                      <tr>
                        <th scope="row">Full Name</th>
                        <td>{formData.fullName}</td>
                      </tr>
                      <tr>
                        <th scope="row">Email</th>
                        <td>{formData.email}</td>
                      </tr>
                      <tr>
                        <th scope="row">Phone No</th>
                        <td>{formData.phoneNumber}</td>
                      </tr>
                      <tr>
                        <th scope="row">Suit</th>
                        <td>{formData.suit}</td>
                      </tr>
                      <tr>
                        <th scope="row">City</th>
                        <td>{formData.city}</td>
                      </tr>
                      <tr>
                        <th scope="row">ZIP Code</th>
                        <td>{formData.zipCode}</td>
                      </tr>
                      <tr>
                        <th scope="row">Address</th>
                        <td>{formData.address}</td>
                      </tr>
                      <tr>
                        <th scope="row">Country</th>
                        <td>{formData.country}</td>
                      </tr>
                      <tr>
                        <th scope="row">State</th>
                        <td>{formData.state}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-5">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">
                    Subscription: Annually Professional Subscription
                  </h6>

                  <table class="table table-striped">
                    <tbody>
                      <tr>
                        <th scope="row">Subscription</th>
                        <td className="text-right">
                          {formData.subscriptionFee.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Discount</th>
                        <td className="text-right">{formData.discount}</td>
                      </tr>
                      <tr>
                        <th scope="row">Sub Total</th>
                        <td className="text-right">{formData.subTotal}</td>
                      </tr>
                      <tr>
                        <th scope="row">Members</th>
                        <td className="text-right">{formData.members}</td>
                      </tr>
                      <tr>
                        <th scope="row">Member Fee</th>
                        <td className="text-right">{formData.memberFee}</td>
                      </tr>
                      <tr>
                        <td>
                          <h4 className="mt-4">Grand Total</h4>
                        </td>
                        <td>
                          <h4 className="mt-4 d-block text-right">${120}</h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <h4 className="my-5">Payment Information</h4>
              <div className="card">
                <div className="card-body">
                  <table class="table table-striped">
                    <tbody>
                      <tr>
                        <th scope="row">First Name</th>
                        <td>{formData.firstName}</td>
                      </tr>
                      <tr>
                        <th scope="row">Last Name</th>
                        <td>{formData.lastName}</td>
                      </tr>
                      <tr>
                        <th scope="row">Billing Address</th>
                        <td>{formData.billingAddress}</td>
                      </tr>
                      <tr>
                        <th scope="row">City</th>
                        <td>{formData.city}</td>
                      </tr>
                      <tr>
                        <th scope="row">ZIP Code</th>
                        <td>{formData.zipCode}</td>
                      </tr>
                      <tr>
                        <th scope="row">Fax Number</th>
                        <td>{formData.faxNumber}</td>
                      </tr>
                      <tr>
                        <th scope="row">Card Type</th>
                        <td>{formData.cardType}</td>
                      </tr>
                      <tr>
                        <th scope="row">Expiration Date</th>
                        <td>{formData.expirationDate}</td>
                      </tr>
                      <tr>
                        <th scope="row">Card Number</th>
                        <td>{formData.cardNumber}</td>
                      </tr>
                      <tr>
                        <th scope="row">Card Security Code</th>
                        <td>{formData.cardSecurityCode}</td>
                      </tr>
                      <tr>
                        <th scope="row">Country</th>
                        <td>{formData.country}</td>
                      </tr>
                      <tr>
                        <th scope="row">State</th>
                        <td>{formData.state}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Link to="/payment">
                    <button
                      type="button"
                      className="w-100 btn btn-outline-secondary"
                    >
                      Go Back
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccountLayout>
    </Layout>
  );
}

export default CheckoutReview;
