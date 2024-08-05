import { Link, useNavigate } from "react-router-dom";
import Loader from "../Components/Partials/Loader";
import { server } from "../Components/Account";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { data } = await axios.post(`${server}/user/login`, {
        email,
        password,
      });
      setLoading(false);
      // Check if "user" item already exists in localStorage
      if (!localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      if (data?.user?.role === "admin") {
        toast.success(data?.message);
        navigate("/admin-panel");
        window.location.reload();
      } else {
        toast.error("Unauthorized User");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Wrong Credentials");
      console.log(error);
    }
  };

  return (
    <div className="flex max-h-screen mb-[.19rem] min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          className={`mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900`}
        >
          Admin - Sign in to your account
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={loginSubmit}>
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium leading-6 text-gray-900`}
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:text-sm sm:leading-6 px-2"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className={`block text-sm font-medium leading-6 text-gray-900`}
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to={"/forgot-password"}
                  className={`font-semibold hover:font-bold text-black`}
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2 ">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-text-gray-800sm:text-sm sm:leading-6 px-2"
              />
            </div>
          </div>

          <div>
            {loading ? (
              <Loader />
            ) : (
              <button
                type="submit"
                className={`${"text-white bg-black hover:bg-gray-900 flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6  shadow-smfocus-visible:outline focus-visible:outline-2 focus-visible:outline-offappend-2 focus-visible:outline-gray-900 mt-4"}`}
              >
                Sign in
              </button>
            )}
          </div>
        </form>

        <p className="mt-10 text-center bg-white text-sm "></p>
      </div>
    </div>
  );
};

export default LoginForm;
