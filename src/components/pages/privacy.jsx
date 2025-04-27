import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container mt-5 privacy-policy">
      <div className="content text-muted">
        <h1 className="title">Privacy Policy</h1>
        <p className="last-updated">(Last updated: February 2025)</p>
        <p>
          Welcome to <strong>Brainiac</strong>. Protecting your privacy is our top priority. This Privacy Policy explains how we handle your personal information and outlines your rights concerning your data.
        </p>

        <h4>1. Information We Collect</h4>
        <p>
          When you interact with our website, we may collect the following types of information:
        </p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Details such as your name, email address, phone number, or any other information you submit through forms.
          </li>
          <li>
            <strong>Browsing Data:</strong> Information about your interactions with our website, such as IP address, browser type, operating system, and browsing history.
          </li>
          <li>
            <strong>Cookies:</strong> Small files placed on your device to enhance your browsing experience (more on this below).
          </li>
        </ul>

        <h4>2. How We Use Your Information</h4>
        <p>We process the information we collect to:</p>
        <ul>
          <li>Enhance and personalize your experience on our platform.</li>
          <li>Provide responses to your inquiries and customer support requests.</li>
          <li>Send important updates, notifications, or promotional offers (only with your consent).</li>
          <li>Analyze user behavior to improve our services and content offerings.</li>
        </ul>

        <h4>3. Cookies & Tracking Technologies</h4>
        <p>We use cookies and similar technologies to:</p>
        <ul>
          <li>
            Save your preferences and improve website performance, such as keeping you logged in.
          </li>
          <li>
            Deliver personalized content and tailored advertisements based on your browsing behavior.
          </li>
          <li>
            Track website traffic and user activity via tools like Google Analytics.
          </li>
        </ul>
        <p>
          You can adjust your browser settings to disable cookies, but note that certain website features may not work as intended without them.
        </p>

        <h4>4. Data Protection</h4>
        <p>
          We employ advanced security measures such as encryption and access controls to protect your data from unauthorized access or breaches. However, while we strive for maximum security, no online system is immune to vulnerabilities. Use our website responsibly and avoid sharing sensitive information.
        </p>

        <h4>5. Third-Party Services</h4>
        <p>To provide the best experience, we may work with trusted third parties, including:</p>
        <ul>
          <li>Analytics providers (e.g., Google Analytics) to better understand how users interact with our site.</li>
          <li>Payment processors for secure financial transactions.</li>
          <li>Advertising networks to deliver relevant content.</li>
        </ul>
        <p>
          These services are governed by their respective privacy policies. Please review them for further details.
        </p>

        <h4>6. Your Rights</h4>
        <p>You have the following rights regarding your personal data:</p>
        <ul>
          <li>
            <strong>Access & Updates:</strong> You can request access to your data and ask for corrections if inaccuracies are found.
          </li>
          <li>
            <strong>Deletion:</strong> Request the deletion of your data in compliance with applicable laws.
          </li>
          <li>
            <strong>Opt-out:</strong> Unsubscribe from promotional communications or adjust cookie settings at any time.
          </li>
        </ul>
        <p>
          Contact us at <strong>brainiacbd25@gmail.com</strong> to exercise these rights or for assistance with data-related concerns.
        </p>

        <h4>7. Changes to This Policy</h4>
        <p>
          This Privacy Policy may be updated periodically to reflect changes in our practices or regulations. Any modifications will be shared on this page, so we recommend checking back occasionally for updates.
        </p>

        <h4>8. Contact Us</h4>
        <p>
          For any questions, concerns, or feedback regarding this Privacy Policy, reach out to us via email at <strong>brainiacbd25@gmail.com</strong>.
        </p>
      </div>

      <style>{`
        /* General Layout */
        .privacy-policy {
          font-family: 'Roboto', sans-serif;
          color: #555;
          line-height: 1.8;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 40px 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .content {
          max-width: 800px;
          margin: auto;
        }
        .title {
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 30px;
          color: #333;
        }
        .last-updated {
          font-size: 14px;
          text-align: center;
          color: #777;
        }
        h4 {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin-top: 25px;
        }
        p {
          font-size: 16px;
          color: #555;
          margin-top: 15px;
        }
        ul {
          list-style: disc;
          padding-left: 20px;
          margin-top: 15px;
        }
        li {
          margin-bottom: 10px;
          font-size: 15px;
        }
        strong {
          color: #4e8eff;
        }

        /* Responsiveness */
        @media (max-width: 768px) {
          .title {
            font-size: 28px;
          }
          h4 {
            font-size: 18px;
          }
          p,
          li {
            font-size: 14px;
          }
          .privacy-policy {
            padding: 20px;
          }
        }
        @media (max-width: 576px) {
          .title {
            font-size: 24px;
          }
          h4 {
            font-size: 16px;
          }
          p,
          li {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
