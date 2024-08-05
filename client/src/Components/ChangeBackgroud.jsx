import AccountLayout from "./Partials/AccountLayout";
import React, { useState } from "react";
import Layout from "./Partials/Layout";

function ChangeBackground() {
  const [formData, setFormData] = useState({
    imageTitle: "",
    image: "",
    status: "",
    activePreview: "./assets/images/background.jpg",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Layout>
        <AccountLayout
          title="Video Background"
          subTitle="Adjust your video backround."
        >
          <form className="row align-items-end" onSubmit={handleSubmit}>
            <div className="mb-3 col-12">
              <label htmlFor="imageTitle" className="form-label">
                Image Title
              </label>
              <input
                type="text"
                name="imageTitle"
                className="form-control"
                value={formData.imageTitle}
                onChange={handleChange}
                placeholder="Enter Image Title"
              />
            </div>
            <div className="mb-3 col-12">
              <img
                src={formData.activePreview}
                style={{ width: "200px" }}
                alt=""
              />
              <br />
              <label for="formFile" class="mt-3 form-label">
                Backround
              </label>
              <br />
              <input
                type="file"
                id="formFile"
                className="form-control"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-12">
              <label for="formFile" class="mt-3 form-label">
                Status
              </label>
              <select
                name=""
                id=""
                className="form-control"
                value={formData.image}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">InActive</option>
              </select>
            </div>
            <div className="col-12 mb-3 text-lg-right">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </AccountLayout>
      </Layout>
    </>
  );
}

export default ChangeBackground;
