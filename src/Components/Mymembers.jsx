import AccountLayout from "./Partials/AccountLayout";
// import DataTable from 'datatables.net-dt';
import { Link } from "react-router-dom";
import Layout from "./Partials/Layout";
import React from "react";
import $ from "jquery";

function Mymembers() {
  $(document).ready(function () {
    $("#myMembers").DataTable();
  });
  return (
    <>
      <Layout>
        <AccountLayout title="Members" subTitle="Full list of Members.">
          <div className="container">
            <div className="row">
              <div className="px-0 col d-flex justify-content-end mt-2 mb-4">
                <Link to="/create-members" className=" btn btn-primary btn-sm">
                  {" "}
                  <i className="fa-solid fa-plus"></i> Add
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="table-responsive">
              <table id="myMembers" className="table mb-0">
                <thead>
                  <tr>
                    <th>Member #</th>
                    <th>Member Name</th>
                    <th>Date Purchased</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3">
                      <Link
                        className="nav-link-style fw-medium fs-sm"
                        href="/members-details"
                        data-bs-toggle="modal"
                      >
                        34VB5540K83
                      </Link>
                    </td>
                    <td className="py-3">May 21, 2019</td>
                    <td className="py-3">
                      <span className="badge bg-soft-info m-0">
                        In Progress
                      </span>
                    </td>
                    <td className="py-3">$358.75</td>
                    <td className="py-3">$358.75</td>
                    <td className="py-3">
                      <button
                        type="button"
                        id="copy"
                        className="bg-transparent text-primary border-0 mr-2"
                        style={{ fontSize: "12px" }}
                      >
                        <i class="fas fa-copy"></i>
                      </button>
                      <button
                        type="button"
                        id="edit"
                        className="bg-transparent text-primary border-0 mr-2"
                        style={{ fontSize: "12px" }}
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        id="delete"
                        className="bg-transparent text-primary border-0"
                        style={{ fontSize: "12px" }}
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
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

export default Mymembers;
