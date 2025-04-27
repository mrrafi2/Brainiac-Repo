import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import ReactDOM from "react-dom";

export default function Account() {
  const { currentUser, logout } = useAuth();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const overlayRef = useRef(null);

  const getColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  const bgColor = currentUser ? getColorFromString(currentUser.uid) : "#ccc";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setShowOverlay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setShowOverlay(false);
  };

  return (
    <div className="float-end" style={{ width: "150px", position: "relative" }}>
      {currentUser ? (
        <>
          {/* USER AVATAR */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center float-end"
            style={{
              width: "30px",
              height: "30px",
              marginRight: "4px",
              backgroundColor: bgColor,
              color: "white",
              fontWeight: "bold",
              fontSize: "10px",
              cursor: "pointer",
              boxShadow: "0 2px 6px #00d5ff",
              position: "relative",
              top: "-4px",
              right: "-8px",
            }}
            onClick={() => setShowOverlay(!showOverlay)}
          >
            {currentUser.displayName
              ? currentUser.displayName.slice(0, 2).toUpperCase()
              : "??"}
          </div>

          {/* ACCOUNT OVERLAY */}
          {showOverlay &&
            ReactDOM.createPortal(
              <div
                ref={overlayRef}
                className="account-overlay"
                style={{
                  position: "fixed",
                  top: "55px",
                  right: "20px",
                  width: "240px",
                }}
              >
                <p className="fw-bold mb-1">
                  {currentUser.displayName ? currentUser.displayName : "Guest"}
                </p>
                <p
                  style={{ fontSize: "0.85rem", marginBottom: "1rem", color: "#aaa" }}
                >
                  {currentUser.email ? currentUser.email : "No email available"}
                </p>
                <hr />
                <div className="users">
                  <Link to="/myblogs">
                    <i className="fa-solid fa-pen"></i> <span>My Blogs</span>
                  </Link>
                  <br />
                  <Link to="/bookmarks">
                    <i className="fa-solid fa-bookmark"></i> <span>Bookmarks</span>
                  </Link>
                  <br />
                  <Link to="/liked">
                    <i className="fa-solid fa-heart"></i> <span>Liked</span>
                  </Link>
                </div>
                <hr />
                <abbr title="Logout">
                  <button
                    className="btn btn-sm btn-danger mt-0 ms-0"
                    onClick={confirmLogout}
                    style={{ fontSize: "12px" }}
                  >
                    Logout
                  </button>
                </abbr>
              </div>,
              document.body
            )}

{showLogoutConfirm &&
  ReactDOM.createPortal(
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
        backdropFilter: "blur(10px)",
        animation: "fadeIn 0.3s ease-out",
        pointerEvents:'auto'

      }}
    >
      <div
        className="modal-dialog"
        style={{
          background: "linear-gradient(135deg, #1a1a1a, #262626)",
          borderRadius: "12px",
          padding: "25px",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0, 212, 255, 0.7)",
          border: "2px solid rgba(0, 212, 255, 0.6)",
          color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
          animation: "popIn 0.3s ease-out",
          zIndex:"100000",
          pointerEvents:'auto'
        }}
      >
        
          
        <div className="modal-body">
          <p style={{ fontSize: "1.1rem", color: "#fff", fontWeight:600 }}>
            Are you sure you want to logout?
          </p>
          <br />
          
        </div>
        <div className="modal-footer" style={{ borderTop: "none", marginTop: "15px" }}>
          <button
            className="btn"
            onClick={handleLogout}
            style={{
              background: "linear-gradient(45deg, #ff004c, #ff6600)",
              border: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              color: "#fff",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Yes
          </button>
          <button
            className="btn"
            onClick={() => setShowLogoutConfirm(false)}
            style={{
              background: "linear-gradient(45deg, #00d5ff, #9147ff)",
              border: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              color: "#fff",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              marginLeft: "10px",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* 🔥 Add CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes popIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>,
    document.body
  )}

        </>
      ) : (
        <>
          {/* DEFAULT USER ICON + SIGNUP & LOGIN LINKS */}
          <i
            className="fa-solid fa-user ms-3 mn-0 mt-0 rounded-circle"
            style={{
              padding: "8px",
              backgroundColor: "white",
              fontSize: "10px",
            }}
          ></i>
          <Link
            to="/singup"
            className="ms-3 mn-3"
            style={{
              color: "#00d5ff",
              fontSize: "12px",
              textDecoration: "none",
              position: "relative",
              top: "-1px",
            }}
          >
            Sign-up
          </Link>
          <Link
            to="/login"
            className="ms-2 mn-1"
            style={{
              color: "#00d5ff",
              fontSize: "12px",
              textDecoration: "none",
              position: "relative",
              top: "-1px",
              fontWeight: 400,
            }}
          >
            Log-in
          </Link>
        </>
      )}
         
         {/* FUTURISTIC ACCOUNT OVERLAY STYLES */}
      <style>{`
        /* Account Overlay Container */
        .account-overlay {
          background: linear-gradient(135deg, #1a1a1a, #262626) !important;
          border: 2px solid transparent !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 20px rgba(0, 212, 255, 0.5) !important;
          padding: 20px !important;
          color: #fff !important;
          animation: overlayFadeIn 0.4s ease-out;
          font-family: 'Orbitron', sans-serif;
          z-index: 5000 !important;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* User Name & Email */
        .account-overlay p.fw-bold {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .account-overlay p.text-muted {
          font-size: 0.85rem;
        }

        /* Horizontal Rule Styling */
        .account-overlay hr {
          border: none;
          height: 1px;
          background: linear-gradient(45deg, #00d4ff, #9147ff);
          margin: 10px 0;
        }

        /* Users Links */
        .account-overlay .users a {
          text-decoration: none;
          color: #00d4ff;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          transition: color 0.3s ease, transform 0.3s ease;
          margin-top: 10px;
        }
        .account-overlay .users a i {
          margin-right: 8px;
          font-size: 0.8rem;
          transition: transform 0.3s ease;
        }
        .account-overlay .users a:hover {
          color: #ff6600;
          transform: scale(1.05);
        }
        .account-overlay .users a:hover i {
          transform: rotate(20deg);
        }

        /* Logout Button Styling */
        .account-overlay abbr button {
          background: linear-gradient(45deg, rgb(255, 4, 0), rgb(176, 1, 1));
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.85rem;
          color: #fff;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .account-overlay abbr button:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(255, 51, 0, 0.6);
        }
      `}</style>


    </div>
  );
}
