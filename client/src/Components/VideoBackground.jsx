import AccountLayout from "./Partials/AccountLayout";
// import DataTable from 'datatables.net-dt';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Partials/Layout";
import $ from "jquery";

function VideoBackground() {
  // Function to copy URL
  const copyURL = (url) => {
    navigator.clipboard.writeText(url);
  };

  const [formData, setFormData] = useState({
    imageTitle: "",
    image: "",
    status: "",
    activePreview: "./assets/images/background.jpg",
  });

  $(document).ready(function () {
    $("#videoBg").DataTable();
  });

  return (
    <>
      <Layout>
        <AccountLayout
          title="Video Background"
          subTitle="Adjust your video backround."
        >
          <Link
            to="/change-background"
            className="ml-auto mr-0 btn btn-primary mb-3"
          >
            Add
          </Link>
          <div className="card">
            <div className="table-responsive">
              <table id="videoBg" className="table mb-0">
                <thead>
                  <tr>
                    <th>Background #</th>
                    <th>Image</th>
                    <th>Background Name</th>
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
                        to="/rooms-details"
                        data-bs-toggle="modal"
                      >
                        34VB5540K83
                      </Link>
                    </td>
                    <td className="py-3">
                      <img
                        src={formData.activePreview}
                        style={{ maxWidth: "60px" }}
                        alt=""
                      />
                    </td>
                    <td className="py-3">Room Name Here</td>
                    <td className="py-3">URL Here</td>
                    <td className="py-3">
                      <span className="badge bg-soft-info m-0">
                        In Progress
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        id="copy"
                        className="bg-transparent text-primary border-0 mr-2"
                        onClick={() => copyURL("URL Here")}
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
                  {/* Add more <tr> for additional data */}
                </tbody>
              </table>
            </div>
          </div>
        </AccountLayout>
      </Layout>
    </>
  );
}

export default VideoBackground;
