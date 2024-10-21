import AccountLayout from "./Partials/AccountLayout";
import React, { useEffect, useState } from "react";
import Layout from "./Partials/Layout";
import toast from "react-hot-toast";
import "./Styles/Account.css";
import axios from "axios";
import { appServer } from "../utils";

export const server = "https://nodejs-videocalling-app.vercel.app/api/v1";
// export const server = "http://localhost:4000/api/v1";

const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

function Account() {
  // const [formData, setFormData] = useState({
  //   name: "Naeem Lashari",
  //   companyName: "DueClix",
  //   email: "naeemlashari@hotmail.com",
  //   phoneNumber: "+92 300-2662914",
  //   country: "Pakistan",
  //   state: "Sindh",
  //   suit: "45C",
  //   city: "Karachi",
  //   zipCode: "75500",
  //   address:
  //     "Plot No 45C 3rd Floor, Street No 12, Badar Commercial, DHA Phase V",
  //   reference: "abc",
  //   activePreview: "./assets/images/team-thumb-4.jpg",
  // });

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [user, setUser] = useState(null);

  const updateProfileSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("country", country);
    formData.set("phoneNumber", phoneNumber);
    formData.set("state", state);
    formData.set("zipcode", zipcode);
    formData.set("address", address);
    if (image) {
      formData.append("image", image);
    }
    let loggedInUser = localStorage.getItem("user");
    loggedInUser = JSON.parse(loggedInUser);
    let loggedInUserEmail = loggedInUser.email;

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/user/profile/update`,
        {
          name,
          email,
          password,
          image,
          country,
          state,
          street: address,
          zipcode,
          address,
          phoneNumber,
          loggedInUserEmail,
        },
        config
      );

      await localStorage.removeItem("user");
      await localStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false);
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const updateDataChange = (e) => {
    if (e.target.name === "image") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview(reader.result);
          setImage(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };
  let storedUser;

  
  const registerPushSubscription = async (userId) => {
    const { data } = await axios.get(
      `${appServer}/vapidkeys`
    );
    const appServerKey = urlB64ToUint8Array(data.keys.publicKey);

    try {
      const serviceWorkerRegistration = await navigator.serviceWorker.register(
        "/sw.js"
      );
      const pushManager = serviceWorkerRegistration.pushManager;
      
      setTimeout(async() => {
        try {
          const existingSubscription = await pushManager.getSubscription();
          await existingSubscription?.unsubscribe();
        } catch (err) {}
        const newSubscription = await pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: appServerKey,
        });
        await sendSubscriptionToServer(newSubscription, userId);
      }, 5000);
    } catch (error) {
      console.error("Push subscription error:", error);
    }
  };

  const sendSubscriptionToServer = async (subscription, userId) => {
    try {
      await axios.post(`${appServer}/api/subscribe`, {
        subscription: subscription,
        userId: userId,
      });
    } catch (error) {
      console.error("Error sending subscription to server:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    storedUser = localStorage.getItem("user");
    if (storedUser) {
      let parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name);
      setEmail(parsedUser.email);
      setPassword(parsedUser.password);
      setCountry(parsedUser.country);
      setState(parsedUser.state);
      setPhoneNumber(parsedUser.phoneNumber);
      setZipcode(parsedUser.zipcode);
      setAddress(parsedUser?.street);
      setImagePreview(parsedUser?.image?.url);

      registerPushSubscription(parsedUser._id);
    }
  }, []);

  return (
    <>
      <Layout>
        <AccountLayout
          to={"/account"}
          title="Account Details"
          subTitle="You have full control to manage your own Account."
        >
          <div className="card">
            <div className="card-body">
              <div>
                <form
                  className="row align-items-end"
                  onSubmit={updateProfileSubmit}
                >
                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  {/* <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="companyName">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChangeForm}
                      className="form-control"
                      placeholder="Dueclix"
                    />
                  </div> */}
                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="naeem.lashari@hotmail.com"
                    />
                  </div>
                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="form-control"
                      placeholder="+92 34343434788"
                    />
                  </div>

                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="country">
                      Country
                    </label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="form-control"
                      name="country"
                    />
                  </div>
                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="state">
                      State
                    </label>
                    <input
                      // country={formData.country}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="form-control"
                      name="state"
                    />
                  </div>

                  {/* <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="suit">
                      Suit
                    </label>
                    <input
                      type="text"
                      id="suit"
                      name="suit"
                      value={formData.suit}
                      onChange={handleChangeForm}
                      className="form-control"
                    />
                  </div> */}
                  {/* <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="city">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-control"
                    />
                  </div> */}
                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="zipCode">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="phoneNumber">
                      Address{" "}
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      placeholder="address"
                    />
                  </div>
                  {/* <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="address">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                    />
                  </div> */}
                  {/* <div className="mb-3 col-12 col-md-6">
                    <label className="form-label" htmlFor="reference">
                      Reference
                    </label>
                    <input
                      type="text"
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChangeForm}
                      className="form-control"
                    />
                  </div> */}
                  <div className="mb-3 col-12">
                    <img
                      src={imagePreview}
                      style={{ width: "200px" }}
                      alt="user image"
                    />
                    <br />
                    <label for="formFile" class="mt-3 form-label">
                      Backround
                    </label>
                    <br />
                    <input
                      type="file"
                      id="formFile"
                      name="image"
                      className="form-control"
                      onChange={updateDataChange}
                    />
                  </div>
                  <div className="col-12 mb-3 text-lg-right">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={loading}
                    >
                      Update Info
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </AccountLayout>
      </Layout>
    </>
  );
}

export default Account;
