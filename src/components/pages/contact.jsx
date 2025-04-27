import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_kefi9ql",   // EmailJS Service ID
        "template_9cso8ed",  // EmailJS Template ID
        formRef.current,
        "VE2iSZYr85KvBwxB1"   // EmailJS Public Key
      )
      .then(
        (result) => {
          console.log("Success:", result.text);
          setSuccessMessage("Message sent successfully!");
          formRef.current.reset();
        },
        (error) => {
          console.error("Failed:", error.text);
          setSuccessMessage("Failed to send message. Try again.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center shadow mb-5 pt-3 pb-5 contact-card">
        <div className="col-md-4 contact-info">
          <div className="p-2 justify-content-center mt-2">
            <p className="text-muted fw-bold mt-2" style={{ fontSize: "15px" }}>
              Keep in touch
            </p>
            <h2 className="text-dark mt-5 fw-bold">
              Want to Contact us? Let&apos;s talk!
            </h2>
            <div className="ms-1 mt-5 text-secondary mb-4">
              <i className="fa-solid fa-location-dot mb-2"></i>
              <span className="ms-2" style={{ fontSize: "14px" }}>
                Chittagong, Bangladesh
              </span>
              <br />
              <i className="fa-solid fa-envelope"></i>
              <span className="ms-2" style={{ fontSize: "14px" }}>
                brainiacbd25@gmail.com
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-6 contact-form">
          <div className="justify-content-center p-2 ms-2">
            <form ref={formRef} onSubmit={sendEmail}>
              <div className="form-floating mt-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="user_name"
                  placeholder="Enter Name"
                  required
                />
                <label htmlFor="name">Enter your Fullname</label>
              </div>

              <div className="form-floating mt-3 mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="user_email"
                  placeholder="Enter Email Account"
                  required
                />
                <label htmlFor="email">Enter Email Account</label>
              </div>

              <div className="form-floating mt-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="sub"
                  name="subject"
                  placeholder="Type a reason for contact"
                  required
                />
                <label htmlFor="sub">Subject (Reason for Contact)</label>
              </div>

              <div className="form-floating">
                <textarea
                  className="form-control"
                  id="comment"
                  name="message"
                  rows="6"
                  placeholder="Message"
                  required
                ></textarea>
                <label htmlFor="comment">Message</label>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn text-light submit-btn mt-4"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </div>

              {successMessage && (
                <p className="mt-3 text-success">{successMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Advanced, Modern, Responsive, Colorful & Animated CSS */}
      <style>
        {`
          /* Overall Page Animation */
          .container.mt-5 {
            animation: slideIn 1s ease-out;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Contact Card Styling */
          .contact-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            border: 2px solid transparent;
            animation: borderGradient 3s ease infinite;
          }
          @keyframes borderGradient {
            0% {
              border-image: linear-gradient(45deg, #ff6600, #9147ff) 1;
            }
            50% {
              border-image: linear-gradient(45deg, #00d4ff, #ff66cc) 1;
            }
            100% {
              border-image: linear-gradient(45deg, #ff6600, #9147ff) 1;
            }
          }
          
          /* Left Column - Contact Information */
          .contact-info {
            background: linear-gradient(135deg, #f9f9f9, #ffffff);
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-right: 2px dashed #ff6600;
          }
          .contact-info p.text-muted {
            font-size: 0.95rem;
            letter-spacing: 0.5px;
          }
          .contact-info h2 {
            margin-top: 20px;
            font-family: 'Orbitron', sans-serif;
            color: #222;
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          .contact-info i {
            color: #00d4ff;
            margin-bottom: 5px;
          }
          .contact-info span {
            font-size: 0.95rem;
          }
          
          /* Right Column - Contact Form */
          .contact-form {
            padding: 20px;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          /* Form Control Styling */
          .form-control {
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            transition: border-color 0.4s ease, box-shadow 0.4s ease;
            background: #fafafa;
          }
          .form-control:focus {
            border-color: #00d4ff;
            box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
          }
          
          /* Floating Label Styling */
          .form-floating label {
            transition: all 0.3s ease;
            color: #999;
          }
          .form-floating .form-control:focus ~ label,
          .form-floating .form-control:not(:placeholder-shown) ~ label {
            transform: translateY(-1.5rem) scale(0.9);
            color: #00d4ff;
          }
          
          /* Submit Button Styling */
          .submit-btn {
            width: 30%;
            border: none;
            border-radius: 8px;
            background: linear-gradient(45deg, #ff6600, #e65c00);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .submit-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          }
          
          /* Success Message Animation */
          .text-success {
            animation: fadeIn 0.6s ease forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          /* Responsive Adjustments for Small Screens */
          @media (max-width: 768px) {
            .contact-card {
              margin: 10px;
              flex-direction: column;
            }
            .contact-info, .contact-form {
              width: 100%;
              padding: 15px;
              border: none;
            }
            .contact-info {
              border-bottom: 2px dashed #ff6600;
            }
            .submit-btn {
              width: 100%;
            }
            .form-floating label {
              font-size: 0.9rem;
            }
          }
        `}
      </style>
    </div>
  );
}
