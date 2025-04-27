import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { useAuth } from "./contexts/AuthContext";
import ReactDOM from "react-dom";

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // For checking logged-in user's UID
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  // (Optional) State for blogger accounts if used elsewhere.
  const [bloggerAccounts, setBloggerAccounts] = useState([]);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const db = getDatabase();
    const blogsRef = ref(db, "blogs");

    const fetchData = () => {
      get(blogsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const blogsData = snapshot.val();
            const accountsMap = {};

            Object.values(blogsData).forEach((blog) => {
              const uid = blog.authorUID;
              const name = blog.author || "Anonymous";
              const avatar = blog.authorAvatar || null;

              let key;
              if (uid) {
                key = uid;
              } else {
                const existingKey = Object.keys(accountsMap).find(
                  (k) => accountsMap[k].name === name
                );
                key = existingKey || name;
              }

              if (accountsMap[key]) {
                accountsMap[key].count += 1;
              } else {
                accountsMap[key] = {
                  name,
                  uid: uid || null,
                  count: 1,
                  avatar,
                };
              }
            });

            if (currentUser) {
              const { uid, displayName } = currentUser;
              if (accountsMap[uid]) {
                accountsMap[uid].name = displayName || accountsMap[uid].name;
              } else {
                accountsMap[uid] = {
                  name: displayName || "Anonymous",
                  uid,
                  count: 0,
                  avatar: null,
                };
              }
            }

            const accountsArray = Object.values(accountsMap).sort(
              (a, b) => b.count - a.count
            );
            setBloggerAccounts(accountsArray);
          }
        })
        .catch((error) => {
          console.error("Error fetching blogs:", error);
        });
    };

    fetchData();

    const unsubscribe = onValue(blogsRef, fetchData);

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-md navbar-light px-3 ms-3 mt-1">
        {/* Menu Toggler: Visible on small screens */}
        <button
          className="navbar-toggler d-md-none"
          type="button"
          onClick={() => setIsOffcanvasOpen(true)}
          style={{ background: "transparent", border: "none" }}
        >
          <i
            className="fa-solid fa-bars"
            style={{ color: "#cbcbcb", fontSize: "17px" }}
          ></i>
        </button>

        {/* Large Screen Horizontal Navbar */}
<div
  className="collapse navbar-collapse d-none d-lg-flex justify-content-between"
  style={{ borderBottom: "2px solid #555" }}
>
  <ul className="navbar-nav">
    <li className="nav-item">
      <Link
        className={`nav-link fw-bold ${activeTab === "/" ? "active-nav" : ""}`}
        to="/"
        data-tooltip="Home"
      >
        <i className="fa-solid fa-house"></i>
      </Link>
    </li>

    <li className="nav-item">
      <Link
        className={`nav-link fw-bold ${activeTab === "/trending" ? "active-nav" : ""}`}
        to="/trending"
        data-tooltip="Trendings"
      >
        <i className="fa-sharp fa-solid fa-fire-flame-curved"></i>
      </Link>
    </li>

    <li className="nav-item">
      <Link
        className={`nav-link fw-bold ${activeTab === "/ranking" ? "active-nav" : ""}`}
        to="/ranking"
        data-tooltip="Bloggers"
      >
        <i className="fa-solid fa-list-ul"></i>
      </Link>
    </li>

    <li className="nav-item">
      <Link
        className={`nav-link fw-bold ${activeTab === "/history" ? "active-nav" : ""}`}
        to="/history"
        data-tooltip="History"
      >
        <i className="fa-solid fa-clock-rotate-left"></i>
      </Link>
    </li>

    <li className="nav-item">
      <Link
        className={`nav-link fw-bold ${activeTab === "/contact" ? "active-nav" : ""}`}
        to="/contact"
        data-tooltip="Contact"
      >
        <i className="fa-sharp fa-solid fa-message"></i>
      </Link>
    </li>

    <li className="nav-item">
      <Link
        className={`nav-link fw-bold fs-6 ${activeTab === "/help" ? "active-nav" : ""}`}
        to="/help"
        data-tooltip="FAQ"
      >
        <i className="fa-solid fa-circle-question" style={{fontSize:'16px'}}></i>
      </Link>
    </li>
  </ul>
