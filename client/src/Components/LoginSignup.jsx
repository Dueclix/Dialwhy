import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import Navbar from "./Partials/Navbar/Navbar";
import { toast } from "react-hot-toast";
import Footer from "./Partials/Footer";
import Cookies from "js-cookie";
import "./LoginSignUp.css";
import axios from "axios";
import {
  AddToHomeScreenOutlined,
  FormatListNumbered,
  PersonAddTwoTone,
  MailOutline,
  LockOpen,
  HomeWork,
  Language,
  Public,
} from "@mui/icons-material";

export const server = "https://nodejs-videocalling-app.vercel.app/api/v1";
// export const server = "http://localhost:4000/api/v1";

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const LoginSignUp = () => {
  const [loading, setLoading] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    state: "",
    street: "",
    zipcode: "",
    phoneNumber: "",
  });

  const {
    name,
    email,
    password,
    country,
    state,
    street,
    zipcode,
    phoneNumber,
  } = user;

  const [image, setimage] = useState("");
  const [imagePreview, setimagePreview] = useState("/Profile.png");

  const navigate = useNavigate();

  const loginTab = useRef(null);
  const signUpTab = useRef(null);
  const switcherTab = useRef(null);

  const switchTab = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      signUpTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      signUpTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      // dispatch(login(loginEmail, loginPassword));
      const { data } = await axios.post(`${server}/user/login`, {
        email: loginEmail,
        password: loginPassword,
      });
      // Check if "user" item already exists in localStorage
      if (!localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(data?.user));
        Cookies.set("userId", data?.user?._id);
        Cookies.set("userName", data?.user?.name);
        Cookies.set("userEmail", data?.user?.email);
      }
      if (data?.user?.approved === true) {
        toast.success(data?.message);
        navigate(`/account`);
        window.location.reload();
      } else {
        toast.error("In Active User Status!");
      }
    } catch (error) {
      toast.error("Wrong Credentials");
      console.log(error);
    }
  };

  const signUpSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    if (image) {
      formData.set("image", image); // set the image file
    }
    setLoading(true);
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    try {
      const { data } = await axios.post(
        `${server}/user/register`,
        {
          name,
          email,
          password,
          image,
          country,
          state,
          street,
          zipcode,
          phoneNumber,
        },
        config
      );
      if (!localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Request is Pending for Approval!");

      await navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const registerDataChange = (e) => {
    if (e.target.name === "image") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setimagePreview(reader.result);
          setimage(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  function onChange(value) {
    console.log("Captcha value:", value);
  }

  if (!(Cookies.get("userId")) && window.localStorage.getItem("user")) {
    window.localStorage.clear();
  }

  return (
    <>
      {/* <Sidebar /> */}
      <Navbar />
      <div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
          <div>
            <div className="login_signUp_toggle">
              <p onClick={(e) => switchTab(e, "login")}>Login</p>
              <p onClick={(e) => switchTab(e, "register")}>Register</p>
            </div>
            <button ref={switcherTab}></button>
          </div>
          <form className="loginForm" onSubmit={loginSubmit} ref={loginTab}>
            <div className="loginEmail">
              <MailOutline />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="loginPassword">
              <LockOpen />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <Link to="/forgot-password">Forgot Password</Link>
  
            <input
              type="submit"
              value={"Login"}
              className="loginBtn"
              disabled={loading ? true : false}
            />
          </form>
  
          {/* SignUp Form  */}
          <form
            className="signUpForm"
            ref={signUpTab}
            encType="multipart/form-data"
            onSubmit={signUpSubmit}
          >
            <div className="signUpName">
              <PersonAddTwoTone />
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={registerDataChange}
                required
              />
            </div>
            <div className="signUpEmail">
              <MailOutline />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={registerDataChange}
                required
              />
            </div>
            <div className="signUpPassword">
              <LockOpen />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={registerDataChange}
                required
              />
            </div>
            <div className="signUpName">
              <Public />
              <input
                type="text"
                placeholder="Country"
                name="country"
                value={country}
                onChange={registerDataChange}
                required
              />
            </div>
            <div className="signUpName">
              <Language />
              <input
                type="text"
                placeholder="State"
                name="state"
                value={state}
                onChange={registerDataChange}
                required
              />
            </div>
            <div className="signUpName">
              <AddToHomeScreenOutlined />
              <input
                type="text"
                placeholder="Street No"
                name="street"
                value={street}
                onChange={registerDataChange}
                required
              />
            </div>
            <div className="signUpName">
              <FormatListNumbered />
              <input
                type="text"
                placeholder="Zip Code"
                name="zipcode"
                value={zipcode}
                onChange={registerDataChange}
                required
              />
            </div>
            <div className="signUpName">
              <HomeWork />
              <input
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={registerDataChange}
                required
              />
            </div>
            <div id="registerImage">
              {/* <label htmlFor="image" >Upload Image</label> */}
              <img src={imagePreview} alt="User" />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={registerDataChange}
              />
            </div>
  
            {/* <ReCAPTCHA
              sitekey="6Lf0aJopAAAAANgaqvaMiPcjuQbiF9EfCS_ofDot"
              onChange={onChange}
            /> */}
            {/* <div id="registerImage">
              <img src={imagePreview} alt="User" />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={registerDataChange}
              />
            </div> */}
            <input
              disabled={loading}
              type="submit"
              value={"Sign Up"}
              className="signUpBtn"
              style={{ marginTop: "5px" }}
            />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginSignUp;
