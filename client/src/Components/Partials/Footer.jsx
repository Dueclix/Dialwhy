import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { server } from "../LoginSignup";
import axios from "axios";

function Footer() {
  const [footerLinks, setFooterLinks] = useState([]);
  const [footer2Links, setFooter2Links] = useState([]);

  const getFooterLinks = async () => {
    const { data } = await axios.get(`${server}/get-link`);
    setFooterLinks(data.footerNavigation);
    setFooter2Links(data.footer2Navigation);
  };
  useEffect(() => {
    getFooterLinks();
  }, []);
  return (
    <>
      <div className=" foter-area">
        <div className="container-md">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="foter-box">
                <div className="foter-logo">
                  <img src="/assets/images/dialwhy logo/dial-09.png" alt="#" />
                </div>
                <div className="foter-discription">
                  <p>To reach and teach, use 'DIAL-WHY'</p>
                </div>
                {/* <div className="foter-social-icon">
                  <ul>
                    <li>
                      <Link to="#">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-pinterest-p"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div> */}
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="foter-box">
                <div className="foter-title">
                  <h5>Quick Links</h5>
                </div>
                <div className="foter-text-list">
                  <ul>
                    {/* {footerLinks.map((item) => ( */}
                    <li>
                      <Link to={"/"}>
                        <i className="fas fa-angle-double-right"></i>
                        Home
                      </Link>
                    </li>

                    <li>
                      <a href={"https://dialwhy.com/about_us.php"}>
                        <i className="fas fa-angle-double-right"></i> About Us
                      </a>
                    </li>

                    <li>
                      <a href={"https://dialwhy.com/contact_us.php"}>
                        <i className="fas fa-angle-double-right"></i> Contact Us
                      </a>
                    </li>
                    {/* ))} */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="foter-box">
                <div className="foter-title">
                  <h5>Policy</h5>
                </div>
                <div className="foter-text-list">
                  <ul>
                    <li>
                      <a href="https://dialwhy.com/privacy.php">
                        <i className="fas fa-angle-double-right"></i> Privacy
                        Policy
                      </a>
                    </li>
                    <li>
                      <a href="https://dialwhy.com/terms.php">
                        <i className="fas fa-angle-double-right"></i> Terms of
                        Services
                      </a>
                    </li>
                    <li>
                      <a href="https://dialwhy.com/return.php">
                        <i className="fas fa-angle-double-right"></i> Return
                        Policy
                      </a>
                    </li>

                    <li>
                      <a href="https://dialwhy.com/refund.php">
                        <i className="fas fa-angle-double-right"></i>Refund
                        Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-3 col-md-6">
              <div className="foter-box">
                <div className="foter-title">
                  <h5>Newsletter</h5>
                </div>
                <div className="foter-form-box">
                  <input
                    type="text"
                    name="email address*"
                    placeholder="email address"
                  />
                </div>
                <div className="submit-btn">
                  <button type="submit">
                    subscribe <span>+</span>
                  </button>
                </div>
              </div>
            </div> */}
            <div className="col-md-12">
              <div className="copyright-text text-center">
                <p className="mb-1">
                  Copyright © 2024 DailWhy.com All Rights Reserved.
                </p>
                <p className="mb-0">
                  For inquiry contact via email at{" "}
                  <b> support@dialwhy.com Call </b>: 1.516.822.3100 or
                  1.631.623.5100 <b> Address </b>: 2310 Hempstead Turnpike, NY
                  11554
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
