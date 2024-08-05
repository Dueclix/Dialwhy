import PageHeading from './Partials/PageHeading'
import Layout from './Partials/Layout'
import React from 'react'

const GetQuote = () => {
    return (
        <>
            <Layout>
                <PageHeading
                    title="getquote"
                    subtitle="Lorem ipsum dolor sit amet, adipisicing elit."
                    image="/assets/img/extra/page-about.jpg"
                />
                <section className="pt-5 pt-md-7">
                    <div className="container">
                        <div className="row pt-5 pt-md-7">
                            <div className="col-lg-8 mx-auto">
                                <div className="getquote-form">
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

export default GetQuote