/* eslint-disable no-unused-vars */
import Navbar from "./Partials/Navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "./Partials/Footer";
import Loader from "./Partials/Loader";
import { useEffect } from "react";
import "./Styles/Home.css";
import React from "react";

function Home() {
  const testimonialData = [
    {
      image: "assets/images/testi-img-1.png",
      name: "Karinap Lewis",
      role: "Consulting Advisor",
      content:
        "Competently productivate competitive e-business man in time best practices. Enthusiastically conceptualizess multidisciplinary process improvements through king standardized niches. Intrinsicly incubate multimedia based e-services before just our in bangladesh.",
    },
    {
      image: "assets/images/testi-img-2.png",
      name: "Clarence Lewis",
      role: "Chief Advisor",
      content:
        "Competently productivate competitive e-business man in time best practices. Enthusiastically conceptualizess multidisciplinary process improvements through king standardized niches. Intrinsicly incubate multimedia based e-services before just our in bangladesh.",
    },
    {
      image: "assets/images/testi-img-3.png",
      name: "Samantha Harper",
      role: "Head Manager",
      content:
        "Competently productivate competitive e-business man in time best practices. Enthusiastically conceptualizess multidisciplinary process improvements through king standardized niches. Intrinsicly incubate multimedia based e-services before just our in bangladesh.",
    },
    {
      image: "assets/images/testi-img-4.png",
      name: "Jonny Edison",
      role: "Supervisor",
      content:
        "Competently productivate competitive e-business man in time best practices. Enthusiastically conceptualizess multidisciplinary process improvements through king standardized niches. Intrinsicly incubate multimedia based e-services before just our in bangladesh.",
    },
  ];

  useEffect(() => {
    loadCSS(`${process.env.PUBLIC_URL}/assets/css/responsive.css`);
    // loadCSS(`${process.env.PUBLIC_URL}/assets/css/style.css`);
  }, []);

  const loadCSS = (url) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  };

  return (
    <>
      <Loader />
      <Navbar />

      <div className="hero-area d-flex align-items-center">
        <div className="hero-area-shape">
          <img src="assets/images/shape.jpg" alt="#" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="hero-content">
                <div className="hero-content-sub-title ">
                  <h4 className="text-dark home-preheading">
                    <b>
                      Start audio or video call on{" "}
                      <span className="text-danger">'DIAL-WHY'</span>
                    </b>
                  </h4>
                </div>
                <div className="hero-content-main-title">
                  {/* <h2>
                    Start audio or video call on <b>DialWhy.com</b>
                  </h2> */}
                </div>
                <div className="hero-content-discripton">
                  <p style={{ color: "black" }}>
                    Connect with your users in real-time and increase sales by
                    subscribing to <b>DialWhy.com</b>
                  </p>
                </div>
                <div className="hero-content-discripton ">
                  <p style={{ color: "black" }}>
                    Here is the source that you would ever looking for. Make a
                    video call in just in one click and enjoy the taste of vide
                    calling now.
                  </p>
                </div>
                {/* <div className="hero-content-btn">
                  <Link to="#">
                    Go To Profile{" "}
                    <i className="fas fa-long-arrow-alt-right"></i>
                  </Link>
                </div> */}
                {/* <div className="hero-content-video-icon">
                  <Link
                    className="video-vemo-icon venobox vbox-item"
                    data-vbtype="youtube"
                    data-autoplay="true"
                    to="https://youtu.be/BS4TUd7FJSg"
                  >
                    <i className="fa fa-play"></i>
                  </Link>
                </div> */}
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="hero-area-thumb bounce-animate">
                <img
                  src="assets/images/hero.png"
                  className="img-fluid"
                  alt="#"
                />
              </div>
            </div>
            <div className="hero-shape-1">
              <img src="assets/images/shape 1.png" alt="#" />
            </div>
            <div className="hero-shape-2 rotateme">
              <img src="assets/images/shape 2.jpg" alt="#" />
            </div>
            <div className="hero-shape-3 bounce-animate3">
              <img src="assets/images/shape 3.jpg" alt="#" />
            </div>
            <div className="hero-shape-4">
              <img src="assets/images/shape 5.png" alt="#" />
            </div>
            <div className="hero-shape-5 rotateme">
              <img src="assets/images/circle-shape-4.png" alt="#" />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="container-lg mb-5">
        <div className="row">
          <div className="col-12 px-2">
            <div className="card border-0 shadow mb-4">
              <div className="card-body row align-items-center bg-primary py-4" style={{backgroundColor: "#0084E9", borderRadius: "30px"}}>
                <div className="col-md-6">
                  <h1 className="card-title text-white mb-4">
                    How to start video call on DiaWhy.com?
                  </h1>
                </div>
                <div className="col-md-6">
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe
                      title="Video 1"
                      style={{borderRadius: "30px", aspectRatio: "9/16"}}
                      className="embed-responsive-item"
                      src="https://dialwhy.com//videos/vd-01.mp4"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 px-2">
            <div className="card border-0 shadow mb-4">
              <div className="card-body row align-items-center py-4" style={{backgroundColor: "#5D2FF1", borderRadius: "30px"}}>
                <div className="col-md-6">
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe
                      title="Video 2"
                      className="embed-responsive-item"
                      style={{borderRadius: "30px", aspectRatio: "9/16" }}
                      src="https://dialwhy.com//videos/vd-02.mp4"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="col-md-6">
                  <h1 className="card-title text-white mb-4">
                    DialWhy.com is a tool to increase your sales!
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="service-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center">
                <div className="section-sub-title">
                  <h4>SERVICES</h4>
                </div>
                <div className="section-main-title">
                  <h3>
                    Our Best <span>Service</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row pd-top">
            <div className="col-lg-4 col-md-6">
              <div className="single-service-box">
                <div className="service-box-content">
                  <div className="service-thumb">
                    <img src="assets/images/service-icon-1.png" alt="#" />
                  </div>
                  <div className="service-box-content-title">
                    <h3>SEO & Backlinks</h3>
                  </div>
                  <div className="service-box-discripton">
                    <p>
                      innovate prospective communitiesils
                      itCompellinglydisseminatestrategics heareas. Compellingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-service-box upper-1">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <img src="assets/images/service-icon-2.png" alt="#" />
                  </div>
                  <div className="service-box-content-title">
                    <h3>Email Marketing</h3>
                  </div>
                  <div className="service-box-discripton">
                    <p>
                      innovate prospective communitiesils
                      itCompellinglydisseminatestrategics heareas. Compellingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-service-box upper-2">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <img src="assets/images/serviec-icon-3.png" alt="#" />
                  </div>
                  <div className="service-box-content-title">
                    <h3>Responsive Design</h3>
                  </div>
                  <div className="service-box-discripton">
                    <p>
                      innovate prospective communitiesils
                      itCompellinglydisseminatestrategics heareas. Compellingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-service-box upper-3">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <img src="assets/images/sevice-icon-4.png" alt="#" />
                  </div>
                  <div className="service-box-content-title">
                    <h3>Design Thinking</h3>
                  </div>
                  <div className="service-box-discripton">
                    <p>
                      innovate prospective communitiesils
                      itCompellinglydisseminatestrategics heareas. Compellingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-service-box upper-4">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <img src="assets/images/service-icon-5.png" alt="#" />
                  </div>
                  <div className="service-box-content-title">
                    <h3>Optimization</h3>
                  </div>
                  <div className="service-box-discripton">
                    <p>
                      innovate prospective communitiesils
                      itCompellinglydisseminatestrategics heareas. Compellingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-service-box upper-5">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <img src="assets/images/service-icon-6.png" alt="#" />
                  </div>
                  <div className="service-box-content-title">
                    <h3>Responsive Design</h3>
                  </div>
                  <div className="service-box-discripton">
                    <p>
                      innovate prospective communitiesils
                      itCompellinglydisseminatestrategics heareas. Compellingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="about-area about-area1">
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-lg-6"
              style={{
                borderRight: "5px solid #b9b5b5",
                paddingTop: "40px",
                paddingBottom: "40px",
              }}
            >
              <div className="about-thumb text-center">
                <div className="video-div video1-div">
                  {/* <img src="assets/images/video-thumbnail1.jpg" className="img-fluid" alt="" data-bs-toggle="modal" data-bs-target="#exampleModal" />
                  <h6 className="mt-3">DialWhy.com is a tool to increase your sales!</h6> */}

                  <div
                    className="play-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  ></div>
                  <div className="video-heading-div">
                    <h3>DialWhy.com is a tool to increase your Sales!</h3>
                  </div>
                </div>
                {/* <!-- Modal --> */}
                <div
                  className="modal fade mt-5"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog mt-5">
                    <div className="modal-content">
                      {/* <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div> */}
                      <div className="about-thumb text-center">
                        <div className="embed-responsive embed-responsive-16by9">
                          {/* <iframe
                            title="Video 1"
                            className="embed-responsive-item"
                            style={{ borderRadius: "2px", aspectRatio: "9/16" }}
                            src="https://dialwhy.com//videos/vd-01.mp4"
                            allowFullScreen
                            muted
                          ></iframe> */}
                          <video controls>
                            <source
                              src="https://dialwhy.com//videos/vd-01.mp4"
                              className="embed-responsive-item"
                              style={{
                                borderRadius: "2px",
                                aspectRatio: "9/16",
                              }}
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-title">
                {/* <div className="section-sub-title ">
                  <h4>Increase Sale</h4>
                </div> */}
                <div className="section-main-title">
                  <h3>
                    {" "}
                    <span> DialWhy.com </span> is a tool
                  </h3>
                  <h3>to increase your Sales!</h3>
                </div>
                <div className="section-discription">
                  <p
                    className=""
                    style={{
                      fontWeight: 600,
                      fontSize: "17.5px",
                      color: "black",
                    }}
                  >
                    Embedding a customized link on your website will allow you
                    to stay in contact with your clients 24/7 in real-time.
                  </p>
                </div>
                <div
                  className="alert alert-light"
                  role="alert"
                  style={{
                    borderLeft: "5px solid #5d2ff1",
                    fontWeight: 600,
                    color: "black",
                  }}
                >
                  Login to DialWhy.com and create personalized link.
                </div>
                <div
                  className="alert alert-light"
                  role="alert"
                  style={{
                    borderLeft: "5px solid #5d2ff1",
                    fontWeight: 600,
                    color: "black",
                  }}
                >
                  Take the link and place it on your website in a suitable spot.{" "}
                </div>
              </div>
              {/* <div className="row">
                <div className="col-lg 6  col-md-12">
                  <div className="about-single-box-items">
                    <div className="about-icon-thumb">
                      <img src="assets/images/About-item icon.png" alt="#" />
                    </div>
                    <div className="about-content">
                      <div className="about-title">
                        <h5>Extra benefit through Invest</h5>
                      </div>
                      <div className="about-discription">
                        <p>
                          From banking and insurance to wealth management and
                          world securities distribution, we dedicated financial.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="about-single-box-items">
                    <div className="about-icon-thumb">
                      <img src="assets/images/about-icon-1.png" alt="#" />
                    </div>
                    <div className="about-content">
                      <div className="about-title">
                        <h5>Expand profit and reduce Taxt</h5>
                      </div>
                      <div className="about-discription">
                        <p>
                          From banking and insurance to wealth management and
                          world securities distribution, we dedicated financial.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="digecoly-btn">
                <Link to="#">
                  About Us<i className="fas fa-long-arrow-alt-right"></i>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="about-area about-area2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="section-title">
                {/* <div className="section-sub-title ">
                  <h4>Video Call</h4>
                </div> */}
                <div className="section-main-title">
                  <h3> Start video call </h3>
                  <h3>
                    on <span> DialWhy.com </span>
                  </h3>
                </div>
                <div className="section-discription">
                  <p
                    className=""
                    style={{
                      fontWeight: 600,
                      fontSize: "17.5px",
                      color: "black",
                    }}
                  >
                    You can initiate a video or audio call on DiaWhy.com without
                    disclosing your telephone number to anyone.
                  </p>
                </div>
                <div
                  className="alert alert-light"
                  role="alert"
                  style={{
                    borderLeft: "5px solid #5d2ff1",
                    fontWeight: 600,
                    color: "black",
                  }}
                >
                  Login to DialWhy.com and create personalized link.
                </div>
                <div
                  className="alert alert-light"
                  role="alert"
                  style={{
                    borderLeft: "5px solid #5d2ff1",
                    fontWeight: 600,
                    color: "black",
                  }}
                >
                  Take the link and place it on your website in a suitable spot.{" "}
                </div>
              </div>
              {/* <div className="row">
                <div className="col-lg 6  col-md-12">
                  <div className="about-single-box-items">
                    <div className="about-icon-thumb">
                      <img src="assets/images/About-item icon.png" alt="#" />
                    </div>
                    <div className="about-content">
                      <div className="about-title">
                        <h5>Extra benefit through Invest</h5>
                      </div>
                      <div className="about-discription">
                        <p>
                          From banking and insurance to wealth management and
                          world securities distribution, we dedicated financial.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="about-single-box-items">
                    <div className="about-icon-thumb">
                      <img src="assets/images/about-icon-1.png" alt="#" />
                    </div>
                    <div className="about-content">
                      <div className="about-title">
                        <h5>Expand profit and reduce Taxt</h5>
                      </div>
                      <div className="about-discription">
                        <p>
                          From banking and insurance to wealth management and
                          world securities distribution, we dedicated financial.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="digecoly-btn">
                <Link to="#">
                  About Us<i className="fas fa-long-arrow-alt-right"></i>
                </Link>
              </div> */}
            </div>
            <div
              className="col-lg-6"
              style={{
                borderLeft: "5px solid #b9b5b5",
                paddingLeft: "50px",
                paddingTop: "40px",
                paddingBottom: "40px",
                paddingRight: "0px",
              }}
            >
              <div className="about-thumb text-center">
                <div className="video-div video2-div">
                  {/* <img src="assets/images/video-thumbnail2.jpg" className="img-fluid" alt="" data-bs-toggle="modal" data-bs-target="#exampleModal2" />
                  <h6 className="mt-3">How to start video call on DialWhy.com?</h6> */}

                  <div
                    className="play-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal2"
                  ></div>
                  <div className="video-heading-div">
                    <h3>How to start video call on DialWhy.com?</h3>
                  </div>
                </div>
                {/* <!-- Modal --> */}
                <div
                  className="modal fade mt-5"
                  id="exampleModal2"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog mt-5">
                    <div className="modal-content">
                      {/* <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div> */}
                      <div className="about-thumb text-center">
                        <div className="embed-responsive embed-responsive-16by9">
                          {/* <iframe
                            title="Video 2"
                            className="embed-responsive-item"
                            style={{ borderRadius: "2px", aspectRatio: "9/16" }}
                            src="https://dialwhy.com//videos/vd-02.mp4"
                            allowFullScreen
                            autoPlay={false}
                            muted
                          ></iframe> */}
                          <video controls>
                            <source
                              src="https://dialwhy.com//videos/vd-02.mp4"
                              className="embed-responsive-item"
                              style={{
                                borderRadius: "2px",
                                aspectRatio: "9/16",
                              }}
                            />
                          </video>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="service-area pt-4"
        style={{ padding: 0, margin: 0, textAlign: "center" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center">
                <div className="section-main-title">
                  <h3>
                    Our<span>&#160; Sponsors</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row pd-top">
            <div className="col-lg-3 col-md-5">
              <div className="single-service-box">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <Link to="https://infotaxsquare.academy/" target="_blank">
                      <img
                        src="assets/images/brand-logo-1.png"
                        width={"80%"}
                        alt="#"
                        style={{ maxWidth: "200px" }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-5">
              <div className="single-service-box upper-1">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <Link to="https://www.dueclix.com/" target="_blank">
                      <img
                        src="assets/images/brand-logo-2.png"
                        width={"80%"}
                        alt="#"
                        style={{ maxWidth: "200px" }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-5">
              <div className="single-service-box upper-2">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <Link to="https://lockinledger.com/" target="_blank">
                      <img
                        src="assets/images/brand-logo-3.png"
                        width={"80%"}
                        alt="#"
                        style={{ maxWidth: "200px" }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-5">
              <div className="single-service-box upper-3">
                <div className="service-box-content text-center">
                  <div className="service-thumb">
                    <Link to="https://infotaxsquare.com/" target="_blank">
                      <img
                        src="assets/images/brand-logo-4.png"
                        width={"80%"}
                        alt="#"
                        style={{ maxWidth: "200px" }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="about-area">
        <div className="container">
          <div className="row ">
            <div className="col-lg-6">
              <div className="section-title">
                <div className="section-sub-title">
                  <h4>DialWhy.com</h4>
                </div>
                <div className="section-main-title">
                  <h3> <span> DialWhy.com </span> is a tool</h3>
                  <h3>
                  to increase your Sales!
                  </h3>
                </div>
                <div className="section-discription">
                  <p>
                  Embedding a customized link on your website will allow you to stay in contact with your clients 24/7 in real-time.
                  </p>
                  <p>
                  To login to your account, you must first sign up using your email address and password.
                  </p>
                  <p>
                  What are the steps to initiate an audio and video call on DialWhy.com?
                  </p>
                </div>
              </div>
              <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    Step One
                    </button>
                  </h2>
                  <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">Login to DialWhy.com and create personalized link. For example "InfoTaxSquare-Hotline-To-Reach-Us-Anytime".</div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                    Step Two
                    </button>
                  </h2>
                  <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">Take the link and place it on your website in a suitable spot. Your user will use the link and connect with you instantly if you are logged in and ready to greet.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-thumb text-center">
                <img src="assets/images/video-thumbnail1.jpg" alt="#" />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="work-process-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center">
                <div className="section-sub-title">
                  <h4>Work Process</h4>
                </div>
                <div className="section-main-title">
                  <h3>
                    We Follow Four Simple <span>Steps</span>
                  </h3>
                </div>
                <div className="section-discription work-process">
                  <p>
                    Holisticly incubate adaptive via interactive scenarios our
                    conceptualize Enthusiastically productize highly efficient
                    process{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="work-process-single-box work-1">
                <div className="process-single-box-thumb">
                  <img src="assets/images/work-1.jpg" alt="#" />
                </div>
                <div className="work-process-content">
                  <div className="work-process-content-title">
                    <h4>Discussion</h4>
                  </div>
                  <div className="work-process-content-discription">
                    <p>
                      Professional alignments holisticly facilitate stadards
                      compliant niches Congratulation martin
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="work-process-single-box work-2">
                <div className="process-single-box-thumb">
                  <img src="assets/images/work-2.jpg" alt="#" />
                </div>
                <div className="work-process-content">
                  <div className="work-process-content-title">
                    <h4>Testing & Trying</h4>
                  </div>
                  <div className="work-process-content-discription">
                    <p>
                      Professional alignments holisticly facilitate stadards
                      compliant niches Congratulation martin
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="work-process-single-box work-3">
                <div className="process-single-box-thumb">
                  <img src="assets/images/work-3.jpg" alt="#" />
                </div>
                <div className="work-process-content">
                  <div className="work-process-content-title">
                    <h4>Ideas & Concept</h4>
                  </div>
                  <div className="work-process-content-discription">
                    <p>
                      Professional alignments holisticly facilitate stadards
                      compliant niches Congratulation martin
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="work-process-single-box work-4">
                <div className="process-single-box-thumb">
                  <img src="assets/images/work-4.jpg" alt="#" />
                </div>
                <div className="work-process-content">
                  <div className="work-process-content-title">
                    <h4>Execute & Install</h4>
                  </div>
                  <div className="work-process-content-discription">
                    <p>
                      Professional alignments holisticly facilitate stadards
                      compliant niches Congratulation martin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="work-process-shape">
            <img src="assets/images/process-shape.png" alt="#" />
          </div>
        </div>
      </div> */}

      {/* <div className="about-style-tow">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="section-title">
                <div className="section-main-title">
                  <h3>
                    <span>ChatBot</span> Platform Works
                  </h3>
                  <h3>With Your Favorite Tools</h3>
                </div>
                <div className="section-discription">
                  <p>
                    This is the main factor that sets us apart from our
                    competition allows us to deliver specialist business
                    consultancy service team applie our clients to achieve
                    objectives.
                  </p>
                </div>
                <div className="section-discription">
                  <p>
                    From banking and insurance to wealth management and world
                    bangladeshis securities distribution, we dedicated financial
                    From banking and insurance wealth management and world
                    securities distribution, we dedicated we dedicated financial
                    From banking.
                  </p>
                </div>
              </div>
              <div className="digecoly-btn">
                <Link to="#">
                  Read more <i className="fas fa-long-arrow-alt-right"></i>
                </Link>
              </div>
              <div className="about-style-tow-video-icon">
                <Link
                  className="video-vemo-icon venobox vbox-item"
                  data-vbtype="youtube"
                  data-autoplay="true"
                  href="https://youtu.be/BS4TUd7FJSg"
                >
                  <i className="fa fa-play"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-styel-two-thumb bounce-animate4">
                <img src="assets/images/about-2.jpg" alt="#" />
                <div className="about-style-shape-1">
                  <img src="assets/images/about-2-shape-1.png" alt="#" />
                </div>
                <div className="about-style-shape-2">
                  <img src="assets/images/about-2-shape-2.png" alt="#" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="about-style-three">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 ">
              <div className="about-style-three-thumb bounce-animate2">
                <img src="assets/images/about-3.jpg" alt="#" />
                <div className="about-style-three-shape-1">
                  <img src="assets/images/about-style-3-shape-1.png" alt="#" />
                </div>
                <div className="about-style-three-shape-2">
                  <img
                    src="assets/images/about-style-3-shape-1 (2).png"
                    alt="#"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-title">
                <div className="section-main-title">
                  <h3>We're Building a Sustainable</h3>
                  <h3>
                    and Exquisite <span>Future</span>
                  </h3>
                </div>
                <div className="section-discription">
                  <p>
                    From banking and insurance to wealth management and world
                    bangladeshis securities distribution, we dedicated financial
                    From banking and insurance us wealth management and world
                    securities distribution, we dedicated our land we dedicated
                    financial From banking.From banking and insurance to wealth
                    management and world bangladeshis securities distribution,
                    we dedicated financial From banking and insurance
                  </p>
                </div>
                <div className="digecoly-btn">
                  <Link to="#">
                    Read more <i className="fas fa-long-arrow-alt-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="testimonial-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="section-title">
                <div className="section-sub-title">
                  <h4>Our Testimonial</h4>
                </div>
                <div className="section-main-title">
                  <h3>We are very glad to</h3>
                  <h3>
                    get client <span>review</span>
                  </h3>
                </div>
                <div className="section-discription testi">
                  <p>
                    This is the main factor that sets apart from our us to
                    deliver a specialist business consultancy our clients to
                    achieve objectives.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <OwlCarousel
                  className="owl-theme testi-list1"
                  loop
                  margin={10}
                  items={1}
                  dots={false}
                  nav={false}
                >
                  {testimonialData.map((testimonial, index) => (
                    <div key={index} className="testimonial-content">
                      <div className="testimonial-thumb">
                        <img
                          style={{ width: "100px" }}
                          src={testimonial.image}
                          alt="#"
                        />
                      </div>
                      <div className="testimonial-content-discription">
                        <p>{testimonial.content}</p>
                      </div>
                      <div className="testimonial-content-title text-center">
                        <h5>{testimonial.name}</h5>
                        <h6>{testimonial.role}</h6>
                      </div>
                    </div>
                  ))}
                </OwlCarousel>
              </div>
            </div>
            <div className="testimonial-bg">
              <img src="assets/images/testi-bg.jpg" alt="#" />
            </div>
            <div className="testimonial-shape">
              <img src="assets/images/testi-shape.png" alt="#" />
            </div>
            <div className="testimonial-thumb-1">
              <img src="assets/images/testi-img-2.png" alt="#" />
            </div>
            <div className="testimonial-thumb-2">
              <img src="assets/images/testi-img-3.png" alt="#" />
            </div>
            <div className="testimonial-thumb-3">
              <img src="assets/images/testi-img-4.png" alt="#" />
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="team-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center">
                <div className="section-sub-title">
                  <h4>Our Team</h4>
                </div>
                <div className="section-main-title">
                  <h3>
                    Meet Our Team <span>Members</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="single-team">
                <div className="team-thumb">
                  <img src="assets/images/team-thumb-1.jpg" alt="#" />

                  <div className="team-share-social">
                    <div className="team-icon">
                      <span>+</span>
                    </div>
                    <div className="team-social-icon">
                      <Link to="#">
                        <i className="fas fa-map-marker-alt"></i>
                      </Link>
                      <Link to="#">
                        <i className="fab fa-twitter"></i>
                      </Link>
                      <Link to="#">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="team-content text-center">
                  <Link to="#">
                    <h4>Samantha harper</h4>
                  </Link>
                  <h6>Head Manager</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="single-team">
                <div className="team-thumb">
                  <img src="assets/images/team-thumb-2.jpg" alt="#" />

                  <div className="team-share-social">
                    <div className="team-icon">
                      <span>+</span>
                    </div>
                    <div className="team-social-icon">
                      <Link to="#">
                        <i className="fas fa-map-marker-alt"></i>
                      </Link>
                      <Link to="#">
                        <i className="fab fa-twitter"></i>
                      </Link>
                      <Link to="#">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="team-content text-center">
                  <Link to="#">
                    <h4>Clarence Lewis</h4>
                  </Link>
                  <h6>CEO Comapany</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="single-team">
                <div className="team-thumb">
                  <img src="assets/images/team-thumb-3.jpg" alt="#" />

                  <div className="team-share-social">
                    <div className="team-icon">
                      <span>+</span>
                    </div>
                    <div className="team-social-icon">
                      <Link to="#">
                        <i className="fas fa-map-marker-alt"></i>
                      </Link>
                      <Link to="#">
                        <i className="fab fa-twitter"></i>
                      </Link>
                      <Link to="#">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="team-content text-center">
                  <Link to="#">
                    <h4>Clarence Lewis</h4>
                  </Link>
                  <h6>Chief Advisor</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="single-team">
                <div className="team-thumb">
                  <img src="assets/images/team-thumb-4.jpg" alt="#" />

                  <div className="team-share-social">
                    <div className="team-icon">
                      <span>+</span>
                    </div>
                    <div className="team-social-icon">
                      <Link to="#">
                        <i className="fas fa-map-marker-alt"></i>
                      </Link>
                      <Link to="#">
                        <i className="fab fa-twitter"></i>
                      </Link>
                      <Link to="#">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="team-content text-center">
                  <Link to="#">
                    <h4>Jonny Edison</h4>
                  </Link>
                  <h6>Supervisor</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="pricing-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center">
                <div className="section-sub-title">
                  <h4>Video Call</h4>
                </div>
                <div className="section-main-title">
                  <h3>Start Video Call on DiaWhy.com</h3>
                </div>
                <div className="section-discription pricing">
                  <p>
                  You can initiate a video or audio call on DiaWhy.com without disclosing your telephone number to anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="single-pricing">
                <div className="pricing-content">
                  <div className="pricing-top-bar">
                    <div className="pricing-title">
                      <h6>Startup</h6>
                    </div>
                    <div className="pricing-items">
                      <span className="dolar-sign">$</span>
                      <span className="price-doller">29</span>
                      <span className="month-inner">/ month</span>
                    </div>
                    <div className="pricing-discription">
                      <p>
                        Dramatically aggregate unique platforms via open-source
                        methodologies.
                      </p>
                    </div>
                  </div>
                  <div className="priching-body">
                    <ul>
                      <li>
                        <i className="fas fa-check"></i> Lorem ipsum dolor
                      </li>
                      <li>
                        <i className="fas fa-check"></i> Sit amet consetetur set
                        a ledip.
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-btn">
                    <Link to="#">
                      Choos Plan <i className="fas fa-long-arrow-alt-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-pricing">
                <div className="pricing-content">
                  <div className="pricing-top-bar">
                    <div className="pricing-title">
                      <h6>Basic</h6>
                    </div>
                    <div className="pricing-items">
                      <span className="dolar-sign">$</span>
                      <span className="price-doller">59</span>
                      <span className="month-inner">/ month</span>
                    </div>
                    <div className="pricing-discription">
                      <p>
                        Dramatically aggregate unique platforms via open-source
                        methodologies.
                      </p>
                    </div>
                  </div>
                  <div className="priching-body">
                    <ul>
                      <li>
                        <i className="fas fa-check"></i> Lorem ipsum dolor
                      </li>
                      <li>
                        <i className="fas fa-check"></i> Sit amet consetetur set
                        a ledip.
                      </li>
                      <li>
                        <i className="fas fa-check"></i> Lorems Sit ledip ipsum
                        dolor.
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-btn">
                    <Link to="#">
                      Choos Plan <i className="fas fa-long-arrow-alt-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-pricing">
                <div className="pricing-content">
                  <div className="pricing-top-bar">
                    <div className="pricing-title">
                      <h6>Advanced</h6>
                    </div>
                    <div className="pricing-items">
                      <span className="dolar-sign">$</span>
                      <span className="price-doller">79</span>
                      <span className="month-inner">/ month</span>
                    </div>
                    <div className="pricing-discription">
                      <p>
                        Dramatically aggregate unique platforms via open-source
                        methodologies.
                      </p>
                    </div>
                  </div>
                  <div className="priching-body">
                    <ul>
                      <li>
                        <i className="fas fa-check"></i> Lorem ipsum dolor
                      </li>
                      <li>
                        <i className="fas fa-check"></i> Sit amet consetetur set
                        a ledip.
                      </li>
                      <li>
                        <i className="fas fa-check"></i> Lorems Sit ledip ipsum
                        dolor.
                      </li>
                      <li>
                        <i className="fas fa-check"></i> Lorem ipsum dolor.
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-btn">
                    <Link to="#">
                      Choos Plan <i className="fas fa-long-arrow-alt-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="brand-area">
        <div className="container">
          <div className="row">
            <div className="brand-list owl-carousel">
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-1.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo2.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-3.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-4.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-5.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-6.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-1.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo2.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-3.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-4.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-5.jpg" alt="#" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="brand-logo">
                  <img src="assets/images/brand-logo-6.jpg" alt="#" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <Footer />

      <a href="#nav" className="prgoress_indicator active-progress">
        <svg
          className="progress-circle svg-content"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            //   "
          ></path>
        </svg>
      </a>
    </>
  );
}

export default Home;
