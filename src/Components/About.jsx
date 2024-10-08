import PageHeading from "./Partials/PageHeading";
import Layout from "./Partials/Layout";
import React from "react";

function About() {
  return (
    <>
      <Layout>
        <PageHeading
          title="To reach and teach, use 'DIAL-WHY'"
          subtitle="DialWhy.com is a tool to increase your sales!"
          image="/assets/img/extra/page-about.jpg"
        />
        <section className="pt-5">
          <div className="container">
            <h2 className="mb-3">About DialWhy</h2>
            <div className="row">
              <div className="col-lg-7 col-md-6">
                <div className="row">
                  <div className="col-12">
                    <div className="m-b20 m-t10">
                      <p>
                        Welcome to <strong>DialWhy</strong>, your go-to
                        destination for seamless video and audio calling
                        experiences. At DialWhy, we believe in connecting people
                        across the globe effortlessly, making communication more
                        accessible and enjoyable.
                      </p>
                      <p>
                        <strong>Our Mission</strong>
                        <br />
                        Our mission at DialWhy is to revolutionize the way
                        people communicate by providing a user-friendly platform
                        that combines high-quality video and audio calls with
                        advanced features to enhance your conversations.
                      </p>
                      <h6>
                        <strong>What We Offer</strong>
                      </h6>
                      <p>
                        <strong> Crystal Clear Video Calls:</strong> Experience
                        video calls with stunning clarity, whether you're
                        connecting with friends, family, or colleagues.
                      </p>
                      <p>
                        <strong> High-Quality Audio:</strong> Enjoy crisp and
                        clear audio calls that make every conversation feel
                        lifelike.
                      </p>
                      <p>
                        <strong> Secure and Private: </strong> Your privacy and
                        security are our top priorities. With end-to-end
                        encryption, your calls and data remain protected.
                      </p>
                      <p>
                        <strong>Feature-Rich Interface: </strong> Explore a
                        range of features such as screen sharing, messaging, and
                        more to enhance your calling experience.
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="row">
                                <div className="col-sm-6">
                                    <ul className="list list-icon mb-lg-0">
                                        <li>  Lorem ipsum
                                            dolor sit amet</li>
                                        <li>
                                            consectetuer
                                            adipiscing elit. Aenean</li>
                                        <li>  commodo
                                            ligula
                                            eget dolor. Aenean</li>
                                    </ul>
                                </div>
                                <div className="col-sm-6">
                                    <ul className="list list-icon mb-lg-0">
                                        <li>  Lorem ipsum
                                            dolor sit amet</li>
                                        <li>
                                            consectetuer
                                            adipiscing elit. Aenean</li>
                                        <li>  commodo
                                            ligula
                                            eget dolor. Aenean</li>
                                    </ul>
                                </div>
                            </div> */}
              </div>
              <div className="col-lg-5">
                <h5>Why Choose DialWhy?</h5>
                <div className="feature-box icon-left mb-3">
                  <div className="icon-box-info">
                    <h5>Reliability</h5>
                    <p>
                      Count on DialWhy for reliable and uninterrupted calls,
                      whether for personal or professional use.
                    </p>
                  </div>
                </div>
                <div className="feature-box icon-left">
                  <div className="icon-box-info mb-lg-0">
                    <h5>Innovation: </h5>
                    <p className=" mb-lg-0">
                      We're constantly innovating and updating DialWhy to bring
                      you the latest advancements in communication technology.
                    </p>
                  </div>
                </div>
                <div className="feature-box icon-left">
                  <div className="icon-box-info mb-lg-0">
                    <h5>Ease of Use: </h5>
                    <p className=" mb-lg-0">
                      Our intuitive interface makes it easy for anyone to start
                      making calls within minutes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default About;
