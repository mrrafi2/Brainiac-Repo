import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Blogs from "../blogs";
import Category from "../category";
import FollowUs from "../follow";
import Popular from "../popular";
import Recent from "../recent";
import SearchBar from "../searchbar";
import ReactDOM from "react-dom";

export default function Home() {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blastMode, setBlastMode] = useState(false);

  const modalMessages = [
    "Write like you're whispering secrets to a friend at midnight-honest, raw, and a bit daring.",
    "Activate your neural circuits; your words are your power!",
    "Empower your synthesis—write a blog that echoes in eternity!",
    "Engage your futuristic engine; let your creativity ignite!",
    "Initialize creative mode: Your blog is ready to be launched!",
    "Don't settle for safe words—unleash your quirky, poetic soul and let your authentic voice light up the digital space.",
    "In a sea of fleeting content, dare to be a lighthouse: steady, authentic, and ever guiding those seeking a real connection.",
    "Imagine each blog post as a conversation with your future self, filled with the wisdom of yesteryear and the promise of tomorrow."


  ];

  const handleOpenModal = () => {
    const randomIndex = Math.floor(Math.random() * modalMessages.length);
    setModalMessage(modalMessages[randomIndex]);
    setOpenModal(true);
    setShowProgress(false);
    setProgress(0);
    setBlastMode(false);
  };

  const handleGoButton = () => {
    setShowProgress(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setBlastMode(true);
        setTimeout(() => {
          setOpenModal(false);
          navigate("/write");
        }, 500);
      }
    }, 100);
  };

  const closeModal = () => {
    setOpenModal(false)
  } ;

  const modalOverlay = (
    <div className={`robotic-modal ${blastMode ? "blast" : ""}`}>
      <div className="modal-content">
        <p className="modal-message">{modalMessage}</p>
        {!showProgress && (
          <div className="d-flex" style={{width:'100%'}}>
          <button className="go-button" onClick={handleGoButton}>
            Go
          </button>.

          <button className="close-button" onClick={closeModal}>
            Cancel
          </button>
          </div>
        )}
        {showProgress && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="home-container">
      <div className="top-section">
        <SearchBar />
        <div className="floating-btn" onClick={handleOpenModal}>
          <i className="fa-sharp fa-solid fa-pen"></i>
        </div>
      </div>

      {/* Scrollspy Nav – visible only on small screens */}
      <nav className="scrollspy-nav">
        <a href="#blogs">Blogs</a>
        <a href="#populars">Popular</a>
        <a href="#categories">Categories</a>
        <a href="#follow">Follow Us</a>
      </nav>
      <br />

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="row" id="blogs">
          {/* Blogs Section */}
          <div className="col-lg-6 main-content">
            <Blogs />
          </div>
          {/* Sidebar Section */}
          <div className="col-lg-6 sidebar">
            <div className="sidebar-inner">
              <div id="populars">
                <Popular />
              </div>
              <hr className="section-divider" />
              <Recent />
              <hr className="section-divider" />
              <div id="categories">
                <Category />
              </div>
              <hr className="section-divider" />
              <div id="follow">
                <FollowUs />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Container */}
      <footer className="footer-container" id="about">
        <p>
          &copy; 2025 Brainiac. All Rights Reserved.
          <br /> Made by- Rafi
        </p>
        <div className="footer-links">
          <Link to="/about">About Us </Link>
          <Link to="/privacy">Privacy Policy </Link>
          <Link to="/term">Terms & Conditions</Link>
        </div>
      </footer>

      {/* Render Modal via Portal */}
      {openModal && ReactDOM.createPortal(modalOverlay, document.body)}

      <style>{`
        /* Home Container */
        .home-container {
          width: 100%;
          background: #f9f9f9;
          padding: 20px;
          font-family: 'Roboto', sans-serif;
          margin-top: 20px;
          padding-bottom: 100px;
        }

        /* Top Section – Glass Effect */
        .top-section {
          margin: 0 auto 50px;
          max-width: 1040px;
          padding: 15px 20px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          position: sticky;
          top: 130px;
          z-index: 3000;
        }
        .top-section > * {
          flex: 1;
          display: flex;
        }

        /* Scrollspy Nav */
        .scrollspy-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .scrollspy-nav {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: linear-gradient(90deg, rgba(10,10,10,0.9), rgba(30,30,30,0.9));
            backdrop-filter: blur(8px);
            padding: 7px 13px;
            position: sticky;
            top: 195px;
            z-index: 4000;
            border-radius: 4px;
            margin: 0 10px 10px;
          }
          .scrollspy-nav a {
            color: #fff;
            text-decoration: none;
            font-size: 12px;
            padding: 6px 8px;
            border-radius: 4px;
            transition: background 0.3s ease, transform 0.3s ease;
          }
          .scrollspy-nav a:hover {
            background: rgba(0,212,255,0.3);
            transform: scale(1.05);
          }
          .scrollspy-nav a.active {
            background: rgba(0,212,255,0.5);
            font-weight: bold;
          }
        }

        /* Content Layout */
        .content-wrapper {
          margin-top: 20px;
        }
        .row {
          display: flex;
          gap: 20px;
        }
        .main-content {
          flex: 1;
        }
        .sidebar {
          flex: 1;
        }
        .sidebar-inner {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .section-divider {
          margin: 20px 0;
          border: none;
          border-top: 1px solid #bebebe;
        }

        
        /* Floating Create Post Button */
         .floating-btn { 
         position: absolute;
    top: 50%; 
    right: 15px; 
    transform: translateY(-50%); 
    background: linear-gradient(45deg, #00d4ff, #9147ff);
    padding: 10px; 
    border-radius: 50%; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: 15px;
    cursor: pointer;
    z-index: 1050;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

        .floating-btn:hover {
          transform: translateX-1px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
        }
        .floating-btn a {
          text-decoration: none;
          color: #fff;
          font-weight: bold;
        }

         @media (max-width: 576px) {
    .floating-btn {
    
      top: auto;
      right: 8px; 
      transform: none; 
      font-size: 13px; 
      padding: 9px; 

    }
  }

        /* Footer Container */
        .footer-container {
          margin-top: 50px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 0.9rem;
          color: #333;
        }
        .footer-container p {
          margin: 0 0 10px;
          color: #ddd;
        }
        .footer-links {
          display: inline-flex;
          gap: 15px;
        }
        .footer-links a {
          color: #00d4ff;
          text-decoration: none;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .footer-links a:hover {
          color: #9147ff;
          transform: scale(1.1);
        }
        #blogs, #populars, #categories, #follow, #about {
          scroll-margin-top: 240px;
        }
        
        .robotic-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 6000;
          animation: modalFadeIn 0.3s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
        .modal-content {
          background: rgba(30, 30, 30, 0.95);
          border: 2px solid #00d4ff;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          position: relative;
          overflow: hidden;
          align-items: center;
        }
        .modal-message {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          color: #00d4ff;
          margin-bottom: 35px;
        }
        .go-button {
          background: linear-gradient(45deg, #00d4ff, #9147ff);
          border: none;
          color: #fff;
          padding: 7px 7px;
          font-size: 0.9rem;
          border-radius: 30px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width : 40%;
          align-items : center;
          
        }

        .close-button {
          background: linear-gradient(45deg,rgb(255, 34, 0),rgb(204, 114, 24));
          border: none;
          color: #fff;
          padding: 7px 12px;
          font-size: 0.9rem;
          border-radius: 30px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width : 40%;
          align-items : center;
          margin-left: 30px;
          
        }
          
        .go-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        }

         .close-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        }
        .progress-container {
          width: 100%;
          height: 8px;
          background: #333;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 20px;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(45deg, #00d4ff, #9147ff);
          width: 0;
          transition: width 0.3s linear;
        }
        /* Blast Animation - full page flash effect */
        .robotic-modal.blast {
          animation: blastAnimation 0.65s forwards;
        }
        @keyframes blastAnimation {
          0% { background: rgba(0, 0, 0, 0.9); }
            25%{ background: #fff; opacity: 0.5; }

          50% { background: #fff; }
          100% { background: #fff; opacity: 0; }
        }
        
        /* Responsive Adjustments */
        @media (max-width: 991.98px) {
          .row { flex-direction: column; }
          .sidebar { margin-top: 20px; }
        }
        @media (max-width: 576px) {
          .top-section { flex-direction: row; 
          }
          .footer-links { flex-direction: column; gap: 10px; }
        }
      `}</style>
    </div>
  );
}
