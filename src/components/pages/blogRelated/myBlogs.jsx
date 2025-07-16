import { useState, useEffect } from "react";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../../firebases/firebase";
import { Link  } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function MyBlogs() {
  const { currentUser } = useAuth();
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const blogsRef = ref(database, "blogs");
    const unsubscribe = onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const posts = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      const userPosts = posts.filter(p => p.authorUID === currentUser.uid);
        userPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMyBlogs(userPosts);
      } else {
        setMyBlogs([]);
      }
      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, [currentUser]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this blog?")) {
      remove(ref(database, `blogs/${id}`));
    }
  };

  

  const popularBlogs = [...myBlogs]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5);

  return (
    <div className="container my-4">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div>
          <h2 className="blogs-header">{currentUser ? currentUser.displayName : 'Your'} Blogs</h2>

          <div className="popular-section">
            <h2 className="section-title">Popular Blogs</h2>
            {popularBlogs.length === 0 ? (
              <p className="no-results">No popular blogs yet.</p>
            ) : ( 
              <div className="list-group ">
                {popularBlogs.map((blog) => (
                  <>
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.id}`}
                    className="list-group-item popular-item"
                  >
                {blog.coverImage && ( 
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="popular-img"
                    />
                )}
                    <div className="popular-details">
                      <h5 className="popular-title">{blog.title}</h5>
                      <small className="popular-date">
                        {new Date(blog.date).toLocaleDateString()}
                      </small>
                      <span className="popular-likes badge">
                        <i className="fa-solid fa-thumbs-up me-1"></i>
                        {blog.likes || 0}
                      </span>
                    </div>
                  </Link>

                  <button
                    className="btn btn-sm btn-outline-danger "
                    onClick={() => handleDelete(blog.id)}
                    style={{width:"85px", marginLeft:"15px", fontWeight:600}}
                  >
                    Remove
                  </button>
                   </>
                ))}
              </div>
            )}
          </div>
          <br />
           <br />
           <hr style={{height:"1.5px" , backgroundColor:'#777'}} />
           <br />
           <br />
          <div className="all-section">
            <h2 className="section-title">All Blogs</h2>
            {myBlogs.length === 0 ? (
              <p className="no-results">You haven't written any blogs yet.</p>
            ) : (
              <div className="list-group">
                {myBlogs.map((blog) => (
                  <>
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.id}`}
                    className="list-group-item all-item"
                  >
                     {blog.coverImage && ( 
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="popular-img"
                    />
                )}                 
                   <div className="all-details">
                      <h5 className="all-title">{blog.title}</h5>
                      <p className="all-category">{blog.category}</p>
                      <small className="all-date">
                        {new Date(blog.date).toLocaleDateString()}
                      </small>
                    </div>
                  </Link>

                  <button
                    className="btn btn-sm btn-outline-danger "
                    style={{width:"85px", marginLeft:"15px", fontWeight:600}}
                    onClick={() => handleDelete(blog.id)}
                  >
                    Remove
                  </button>

                  </>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* Container Styles */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Roboto', sans-serif;
          background: linear-gradient(135deg, #f7f7f7, #ffffff);
        }
        .blogs-header {
          text-align: center;
          margin: 1rem 0;
          font-size: 25px;
          color: #333;
          font-weight: 600;
          margin-bottom: 50px
        }
        
        /* Loading Styles */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
        }
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #ff6600;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Section Title */
        .section-title {
          font-size: 20px;
          margin-bottom: 20px;
          color: #555;
          border-left: 4px solid #ff6600;
          padding-left: 10px;
        }
        
        /* List Group Common Styles */
        .list-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .list-group-item {
          display: flex;
          align-items: center;
          border: none;
          border-radius: 10px;
          padding: 20px;
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .list-group-item:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
       
        /* Popular Blogs Section */
        .popular-img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 15px;
          transition: transform 0.3s;
        }
        .popular-img:hover {
          transform: scale(1.05);
        }
        .popular-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .popular-title {
          font-size: 15px;
          font-weight: 500;
          margin: 0;
          transition: color 0.3s;
        }
        .popular-title:hover {
          color: #ff6600;
        }
        .popular-date {
          font-size: 12px;
          color: #777;
        }
        .popular-likes {
          font-size: 12px;
          font-weight: bold;
          align-self: flex-end;
          background: #007bff;
          color: #fff;
          padding: 2px 6px;
          border-radius: 10px;
        }
        
        /* All Blogs Section */
        .all-img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 15px;
          transition: transform 0.3s;
        }
        .all-img:hover {
          transform: scale(1.05);
        }
        .all-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .all-title {
          font-size: 16px;
          font-weight: 500;
          margin: 0;
          transition: color 0.3s;
        }
        .all-title:hover {
          color: #ff6600;
        }
        .all-category {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          color: #ff6600;
        }
        .all-date {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.7;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 576px) {
          .list-group-item {
            flex-direction: column;
            align-items: flex-start;
          }
          .popular-img, .all-img {
            width: 100%;
            height: auto;
            max-height: 200px;
            margin-right: 0;
            margin-bottom: 10px;
          }
          .popular-details, .all-details {
            width: 100%;
          }
          .popular-likes {
            align-self: center;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
}