</div>

      </nav>

      {isOffcanvasOpen &&
  ReactDOM.createPortal(
    <>
      {/* Offcanvas Backdrop */}
      <div
        className="custom-offcanvas-backdrop"
        onClick={() => setIsOffcanvasOpen(false)}
      ></div>

      {/* Offcanvas Container */}
      <div className="custom-offcanvas">
        <div className="custom-offcanvas-header">
          <h5>Menu</h5>
          <button
            type="button"
            className="custom-close-btn"
            onClick={() => setIsOffcanvasOpen(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="custom-offcanvas-body">
          <ul className="list-unstyled">
            <li className="mb-3">
              <Link
                to="/"
                className="custom-offcanvas-link"
                onClick={() => setIsOffcanvasOpen(false)}
              >
                <i className="fa-solid fa-house"></i>{" "}
                <span className="ms-2">Home</span>
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/trending"
                className="custom-offcanvas-link"
                onClick={() => setIsOffcanvasOpen(false)}
              >
                <i className="fa-sharp fa-solid fa-fire-flame-curved"></i>{" "}
                <span className="ms-2">Trendings</span>
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/ranking"
                className="custom-offcanvas-link"
                onClick={() => setIsOffcanvasOpen(false)}
              >
                <i className="fa-solid fa-list-ul"></i>{" "}
                <span className="ms-2">Ranking</span>
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/history"
                className="custom-offcanvas-link"
                onClick={() => setIsOffcanvasOpen(false)}
              >
                <i className="fa-solid fa-clock-rotate-left"></i>{" "}
                <span className="ms-2">History</span>
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/contact"
                className="custom-offcanvas-link"
                onClick={() => setIsOffcanvasOpen(false)}
              >
                <i className="fa-sharp fa-solid fa-message"></i>{" "}
                <span className="ms-2">Contact</span>
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/help"
                className="custom-offcanvas-link"
                onClick={() => setIsOffcanvasOpen(false)}
              >
                <i className="fa-solid fa-circle-question"></i>{" "}
                <span className="ms-2">FAQ</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>,
    document.body
  )
}


      {/* Styles */}
      <style>
        {`
          /* ---------- Main Navbar Styles ---------- */
          .navbar {
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            padding: 10px 30px;
            border-bottom: 2px solid rgba(0, 212, 255, 0.3);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
          }

          @media (max-width: 766px) {
            .navbar .collapse.navbar-collapse {
              display: none !important;
            }
          }

          .navbar-nav {
            display: flex;
            align-items: center;
            padding-left: 0;
            margin-bottom: 0;
            list-style: none;
          }

          .nav-item {
            position: relative;
            margin-right: 30px;
          }

          .nav-link {
            color: #cbcbcb;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 1px;
            padding: 8px 0;
            position: relative;
            transition: color 0.3s ease, transform 0.3s ease;
          }
    
          .nav-link:before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 0;
            background: linear-gradient(45deg, #00d4ff, #9147ff);
            transition: width 0.3s ease;
          }
    
          .nav-link:hover {
            color: #fff;
            transform: scale(1.05);
          }
    
          .nav-link:hover:before {
            width: 100%;
          }
    
          .active-nav {
            color: #fff !important;
            font-weight: bold;
            border-bottom: 2px solid #00d4ff;
          }
    
          .active-nav:before {
            width: 100%;
            background: linear-gradient(45deg, #00d4ff, #9147ff);
          }

.nav-link[data-tooltip] {
  position: relative;
}

.nav-link[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(0, 212, 255, 0.9);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 999;
}

/* Show tooltip on hover */
.nav-link[data-tooltip]:hover::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}


          /* ---------- Offcanvas Sidebar Styles ---------- */

          .custom-offcanvas-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
            z-index: 1050;
            opacity: 0;
            animation: fadeInBackdrop 0.3s forwards;
          }
    
          @keyframes fadeInBackdrop {
            to { opacity: 1; }
          }
    
          .custom-offcanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            max-width: 80%;
            height: 100%;
            background: linear-gradient(135deg, #0d0d0d, #1a1a1a);
            box-shadow: 2px 0 15px rgba(0, 212, 255, 0.4);
            z-index: 5000;
            transform: translateX(-100%);
            animation: slideIn 0.35s forwards;
            border-right: 3px solid #00d4ff;
          }
    
          @keyframes slideIn {
            to { transform: translateX(0); }
          }
    
          .custom-offcanvas-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid rgba(0, 212, 255, 0.3);
          }
    
          .custom-offcanvas-header h5 {
            color: #00d4ff;
            font-family: 'Orbitron', sans-serif;
            font-size: 1.2rem;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
    
          .custom-close-btn {
            background: none;
            border: none;
            font-size: 1.2rem;
            color: #00d4ff;
            cursor: pointer;
            transition: transform 0.2s ease;
          }
    
          .custom-close-btn:hover {
            transform: scale(1.1);
          }
    
          .custom-offcanvas-body {
            padding: 1rem;
          }
    
          .custom-offcanvas-body li {
            width: 90%;
            padding: 10px;
            border-radius: 5px;
            background-color: rgba(255, 255, 255, 0.05);
            margin-bottom: 10px;
            transition: background 0.3s ease, transform 0.3s ease;
            list-style: none;
          }
    
          .custom-offcanvas-body li:hover {
            background-color: rgba(0, 212, 255, 0.15);
            transform: scale(1.03);
          }
    
          .custom-offcanvas-body li:active {
            background-color: rgba(255, 255, 255, 0.05);
          }
    
          .custom-offcanvas-link {
            text-decoration: none;
            color: #ccc;
            font-size: 1rem;
            font-weight: 500;
            display: block;
            transition: color 0.3s ease;
          }
    
          .custom-offcanvas-link:hover {
            color: #00d4ff;
          }
    
          /* Adjust offcanvas width on smaller screens */
          @media (max-width: 768px) {
            .custom-offcanvas {
              width: 200px;
            }
          }
        `}
      </style>
    </>
  );
}
