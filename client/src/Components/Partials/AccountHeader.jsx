import { Link, useLocation } from "react-router-dom";
import React from "react";

function AccountHeader({ to }) {
  const location = useLocation();
  
  return (
    <>
      <div className="accounnt_header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-auto col-12 order-md-2">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link className="text-nowrap mb-4 z-50" to="/">
                      <i className="fa fa-home mr-2"></i>Home
                    </Link>
                  </li>
                  {/* <li className="breadcrumb-item">
                    <Link className="text-nowrap" to={to}>
                      <i className="fa fa-home mr-2"></i>
                      {to.charAt(1).toUpperCase() + to.slice(2)}
                    </Link>
                  </li> */}
                  {/* <li className="breadcrumb-item text-nowrap active text-capitalize" aria-current="page"><Link className="text-nowrap" to="account">{location.pathname.split("/")}</Link></li> */}
                </ol>
              </nav>
            </div>
            <div className="order-md-1 text-center text-md-left col-lg col-12">
              <h1 className="h3 mb-4">
                <Link className="text-capitalize">
                  {/* {location.pathname.split("/")} */}
                </Link>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountHeader;
