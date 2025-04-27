import Blog from "./blog";
import { useEffect, useState } from "react";
import { database } from "./firebases/firebase"; 
import { ref, onValue } from "firebase/database";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(true);
  const blogsPerPage = 16;

 
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

  // Compute blogs for the current page via slicing
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
    <>
      
      <nav className="mt-2 ms-2 pagination-container" style={{ position: 'relative', top: '-25px' }}>
        <ul className="pagination justify-content-start">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link me-1"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <i className="fa-solid fa-angles-left"></i>
            </button>
          </li>
          {generatePageNumbers().map((page, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === page ? 'active' : ''} ${page === "..." ? "disabled" : ""}`}
            >
              {page === "..." ? (
                <span className="page-link ms-1">...</span>
              ) : (
                <button className="page-link ms-1" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              )}
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link ms-2"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <i className="fa-sharp fa-solid fa-angles-right"></i>
            </button>
          </li>
        </ul>
      </nav>
      
      <div>

        {loading && (
        <div className="loading-container">
          <div className="spinner-grow text-info" style={{color:"ff6600"}}></div>
        </div>
      )}


        {currentBlogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>

      <style>{`
         .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
        }
        .loading-spinner {
          width: 20px;
          height: 20px;
          background-color: #ff6600;
          border-radius: 50%;
          animation: grow 1.5s ease-in-out infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        /* Mobile Adjustments for Pagination Bars */
        @media (max-width: 576px) {
          .pagination-container .page-link {
            padding: 4px 8px;
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}
