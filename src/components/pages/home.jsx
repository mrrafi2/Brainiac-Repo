import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Blogs from "../blogs/blogGrid";
import Category from "../blogs/category";
import FollowUs from "../follow";
import Popular from "./blogRelated/popularPosts";
import Recent from "../uxFeatures/userBlog";
import SearchBar from "../uxFeatures/searchbar";
import ReactDOM from "react-dom";
import { PenLine } from "lucide-react";
import styles from "../style/home.module.css";

export default function Home() {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blastMode, setBlastMode] = useState(false);

  const modalMessages = [
    "Write like you're whispering secrets to a friend at midnight—honest, raw, and a bit daring.",
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
    setOpenModal(false);
  };

  const modalOverlay = (
    <div className={`${styles.roboticModal} ${blastMode ? styles.blast : ""}`}>
      <div className={styles.modalContent}>
        <p className={styles.modalMessage}>{modalMessage}</p>
        {!showProgress && (
          <div className={styles.modalButtons}>
            <button className={styles.goButton} onClick={handleGoButton}>
              Go
            </button>
            <button className={styles.closeButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        )}
        {showProgress && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.homeContainer}>
      <div className={styles.topSection}>
        <SearchBar />
        <div className={styles.floatingBtn} onClick={handleOpenModal}>
          <PenLine size={17} />
        </div>
      </div>

      <nav className={styles.scrollspyNav}>
        <a href="#blogs">Blogs</a>
        <a href="#populars">Popular</a>
        <a href="#categories">Categories</a>
      </nav>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.contentRow}>
          {/* Blogs Section */}
          <div className={styles.mainContent}>
            <div id="blogs" className={styles.scrollAnchor}>
              <Blogs />
            </div>
          </div>
          
          {/* Sidebar Section */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <div id="populars" className={styles.scrollAnchor}>
                <Popular />
              </div>
              <hr className={styles.sectionDivider} />
              <Recent />
              <hr className={styles.sectionDivider} />
              <div id="categories" className={styles.scrollAnchor}>
                <Category />
              </div>
              <hr className={styles.sectionDivider} />
              <div id="follow" className={styles.scrollAnchor}>
                <FollowUs />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Container */}
      <footer className={styles.footerContainer} id="about">
        <p>
          &copy; 2025 Brainiac. All Rights Reserved.
          <br /> Made by- Rafi
        </p>
        <div className={styles.footerLinks}>
          <Link to="/about">About Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/term">Terms & Conditions</Link>
        </div>
      </footer>

      {/* Render Modal via Portal */}
      {openModal && ReactDOM.createPortal(modalOverlay, document.body)}
    </div>
  );
}
