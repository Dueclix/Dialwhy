import PageHeading from './Partials/PageHeading'
import Layout from './Partials/Layout'
import React from 'react'

const Contact = () => {
    return (
        <>
            <Layout>
                <PageHeading
                    title="Contact Us"
                    subtitle=""
                    image="/assets/img/extra/page-about.jpg"
                />
                <section className="pt-5 pt-md-7">
                    <div className="container">
                        <div className="row justify-content-between">
                            <div className="col-lg-5">
                                <h3 className="m-b10 text-uppercase">Get In Touch</h3>
                                <p className="text2">
                                For inquiry contact via
                                </p>
                                <hr />
                                <p className="text p-sm-b60">
                                    <strong>Email:</strong> support@dialwhy.com
                                    <br />
                                    <strong>Call:</strong> 1.516.822.3100 or 1.631.623.5100
                                    <br />
                                </p>
                                <p className="m-b40 text">
                                2310 Hempstead Turnpike, NY
                                    <br />11554
                                </p>
                            </div>
                            <div className="col-lg-6">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114041.02049143793!2d88.3612319145676!3d26.71941404416647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e44114f5441dcd%3A0xdeb5c4702063edff!2sSiliguri%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1631501341871!5m2!1sen!2sin" width="100%" height="400" style={{border:0}} allowfullscreen="" loading="lazy"></iframe>
                            </div>
                        </div>
                        <div className="row pt-5 pt-md-7">
                            <div className="col-lg-8 mx-auto">
                                <div className="contact-form">
                                    <form id="ajax-form" action="php/mail.php" method="POST" className="form">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="text-left m-b20">
                                                    <div className="form-message"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <input className="form-control" placeholder="Name *" name="name" type="text" />
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-control" placeholder="Email *" name="email" type="text" />
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <input className="form-control" placeholder="Subject" name="subject" type="text" />
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-control" placeholder="Phone" name="phone" type="text" />
                                                </div>
                                            </div>

                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <textarea className="form-control " rows="4" name="message" placeholder="Text Here"></textarea>
                                                </div>
                                            </div>

                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <div className="text-center">
                                                        <button className="btn btn-primary" type="submit" name="submit">SEND MESSAGE</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}

export default Contact