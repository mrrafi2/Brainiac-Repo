import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Terms & Conditions</h1>
      <p className="intro">
        Welcome to Brainiac – where innovation meets tradition. By accessing or using our blog site, you agree to comply with and be bound by these Terms and Conditions. Read them carefully!
      </p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using Brainiac, you confirm that you have read, understood, and agree to be legally bound by these Terms. If you disagree with any part of these terms, please do not use our site.
        </p>
      </section>

      <section>
        <h2>2. User Conduct and Responsibilities</h2>
        <p>
          We expect all users to conduct themselves with respect and integrity. You agree not to post any content that is unlawful, harmful, defamatory, or otherwise objectionable.
        </p>
        <p>
          Any content you submit should not infringe on the rights of any third party. You are solely responsible for your actions and the content you share.
        </p>
      </section>

      <section>
        <h2>3. Content Ownership and Intellectual Property</h2>
        <p>
          All blog posts, comments, and other user-generated content remain the property of their respective authors. By posting on Brainiac, you grant us a non-exclusive, worldwide license to use, display, and distribute your content.
        </p>
        <p>
          Brainiac’s design, logos, trademarks, and other intellectual property are protected by copyright laws. Unauthorized use of these materials is strictly prohibited.
        </p>
      </section>

      <section>
        <h2>4. Privacy Policy</h2>
        <p>
          Your use of Brainiac is also governed by our Privacy Policy, which explains how we collect, store, and use your personal information. We strongly encourage you to review our Privacy Policy to understand our practices.
        </p>
      </section>

      <section>
        <h2>5. Disclaimers and Limitation of Liability</h2>
        <p>
          Brainiac is provided on an "as is" basis without any warranties, either express or implied. We do not guarantee that the site will always be safe, secure, or error-free.
        </p>
        <p>
          In no event shall Brainiac or its affiliates be liable for any indirect, incidental, or consequential damages arising from the use of our site.
        </p>
      </section>

      <section>
        <h2>6. Dispute Resolution</h2>
        <p>
          Any disputes arising from your use of Brainiac will be resolved through binding arbitration in accordance with the laws of our jurisdiction. By using our site, you agree to this method of dispute resolution.
        </p>
      </section>

      <section>
        <h2>7. Termination of Access</h2>
        <p>
          Brainiac reserves the right to suspend or terminate your access to the site at any time, without notice, for any conduct that violates these Terms or jeopardizes the community.
        </p>
      </section>

      <section>
        <h2>8. Modifications to Terms</h2>
        <p>
          We reserve the right to update or modify these Terms at any time. Any changes will be posted on this page, and your continued use of Brainiac signifies your acceptance of the updated Terms.
        </p>
      </section>

      <section>
        <h2>9. Severability</h2>
        <p>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
        </p>
      </section>

      <section>
        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Brainiac operates.
        </p>
      </section>

      <section>
        <h2>11. Contact Us</h2>
        <p>
          For any questions or concerns regarding these Terms, please contact us at <a href="mailto:support@brainiac.com">support@brainiac.com</a>. <br />
        Additionaly more better navigate to <Link to="/contact">Contact Us</Link> and drop your thought.
        </p>
      </section>

      <footer className="terms-footer">
        <p>Last updated: January 2025</p>
      </footer>

      <style>{`
        .terms-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 30px;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #e0e0e0;
          background: rgba(26, 26, 26, 0.95);
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }
        h1 {
          font-size: 1.9rem;
          margin-bottom: 30px;
          text-align: center;
          color: #ff6600;
        }
        .intro {
          font-size: 1rem;
          margin-bottom: 30px;
          text-align: center;
          color: #ccc;
        }
        h2 {
          font-size: 1.5rem;
          margin-top: 40px;
          color: #ff6600;
          border-bottom: 2px solid #333;
          padding-bottom: 5px;
        }
        p {
          font-size: 1rem;
          line-height: 1.6;
          margin: 15px 0;
          color: #ccc;
        }
        a {
          color: #ff6600;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        section {
          margin-bottom: 20px;
        }
        .terms-footer {
          text-align: center;
          margin-top: 40px;
          font-size: 0.9rem;
          color: #888;
          border-top: 1px solid #333;
          padding-top: 10px;
        }
        @media (max-width: 768px) {
          .terms-container {
            margin: 20px;
            padding: 20px;
          }
          h1 {
            font-size: 2rem;
          }
          h2 {
            font-size: 1.5rem;
          }
          p {
            font-size: 0.9rem;
          }
        }
        /* Futuristic background for the entire body */
        body {
          background: radial-gradient(circle, #121212, #1a1a1a);
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditions;
