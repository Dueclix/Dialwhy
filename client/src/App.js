import DashboardLink from "./pages/navigationLinks/dashboard/dashboard";
import AccountLink from "./pages/navigationLinks/account/account.jsx";
import Footer2Link from "./pages/navigationLinks/footer/footer2.jsx";
import NavbarLink from "./pages/navigationLinks/navbar/navbar.jsx";
import FooterLink from "./pages/navigationLinks/footer/footer.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ChangeBackground from "./Components/ChangeBackgroud.jsx";
import CreateLink from "./pages/navigationLinks/createLink.jsx";
import UpdateLink from "./pages/navigationLinks/updateLink.jsx";
import VideoBackground from "./Components/VideoBackground.jsx";
import LandingPage from "./pages/Landing-Page/LandingPage.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import Changepassword from "./Components/Changepassword.jsx";
import CheckoutReview from "./Components/CheckoutReview.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import PendingUsers from "./pages/View-Users/PendingUsers";
import CreateMember from "./Components/CreateMembers.jsx";
import EditUser from "./pages/Create-Users/CreateUsers";
import ViewUsers from "./pages/View-Users/ViewUsers";
import LoginSignup from "./Components/LoginSignup";
import Mymembers from "./Components/Mymembers.jsx";
import EditAPIKeys from "./pages/EditAPIKeys.jsx";
import CreateRoom from "./Components/CreateRoom";
import GetQuote from "./Components/GetQuote.jsx";
import Checkout from "./Components/Checkout.jsx";
import EditRoom from "./Components/EditRoom.jsx";
import Contact from "./Components/Contact.jsx";
import Privacy from "./Components/Privacy.jsx";
import Payment from "./Components/Payment.jsx";
import AskToJoin from "./Components/Room2.jsx";
import MyAccount from "./Components/Account";
import userStyles from "./User.module.css";
import LoginForm from "./pages/login.jsx";
import { Toaster } from "react-hot-toast";
import ZegoAPI from "./pages/zegoAPI.jsx";
import Room from "./Components/Room.jsx";
import styles from "./Admin.module.css";
import About from "./Components/About";
import Rooms from "./Components/Rooms";
import Home from "./Components/Home";
import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const body = document.querySelector("body");
    if (window.location.pathname.includes("/admin")) {
      body.classList.add(styles.bodyStyles); // Apply styles for Admin route
    } else {
      body.classList.add(userStyles.bodyStyles);
    }
    return () => {
      body.classList.remove(styles.bodyStyles);
    };
  }, []);

  function RedirectToPHPFile() {
    useEffect(() => {
      // Redirect to the PHP file
      window.location.href = "/path/to/file.php";
      // Reload the page after redirection
      window.location.reload();
    }, []);
    // Return null as we are redirecting and reloading
    return null;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/account" element={<MyAccount />} />
          <Route exact path="/room/:roomId" element={<Room />} />
          <Route exact path="/createroom" element={<CreateRoom />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/login" element={<LoginSignup />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
          <Route
            exact
            path="/password/reset/:token"
            element={<ResetPassword />}
          />
          <Route exact path="/rooms" element={<Rooms />} />
          <Route exact path="/permission/:roomId" element={<AskToJoin />} />
          <Route exact path="/room/edit/:id" element={<EditRoom />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/privacy" element={<Privacy />} />
          <Route exact path="/change-password" element={<Changepassword />} />
          <Route exact path="/my-members" element={<Mymembers />} />
          <Route exact path="/create-members" element={<CreateMember />} />
          <Route exact path="/get-quote" element={<GetQuote />} />
          <Route exact path="/video-background" element={<VideoBackground />} />
          <Route
            exact
            path="/change-background"
            element={<ChangeBackground />}
          />
          <Route exact path="/payment" element={<Payment />} />
          <Route exact path="/checkout" element={<Checkout />} />
          <Route path="/phpfile" element={<RedirectToPHPFile />} />
          <Route exact path="/review-checkout" element={<CheckoutReview />} />
          {/* Admin Routes  */}
          <Route path="/admin-panel" element={<LandingPage />} />
          <Route path="/admin/login" element={<LoginForm />} />
          <Route path="/admin/edit-user/:id" element={<EditUser />} />
          <Route path="/admin/view-users" element={<ViewUsers />} />
          <Route path="/admin/pending-users" element={<PendingUsers />} />
          <Route path="/admin/zego-api" element={<ZegoAPI />} />
          <Route path="/admin/update-link/:id" element={<UpdateLink />} />
          <Route path="/admin/create-link" element={<CreateLink />} />
          <Route path="/admin/navbar-links" element={<NavbarLink />} />
          <Route path="/admin/footer-links" element={<FooterLink />} />
          <Route path="/admin/footer2-links" element={<Footer2Link />} />
          <Route path="/admin/account-links" element={<AccountLink />} />
          <Route path="/admin/dashboard-links" element={<DashboardLink />} />
          <Route path="/admin/zego-api/edit/:id" element={<EditAPIKeys />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
