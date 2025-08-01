// one-stop category feed: recent, popular, paginated
// tips: debounce page changes if data refetching is needed

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../firebases/firebase";
import { ref, get } from "firebase/database";
import Blog from "../../blogs/blogCard"; // using Blog component that updates seen count

export default function CategoryPage( ) {

  const { categoryName } = useParams();
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 

  const blogsPerPage = 8;
 
  // de logics---
  // fetch and filter posts by category
  useEffect(() => {
    const blogsRef = ref(database, "blogs");
    get(blogsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const blogsData = snapshot.val();
        const filteredPosts = Object.entries(blogsData)
          .map(([id, post]) => ({ ...post, id }))
          .filter((post) =>
            post.category &&
            post.category.toLowerCase() === categoryName.toLowerCase()
          );
        setCategoryPosts(filteredPosts);

        // most recent 2 posts (by date)
        const sortedByDate = [...filteredPosts].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRecentPosts(sortedByDate.slice(0, 2));

        // Top 5 popular posts (by likes)
        const sortedByLikes = [...filteredPosts].sort((a, b) => b.likes - a.likes);
        setPopularPosts(sortedByLikes.slice(0, 5));

        //   compute total pages
        setTotalPages(Math.ceil(filteredPosts.length / blogsPerPage));
      }
    }
  );
  }, [categoryName]);

  // slice posts for current page
  const displayedPosts = categoryPosts.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  // page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="pagination-container d-flex justify-content-start mt-5 ms-4" style={{ fontSize: "9px" }}>
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <i className="fa-solid fa-backward"></i>
              </button>
            </li>
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${currentPage === pageNumber + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link ms-1"
                  onClick={() => handlePageChange(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </button>
              </li>
            )
          )
            }

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link ms-1"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <i className="fa-solid fa-forward"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* -------------- */}
      
       {/* Main content grid + sidebar */}
      <div className="container my-5">
        <h2 className="text-center mb-5 category-title">
          {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Blogs
        </h2>
        <div className="row">
          <div className="col-lg-8 mb-5" style={{          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
}}>
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <Blog key={post.id} blog={post} />
              ))
            ) : (
              <p>No blogs found in this category.</p>
            )}
          </div>
          
          <div className="col-lg-4">
            <div className="sidebar p-4 bg-light rounded shadow-sm">
              {/* Recent Posts */}  
              <div className="side-section mb-4">
                <h5 className="side-title text-muted">
                  Recent in {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                </h5>
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <Blog key={post.id} blog={post} isSmall />
                  ))
                ) : (
                  <p className="text-muted" style={{ fontSize: "10px" }}>No recent posts.</p>
                )}
              </div>
              <hr className="my-4" />
              {/* Popular Posts */}  
                <h5 className="side-title text-muted">
                  Popular in {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                </h5>
                {popularPosts.length > 0 ? (
                  popularPosts.map((post) => (
                    <Blog key={post.id} blog={post} isSmall />
                  ))
                ) : (
                  <p className="text-muted" style={{ fontSize: "10px" }}>No popular posts.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      <style>{`
        .category-title {
          font-size: 26px;
          font-weight: bold;
          color: #333;
        }
        .blog-item {
          padding: 10px 15px;
          border-bottom: 1px solid #e0e0e0;
          transition: background-color 0.3s;
          cursor: pointer;
        }
     
        
        .sidebar {
          position: sticky;
          top: 20px;
        }
        .side-section {
          margin-bottom: 20px;
        }
        .side-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 25px;
        }
        .side-item-title {
          font-size: 13px;
          font-weight: 600;
          color: #000;
          text-decoration: none;
          transition: color 0.3s;
        }
        .side-item-title:hover {
          color: #ff6600;
        }
        .side-item-meta {
          font-size: 0.75rem;
          color: #777;
          margin-top: 5px;
        }
        .page-link { 
          margin-left: 6px;
        }  
           /* Mobile Enhancements */
             @media (max-width: 576px) {
                     .pagination-container {  
                     justify-content: start !important; 
                    margin-left: 5px !important;
                    }    
                    
   .row {
  flex-direction: column;
}

.col-lg-6,
.col-lg-6 {
  max-width: 100%;
  flex: 0 0 100%;
}

.blog-item {
  flex-direction: column;
  align-items: flex-start;
}

.blog-thumb {
  width: 100%;
  height: auto;
  max-height: 200px;
  margin-bottom: 10px;
}

.sidebar {
  position: static;
  margin-top: 20px;
}

  .blog-title {
          font-size: 12px;

      }

       .blog-meta {
          font-size: 0.54rem;
      }

      .side-item-title {
          font-size: 11px
      }
      `}
      </style>
    </>
  );
}
