import Blog from "./blogCard";
import { useEffect, useState } from "react";
import { database } from "../firebases/firebase"; 
import { ref, onValue } from "firebase/database";
import {  ChevronLeft, ChevronRight  } from 'lucide-react';


export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(true);
  const blogsPerPage = 12;

 
  useEffect(() => {
    const blogsRef = ref(database, "blogs");
    const unsubscribe = onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const blogList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        const reversedBlogs = blogList.reverse();
        setBlogs(reversedBlogs);
        setTotalPages(Math.ceil(reversedBlogs.length / blogsPerPage));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ... keep existing code (pagination logic)
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const generatePageNumbers = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = [...Array(totalPages).keys()].map((n) => n + 1);
    } else {
      pages = [1, 2, 3, 4, 5, 6, "..." , totalPages];
    }
    return pages;
  };

  return (
    <div className="blogs-container">
      {/* Modern Pagination Header */}
      <div className="pagination-header">
        <div className="pagination-stats">
          <span className="stats-text">
            Showing {indexOfFirstBlog + 1}-{Math.min(indexOfLastBlog, blogs.length)} of {blogs.length} articles
          </span>
        </div>
        
        <nav className="modern-pagination">
          <div className="pagination-controls">
            <button
              className={`nav-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
                 <i> <ChevronLeft/> </i>
            </button>
            
            <div className="page-numbers">
              {generatePageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`page-btn ${currentPage === page ? 'active' : ''} ${page === "..." ? "ellipsis" : ""}`}
                  onClick={() => page !== "..." && setCurrentPage(page)}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              className={`nav-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
                <i > <ChevronRight/></i>
            </button>
          </div>
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-animation">
            <div className="loading-spinner"></div>
            <div className="loading-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
            </div>
          </div>
          <p className="loading-text text-dark">Discovering amazing content...</p>
        </div>
      )}

      {/* Blogs Grid */}
      <div className="blogs-grid">
        {currentBlogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Bottom Pagination */}
      {!loading && blogs.length > blogsPerPage && (
        <div className="pagination-footer">
          <nav className="modern-pagination">
            <div className="pagination-controls">
              <button
                className={`nav-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i> <ChevronLeft/> </i>
                <span>Previous</span>
              </button>
              
              <div className="page-info">
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              
              <button
                className={`nav-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
                <i > <ChevronRight/></i>
              </button>
            </div>
          </nav>
        </div>
      )}

      <style >{`
        /* Main Container */
        .blogs-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }

        .blogs-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at top, rgba(0, 123, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(ellipse at bottom, rgba(255, 0, 150, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        /* Pagination Header */
        .pagination-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 2;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pagination-stats {
          display: flex;
          align-items: center;
        }

        .stats-text {
          color: #333;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        /* Modern Pagination */
        .modern-pagination {
          position: relative;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: black;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .nav-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .nav-btn:hover::before {
          left: 100%;
        }

        .nav-btn:hover:not(.disabled) {
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.2), rgba(0, 123, 255, 0.1));
          border-color: rgba(0, 123, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.2);
        }

        .nav-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
        }

        .page-numbers {
          display: flex;
          gap: 0.25rem;
          margin: 0 1rem;
        }

        .page-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(5px);
        }

        .page-btn:hover:not(.ellipsis) {
          background: rgba(0, 123, 255, 0.2);
          border-color: rgba(0, 123, 255, 0.4);
          transform: translateY(-2px);
        }

        .page-btn.active {
          background: linear-gradient(135deg, #007bff, #0056b3);
          border-color: #007bff;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
        }

        .page-btn.ellipsis {
          cursor: default;
          opacity: 0.6;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          position: relative;
          z-index: 2;
        }

        .loading-animation {
          position: relative;
          margin-bottom: 2rem;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #007bff;
          border-radius: 50%;
          animation: float 2s ease-in-out infinite;
        }

        .particle-1 {
          top: -20px;
          left: -10px;
          animation-delay: 0s;
        }

        .particle-2 {
          top: -15px;
          right: -15px;
          animation-delay: 0.7s;
        }

        .particle-3 {
          bottom: -20px;
          left: -5px;
          animation-delay: 1.4s;
        }

        .loading-text {
          color: #e0e0e0;
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          opacity: 0.8;
        }

        /* Blogs Grid */
        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 2;
          margin-bottom: 3rem;
          resize: center;
          align-items: center;
        }

        /* Pagination Footer */
        .pagination-footer {
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .page-info {
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          color: #e0e0e0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .blogs-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 668px) {
          .blogs-container {
            padding: 1rem 0.5rem;
          }

          .pagination-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .blogs-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .page-numbers {
            display: block;
          }

          .nav-btn span {
            display: none;
          }

          .nav-btn {
            padding: 0.75rem;
          }

          .stats-text {
            font-size: 0.8rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .blogs-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .pagination-header {
            padding: 0.75rem;
          }

          .nav-btn {
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .page-btn {
            width: 35px;
            height: 35px;
            font-size: 0.8rem;
          }
        }

        /* Dark mode enhancements */
        @media (prefers-color-scheme: dark) {
          .blogs-container {
            background: linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%);
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .loading-spinner,
          .particle,
          .nav-btn,
          .page-btn {
            animation: none;
            transition: none;
          }
        }

        .nav-btn:focus,
        .page-btn:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
