import React from "react";
import { Link } from "react-router-dom";
import img from "../images/logo.png";

const Logo = () => {
  return (
    <div className="logo-container">
      <Link to="/" className="logo-link" aria-label="Go to homepage">
        <img 
          src={img} 
          alt="Blog Logo" 
          className="logo-img"
          loading="lazy"
          width="45"
          height="45"
        />
      </Link>
      
      <style>{`
        .logo-container {
          display: flex;
          align-items: center;
          padding: 0.25rem;
          position: relative;
        }
        
        .logo-link {
          display: block;
          text-decoration: none;
          border-radius: 50%;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        
        .logo-link::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00d4ff, #9147ff, #00d4ff);
          background-size: 200% 200%;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: -1;
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        .logo-link:hover::before {
          opacity: 1;
        }
        
        .logo-img {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          object-fit: cover;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid rgba(0, 212, 255, 0.3);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .logo-link:hover .logo-img {
          transform: scale(1.05);
          filter: brightness(1.1);
          box-shadow: 0 4px 16px rgba(0, 212, 255, 0.4);
        }
        
        .logo-link:focus {
          outline: 2px solid #00d4ff;
          outline-offset: 2px;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @media (max-width: 768px) {
          .logo-img {
            width: 50px;
            height: 50px;
          }
        }
        
        @media (max-width: 480px) {
          .logo-img {
            width: 46px;
            height: 46px;
          }
        }
      `}</style>
    </div>
  );
};

export default Logo;
