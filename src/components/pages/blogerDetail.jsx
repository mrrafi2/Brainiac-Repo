import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Blog from "../blog"; 
import styles from "../style/blogger.module.css"; 

const getColorFromString = (str) => {
  if (!str) return "#ccc";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
};

const BloggerDetail = () => {
  const { username } = useParams(); 
  const [bloggerData, setBloggerData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const blogsRef = ref(db, "blogs");
      const snapshot = await get(blogsRef);
      const data = snapshot.val();

      if (data) {
        const allBlogs = Object.entries(data).map(([id, blog]) => ({ id, ...blog }));
        const bloggerBlogs = allBlogs.filter((blog) => blog.author === username);
        setBlogs(bloggerBlogs);

        // Extract unique categories
        const uniqueCategories = [...new Set(bloggerBlogs.map((blog) => blog.category))];
        setCategories(uniqueCategories);

        // Set blogger data if blogs exist
        if (bloggerBlogs.length) {
          setBloggerData({
            author: username,
            avatarColor: getColorFromString(username),
          });
        }
      }
    };

    fetchData();
  }, [username]);

  if (!bloggerData) {
    return (
      <div className={styles.loadingContainer}>
        <span className="spinner-border" style={{ color: '#ff6600', opacity: 0.7 }}></span>
      </div>
    );
  }

  const mostPopularBlogs = [...blogs]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);

  return (
    <div className={styles.bloggerDetailPage}>
      <div className={styles.bloggerHeader}>
        {/* Accent line at top */}
        <div
          className={styles.headerLine}
          style={{ backgroundColor: bloggerData.avatarColor }}
        ></div>
        
        {/* Home Button */}
        <button
          className={`btn btn-sm btn-light border-0 ${styles.homeBtn}`}
          onClick={() => navigate("/")}
        >
          <i className="fa-solid fa-house"></i>
        </button>

        <div className={styles.headerContent}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: bloggerData.avatarColor }}
          >
            {username ? username.slice(0, 2).toUpperCase() : 'NA'}
          </div>
          <h1 className={`${styles.bloggerName} fw-bold opacity-75`}>
            {bloggerData.author}
          </h1>
          <div className={styles.bloggerCategories}>
            <strong>Upload Blogs in: </strong><br />
            <span className={styles.categoriesBadge}>
              {categories.length ? categories.join(" | ") : "No categories yet"}
            </span>
          </div>
        </div>

        {/* Accent line at bottom */}
        <div
          className={`${styles.headerLine} shadow-sm`}
          style={{ backgroundColor: bloggerData.avatarColor }}
        ></div>
      </div>

      {/* Most Popular Blogs Section */}
      <div className={styles.blogsSection}>
        <h2 className={styles.sectionTitle}>Most Popular Blogs</h2>
        {mostPopularBlogs.length === 0 ? (
          <p className="text-muted">No popular blogs available.</p>
        ) : (
          <div className={styles.blogsGrid}>
            {mostPopularBlogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
         
      <br />

      {/* All Blogs Section */}
      <div className={styles.blogsSection}>
        <h2 className={styles.sectionTitle}>All Blogs</h2>
        {blogs.length === 0 ? (
          <p className="text-muted">No blogs available.</p>
        ) : (
          <div className={styles.blogsGrid}>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloggerDetail;
