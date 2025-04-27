import { useState } from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <div>
      <button className="trigger" onClick={toggleMenu}>
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>

      {open && (
        <div className="overlay" onClick={toggleMenu}>
          <div className="menu-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleMenu}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <nav className="menu-nav">
              <ul>
                <li onClick={toggleMenu}>
                  <Link to="/dark-mode">Dark Mode</Link>
                </li>

                <Link to="/history">
                <li onClick={toggleMenu} >
                  History
                </li>
                </Link>

                <li onClick={toggleMenu}>
                  <Link to="/library">Library</Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link to="/help">Help</Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link to="/rankings">Rankings</Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link to="/about">About Us</Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        .trigger {
          background: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          position: relative;
          z-index: 100;
          color: #555;
          margin-right: 13px;
          padding: 3px 10px;
          top: 2px;
          border-radius: 5px
        }
        /* Overlay covers entire viewport with a dark translucent background */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          z-index: 1050;
          animation: fadeIn 0.3s ease forwards;
        }
        /* Menu container (max width 300px, 260px on mobile) slides in from the right */        
        .menu-container {
          background: #fff;
          width: 300px;
          max-width: 300px;
          height: 100%;
          padding: 20px;
          box-shadow: -2px 0 12px rgba(0, 0, 0, 0.3);
          transform: translateX(0%);
          animation: slideIn 0.3s ease forwards;
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          color: #333;
          cursor: pointer;
        }
        .menu-nav ul {
          list-style: none;
          padding: 0;
          margin: 50px 0 0 0;
        }
        .menu-nav li {
          margin: 15px 0;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .menu-nav li:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.03);
        }
        .menu-nav a {
          text-decoration: none;
          color: #333;
          font-size: 18px;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .menu-nav a:hover {
          color: #ff6600;
        }
        @media (max-width: 576px) {
          .menu-container {
            width: 260px;
            max-width: 260px;
          }
          .menu-nav a {
            font-size: 16px;
          }
        }

          @media (max-width: 880px) { 
          .trigger { display: none;}
          }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
