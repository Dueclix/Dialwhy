import { useLocation } from "react-router-dom";
import AccountHeader from "./AccountHeader";
import AccountNav from "./AccountNav";
import React from "react";

function AccountLayout({ to, children, title, subTitle }) {
  const location = useLocation();
  return (
    <>
      <AccountHeader to={to} />
      <div className="accounnt_body">
        <div className="container">
          <div className="row justify-content-between">
            <div
              className={`col-lg-4 col-md-4 col-12 ${
                location.pathname === "/checkout" ||
                location.pathname === "/review-checkout"
                  ? "d-none"
                  : ""
              }`}
            >
              <AccountNav />
            </div>
            <div
              className={`${
                location.pathname === "/checkout" ||
                location.pathname === "/review-checkout"
                  ? "col-12 px-0"
                  : "col-lg-8 col-md-8 col-12"
              }`}
            >
              <div className="ml-0 ml-md-4">
                <div className="d-none d-md-block">
                  <div className="row mb-md-5">
                    <div className="col">
                      <h5 className="mb-1 text-white">{title}</h5>
                      <p className="mb-0 text-white small">{subTitle}</p>
                    </div>
                    {/* <div className="col-auto">
                      <a href="account" className=" btn btn-primary btn-sm">
                        {" "}
                        <i className="ti-angle-left"></i> go back
                      </a>
                    </div> */}
                  </div>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountLayout;
