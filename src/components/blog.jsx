import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, runTransaction } from "firebase/database";
import { database } from "./firebases/firebase";
import { getAuth } from "firebase/auth";

export default function Blog({ blog }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [seenCount, setSeenCount] = useState(blog.seen || 0);

  useEffect(() => {
    setSeenCount(blog.seen || 0);
  }, [blog.seen]);

  const handleClick = async () => {
    if (currentUser && blog.author !== currentUser.displayName) {
      const blogRef = ref(database, `blogs/${blog.id}`);
      try {
        await runTransaction(blogRef, (currentData) => {
          if (currentData) {
            const updatedSeen = (currentData.seen || 0) + 1;
            setSeenCount(updatedSeen);
            return { ...currentData, seen: updatedSeen };
          }
          return currentData;
        });
      } catch (error) {
        console.error("Error updating seen count:", error);
      }
    }
    navigate(`/blog/${blog.id}`);
  };

  return (
    <div className="blog-item" onClick={handleClick} style={{ cursor: "pointer" }}>
      {/* Blog Details */}
      <div className="blog-details">
        <h5 className="blog-title" style={{fontFamily:`"Sora", sans-serif`, fontSize:'14px'}}>{blog.title}</h5>
        <div className="blog-meta">
          <span className="blog-author">
            {blog.author ? `By ${blog.author}` : "Unknown Author"}
          </span>
          <span className="blog-date">
            {new Date(blog.date).toLocaleDateString()}
          </span>
          <span className="blog-seen">👁️ {seenCount}</span>
          <span className="blog-likes">
            <i className="fa-solid fa-thumbs-up me-1"></i>
            {blog.likes || 0}
          </span>
        </div>
      </div>

      {/* Category Badge */}
      <div className="blog-category-wrapper">
        <span className="blog-category">{blog.category}</span>
      </div>

      {/* FUTURISTIC & RESPONSIVE STYLE */}
      <style>{`
        /* Blog Item Container */
        .blog-item {
          position: relative;
          display: flex;
          align-items: center;
          padding: 20px;
          margin-bottom: 30px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1a1a1a, #222222);
          border: 1px solid transparent;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .blog-item:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          background: linear-gradient(45deg, rgba(0, 212, 255, 0.3), rgba(145, 71, 255, 0.3));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        .blog-item:hover:before {
          opacity: 1;
        }
        .blog-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 212, 255, 0.3);
        }

        /* Blog Details */
        .blog-details {
          flex: 1;
          margin-left: 20px;
          position: relative;
          z-index: 2;
        }

        /* Blog Title */
        .blog-title {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          color: #ffffff;
          font-family: 'Orbitron', sans-serif;
          
          transition: color 0.3s ease;
        }
        .blog-title:hover {
          color: #00d4ff;
        }

        /* Blog Meta Information */
        .blog-meta {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 12px;
          color: #cccccc;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          backdrop-filter: blur(3px);
          transition: background 0.3s ease;
        }
        .blog-meta:hover {
          background: rgba(0, 0, 0, 0.5);
        }
        .blog-meta span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* Category Badge */
        .blog-category-wrapper {
          margin-left: auto;
          position: relative;
          z-index: 2;
        }
        .blog-category {
          font-size: 0.8rem;
          background: linear-gradient(45deg, #00d4ff, #9147ff);
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }
        .blog-category:hover {
          transform: scale(1.05);
        }

        /* Responsive Styles for Smaller Screens */
        @media (max-width: 668px) {
          .blog-item {
            flex-direction: column;
            align-items: flex-start;
          }
          .blog-details {
            margin-left: 0;
            margin-top: 12px;
            width: 100%;
          }

             .blog-title {
             font-size : 11px;
             }
          .blog-category-wrapper {
            align-self: flex-end;
            margin-top: 12px;
            margin-left: 10px;
          }

            .blog-category {
          font-size: 0.6rem; 
          padding : 5px 12px;
      }
          .blog-meta {
            justify-content: start;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
