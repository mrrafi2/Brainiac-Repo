import React, { useEffect, useState } from "react";
import { database } from "../firebases/firebase";
import { ref, get, runTransaction } from "firebase/database";
import { useNavigate } from "react-router-dom";
import styles from "../style/trending.module.css";

const lambda = 0.1; // Decay constant

const TrendingBlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const blogRef = ref(database, `blogs/${blog.id}`);
    try {
      await runTransaction(blogRef, (currentData) => {
        if (currentData) {
          return { ...currentData, seen: (currentData.seen || 0) + 1 };
        }
        return currentData;
      });
    } catch (error) {
      console.error("Error updating seen count:", error);
    }
    navigate(`/blog/${blog.id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <h3 className={styles.title}>{blog.title}</h3>
      <p className={styles.meta}>
        By {blog.author || "Unknown Author"} |  <span className="badge bg-warning" style={{fontSize:'9px', position:'relative',top:"-1px"}}>{blog.category}</span>
      </p>
      <p className={styles.metrics}>
      <i className="fa-solid fa-eye mn-2"></i> {blog.seen || 0}   | {" "} <i className="fa-solid fa-thumbs-up"></i> {blog.likes || 0} | Comments:{" "}
        {blog.comments ? blog.comments.length : 0}
      </p>
      <p className={styles.score}>
        Trending Score: {blog.trendingScore.toFixed(2)}
      </p>
    </div>
  );
};

export default function Trending() {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsRef = ref(database, "blogs");
      const snapshot = await get(blogsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const blogsArray = Object.entries(data).map(([id, blog]) => ({
          id,
          ...blog,
        }));
        const now = new Date();
        const blogsWithScore = blogsArray.map((blog) => {
          const publishDate = new Date(blog.date);
          const daysSincePublish =
            (now - publishDate) / (1000 * 60 * 60 * 24);
          const V = blog.seen || 0;
          const L = blog.likes || 0;
          const C = blog.comments ? blog.comments.length : 0;
          const trendingScore =
            (V + 2 * L + 3 * C) * Math.exp(-lambda * daysSincePublish);
          return { ...blog, trendingScore };
        });
        const sorted = blogsWithScore.sort(
          (a, b) => b.trendingScore - a.trendingScore
        );
        // Take top 20
        setTrendingBlogs(sorted.slice(0, 20));
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className={styles.container}>
    

      <h1 className={styles.pageTitle}>Trending Blogs</h1>
      {trendingBlogs.length === 0 ? (
        <p className={styles.noResults}>No trending posts available.</p>
      ) : (
        <div className={styles.grid}>
          {trendingBlogs.map((blog) => (
            <TrendingBlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
