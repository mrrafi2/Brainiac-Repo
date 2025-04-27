import Account from "./account";
import Logo from "./logo";
import Nav from "./navbar";

export default function Header() {
  return (
    <div className="headerContainer">
      <Account />
      
      <div className="headerContent">
      <Logo />
        <Nav />

       
      </div>
      <style>
        {`
          .headerContainer {
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 12px 20px;
            background: linear-gradient(90deg, #0d0d0d, #1a1a1a);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
            border-bottom: 1px solid #00d4ff;
            animation: headerGlow 4s ease-in-out infinite;
          }
          
          @keyframes headerGlow {
            0% {
              border-bottom-color: #00d4ff;
              box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
            }
            50% {
              border-bottom-color: #9147ff;
              box-shadow: 0 4px 12px rgba(145, 71, 255, 0.8);
            }
            100% {
              border-bottom-color: #00d4ff;
              box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
            }
          }
          
          /* Flex container for logo and navbar */
          .headerContent {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          
          /* FUTURISTIC LOGO STYLES (overriding the existing logo.module.css if necessary) */
          .logoContainer {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0.5rem;
            margin-left: 0.5rem;
            animation: logoPulse 3s ease-in-out infinite;
          }
          
          @keyframes logoPulse {
            0% { filter: brightness(1); }
            50% { filter: brightness(1.4); }
            100% { filter: brightness(1); }
          }
          
          .logoImg {
              width: 60px;
              height: 60px;
              border: 2px solid #00d4ff;
              padding: 2px;
              border-radius: 50%;
              object-fit: cover;
              transition: transform 0.3s ease, filter 0.3s ease;
          }
          
          .logoImg:hover {
              transform: scale(1.1);
              filter: drop-shadow(0 0 10px #00d4ff);
          }
          
          .logoText {
              /* Using a futuristic font – if available – such as 'Orbitron' */
              font-family: 'Orbitron', sans-serif;
              font-size: 32px;
              letter-spacing: 2px;
              margin: 0;
              font-weight: bold;
              color: #fff;
              text-shadow: 0 0 8px rgba(0, 212, 255, 0.8);
          }
          
          /* Responsive adjustments for the logo */
          @media (max-width: 868px) {
              .logoImg {
                  width: 50px;
                  height: 50px;
              }
              .logoText {
                  font-size: 28px;
              }
          }
          @media (max-width: 480px) {
              .logoImg {
                  width: 40px;
                  height: 40px;
              }
              .logoText {
                  font-size: 20px;
              }
          }
        `}
      </style>
    </div>
  );
}
