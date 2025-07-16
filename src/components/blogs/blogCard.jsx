
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, runTransaction } from "firebase/database";
import { database } from "../firebases/firebase";
import { getAuth } from "firebase/auth";
import { CalendarDays, UserRound, Eye, ArrowRight, Heart } from 'lucide-react';


export default function Blog({ blog }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [seenCount, setSeenCount] = useState(blog.seen || 0);
  const [isHovered, setIsHovered] = useState(false);

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
    <div 
      className="blog-card-compact"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Overlay */}
      <div className="blog-overlay"></div>
      
      {/* Cover Image Section */}
      {blog.coverImage && (
        <div className="blog-image-container">
          <img 
            src={blog.coverImage} 
            alt={blog.title}
            className="blog-cover-image"
          />
          <div className="image-gradient-overlay"></div>
        </div>
      )}

      <div className="blog-content">
        <span className="category-badge">
          {blog.category}
        </span>

        {/* Title */}
        <h4 className="blog-title">
          {blog.title}
        </h4>

        <div className="blog-meta">
          <div className="meta-item">
            <i > <UserRound size={14}/></i>
            <span>{blog.author ? `${blog.author}` : "Unknown"}</span>
          </div>

          <div className="meta-item">
            <i > <CalendarDays size={14}/></i>
            <span>{new Date(blog.date).toLocaleDateString()}</span>
          </div>

          <div className="meta-stats">
            <div className="stat-item">
              <i > <Eye size={14}/></i>
              <span>{seenCount}</span>
            </div>
            <div className="stat-item">
              <i > <Heart size={14}/></i>
              <span>{blog.likes || 0}</span>
            </div>
          </div>
        </div>

        {/* Read More Indicator */}
        <div className="read-more-indicator">
          <span>Read More</span>
          <i > <ArrowRight size={15}/></i>
        </div>
      </div>

      <style >{`
        .blog-card-compact {
          position: relative;
          width: 100%;
          max-width: 320px;
          margin-bottom: 1.5rem;
          border-radius: 16px;
          background: linear-gradient(145deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.03) 100%);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.15),
            0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }

        .blog-card-compact:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 
            0 12px 40px rgba(0, 123, 255, 0.2),
            0 6px 20px rgba(0, 0, 0, 0.2);
          border-color: rgba(0, 123, 255, 0.3);
        }

        .blog-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            rgba(0, 123, 255, 0.05) 0%,
            rgba(255, 0, 150, 0.05) 50%,
            rgba(0, 255, 135, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .blog-card-compact:hover .blog-overlay {
          opacity: 1;
        }

        /* Image Container */
        .blog-image-container {
          position: relative;
          width: 100%;
          height: 170px;
          overflow: hidden;
          border-radius: 12px 12px 0 0;
        }

        .blog-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: brightness(0.9) contrast(1.1);
        }

        .blog-card-compact:hover .blog-cover-image {
          transform: scale(1.08);
          filter: brightness(1) contrast(1.2);
        }

        .image-gradient-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.4));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .blog-card-compact:hover .image-gradient-overlay {
          opacity: 1;
        }

        /* Content Section */
        .blog-content {
          padding: 1.1rem;
          position: relative;
          z-index: 3;
        }

        /* Category Badge */
        .category-badge {
          display: inline-block;
          padding: 0.22rem 0.72rem;
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border-radius: 12px;
          font-size: 0.55rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.75rem;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
          transition: all 0.3s ease;
        }

        .blog-card-compact:hover .category-badge {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
        }

        /* Compact Title */
        .blog-title {
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 1rem 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s ease;
        }

        .blog-card-compact:hover .blog-title {
          color: #007bff;
        }

        /* Compact Meta Information */
        .blog-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #666;
        }

        .meta-item i {
          width: 12px;
          font-size: 0.7rem;
          color: #007bff;
        }

        .meta-stats {
          display: flex;
          gap: 1rem;
          margin-top: 0.25rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #666;
          font-weight: 500;
        }

        .stat-item i {
          width: 12px;
          font-size: 0.7rem;
          color: #007bff;
        }

        /* Read More Indicator */
        .read-more-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #007bff;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: auto;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        .blog-card-compact:hover .read-more-indicator {
          opacity: 1;
          transform: translateX(0);
        }

        .read-more-indicator i {
          transition: transform 0.3s ease;
        }

        .blog-card-compact:hover .read-more-indicator i {
          transform: translateX(3px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .blog-card-compact {
            max-width: 280px;
            margin-bottom: 1.25rem;
          }

          .blog-image-container {
            height: 140px;
          }

          .blog-content {
            padding: 1rem;
          }

          .blog-title {
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
          }

          .meta-item,
          .stat-item {
            font-size: 0.7rem;
          }

          .category-badge {
            font-size: 0.65rem;
            padding: 0.2rem 0.6rem;
          }
        }

        @media (max-width: 576px) {
          .blog-card-compact {
            max-width: 300px;
            border-radius: 12px;
          }

          .blog-image-container {
            height: 140px;
            border-radius: 8px 8px 0 0;
          }

          .blog-content {
            padding: 0.9rem;
          }

          .blog-title {
            font-size: 0.95rem;
          }

          .meta-stats {
            gap: 0.82rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .blog-card-compact {
            background: linear-gradient(145deg, 
              rgba(255, 255, 255, 0.03) 0%, 
              rgba(255, 255, 255, 0.01) 100%);
            border-color: rgba(255, 255, 255, 0.08);
          }

          .blog-title {
            color: #f8f9fa;
          }

          .blog-card-compact:hover .blog-title {
            color: #4dabf7;
          }

          .meta-item,
          .stat-item {
            color: #adb5bd;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .blog-card-compact,
          .blog-cover-image,
          .read-more-indicator {
            transition: none;
          }
        }

        .blog-card-compact:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
