import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

function LoginModal({ show, handleClose, handleModalShow }) {
    return (
        <>
            <Modal show={show} onHide={handleClose} centered className='clean_modal clean_modal-lg'>
                <div className="modal-content">
                    <div className="form-group mb-3 p-3 bg-light d-flex justify-content-between align-items-center">
                        <h4 className=' mb-0 text-dark'>Login</h4>
                        <button type="button" className="close text-dark" onClick={handleClose}> <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="login_error d-none">
                            <div className="alert" role="alert">
                            </div>
                        </div>
                        <form action="" id="login_modal_form" method="POST">
                            <div className="form-group">
                                <input name="email" required type="email" placeholder="Email"
                                    className="form-control input-lg rounded" />
                            </div>
                            <div className="form-group">
                                <input name="password" required type="password" placeholder="Password"
                                    className="form-control input-lg rounded" />
                            </div>
                            <button type="submit" id="login_btn" name="submit"
                                className="btn btn-primary btn-full btn-medium rounded">Login</button>
                            <div className="form-group text-center small font-weight-bold mt-3">
                                <Link to="#" onClick={() => handleModalShow('forgot')}> Forgot Password?</Link>
                            </div>
                            <hr className="my-4" />
                            <div className="form-group text-center small font-weight-bold mb-0">
                                Don’t have an account? <Link to="#" onClick={() => handleModalShow('register')}> Register</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default LoginModal;