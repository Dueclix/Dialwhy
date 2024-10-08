import { useNavigate } from "react-router-dom";
import Navbar from "./Partials/Navbar/Navbar";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Footer from "./Partials/Footer";
import { server } from "./Account";
import "./ForgotPassword.css";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();

    // dispatch(forgotPassword(email));
    try {
      setLoading(true);
      const { data } = await axios.post(`${server}/user/forgotpassword`, {
        email,
      });
      toast.success(data?.message);
      navigate("/");
      setLoading(false);
    } catch (error) {
      toast.error("User Does Not Exist");
    }
  };

  return (
    <>
      <Navbar />
      <div className="forgotPasswordContainer">
        <div className="forgotPasswordBox">
          <h2 className="forgotPasswordHeading">Forgot Password </h2>
          <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>
            <div className="forgotPasswordEmail">
              {/* <MailOutline /> */}
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <input
              style={{ backgroundColor: "tomato" }}
              type="submit"
              value={"Continue"}
              className="forgotPasswordBtn"
              disabled={loading}
            />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
