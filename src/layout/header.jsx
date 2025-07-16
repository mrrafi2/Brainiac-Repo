
import { useState, useEffect } from "react";
import Account from "../components/Auth/account";
import Logo from "../components/navs/logo";
import Nav from "../components/navs/navbar";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const throttledScroll = (() => {
      let ticking = false;
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
    })();

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [lastScrollY]);

  return (
    <header className={`modern-header ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="header-container">
        <div className="header-left">
          <Logo />
        </div>
        
        <div className="header-center">
          <Nav />
        </div>
        
        <div className="header-right">
          <Account />
        </div>
      </div>
      
      <style>{`
        .modern-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 83px;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }

        .modern-header.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .modern-header.hidden {
          transform: translateY(-100%);
          opacity: 0;
        }

        .modern-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00d4ff, #9147ff, #00d4ff, transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        .header-container {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          height: 100%;
          padding: 0 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .header-center {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .header-right {
          display: flex;
          align-items: center;
          justify-self: end;
        }

        @keyframes shimmer {
          0%, 100% { 
            background: linear-gradient(90deg, transparent, #00d4ff, #9147ff, #00d4ff, transparent);
            background-size: 200% 100%;
            background-position: -200% 0;
          }
          50% { 
            background-position: 200% 0;
          }
        }

        /* Mobile Adjustments */
        @media (max-width: 1024px) {
          .header-container {
            grid-template-columns: auto 1fr auto;
            padding: 0 1rem;
          }
          
        }

        @media (max-width: 768px) {
          .modern-header {
            height: 72px;
          }
          
          .header-container {
            padding: 0 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .modern-header {
            height: 67px;
          }
          
          .header-container {
            padding: 0 0.5rem;
          }
        }

        body {
          padding-top: 60px;
        }

        @media (max-width: 768px) {
          body {
            padding-top: 55px;
          }
        }

        @media (max-width: 480px) {
          body {
            padding-top: 50px;
          }
        }
      `}</style>
    </header>
  );
}
