import AccountLayout from "./Partials/AccountLayout";
// import DataTable from 'datatables.net-dt';
import { Link } from "react-router-dom";
import Layout from "./Partials/Layout";
import React from "react";
import $ from "jquery";

function Payment() {
  $(document).ready(function () {
    $("#payment").DataTable();
  });
  return (
    <>
      <Layout>
        <AccountLayout title="Members" subTitle="Full list of Members.">
          <div className="container">
            <div className="row">
              <div className="px-0 col d-flex justify-content-end mt-2 mb-4">
                <Link to="/checkout" className=" btn btn-primary btn-sm">
                  {" "}
                  <i className="fa-solid fa-plus"></i> Add
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="table-responsive">
              <table id="payment" className="table mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Date</th>
                    <th>Expiry Date</th>
                    <th>Paid Amount</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3">
                      <Link
                        className="nav-link-style fw-medium fs-sm"
                        href="/"
                        data-bs-toggle="modal"
                      >
                        2023120058
                      </Link>
                    </td>
                    <td className="py-3">12-22-2023</td>
                    <td className="py-3">12-21-2024</td>
                    <td className="py-3">120.00</td>
                    <td className="py-3">Error</td>
                    <td className="py-3">Approved</td>
                    <td className="py-3">
                      <Link to="/review-checkout">View Detail</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </AccountLayout>
      </Layout>
    </>
  );
}

export default Payment;
