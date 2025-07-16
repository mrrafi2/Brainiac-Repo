import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./style/liked.module.css";

export default function Liked() {
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Track current user using onAuthStateChanged
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("No current user");
        setCurrentUser(null);
        setLikedBlogs([]);
      } else {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all blogs and filter those liked by the current user
  useEffect(() => {
    if (!currentUser) return;
    const db = getDatabase();
    const blogsRef = ref(db, "blogs");
    const unsubscribe = onValue(
      blogsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const allBlogs = Object.entries(data).map(([id, blog]) => ({
            id,
            ...blog,
          }));
          // Filter blogs that have likedBy array including the current user's uid
          const filtered = allBlogs.filter(
            (blog) => blog.likedBy && blog.likedBy.includes(currentUser.uid)
          );
          // Optional: sort the liked blogs (e.g., by likes descending)
          filtered.sort((a, b) => b.likes - a.likes);
          setLikedBlogs(filtered);
        } else {
          setLikedBlogs([]);
        }
      },
      (error) => {
        console.error("Error fetching liked blogs:", error);
      }
    );
    return () => unsubscribe();
  }, [currentUser]);

  const handleClick = (blogId) => {
    if (blogId) navigate(`/blog/${blogId}`);
  };

  return (
    <div className={styles.container}>
      <button
        className={`border-0 mt-2 text-light ${styles.homeBtn}`}
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h1 className={styles.title}>Liked Blogs</h1>
      {likedBlogs.length === 0 ? (
        <p className={styles.noData}>
          You haven't liked any blogs yet.
        </p>
      ) : (
        <div className={styles.grid}>
          {likedBlogs.map((blog) => (
            <div
              key={blog.id}
              className={styles.card}
              onClick={() => handleClick(blog.id)}
            >
              <h3 className={styles.cardTitle}>{blog.title}</h3>
              <p className={styles.cardMeta}>
                By {blog.author || "Unknown"}
              </p>
              <p className={styles.cardMeta}>
                Category: {blog.category}
              </p>
              <p className={styles.cardDate}>
                Liked on:{" "}
                {new Date(blog.timestamp || Date.now()).toLocaleDateString()}{" "}
              </p>
              <p className={styles.cardLikes}><i className= "fa-solid fa-thumbs-up"></i>
              <span className="ms-1"> {blog.likes || 0}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
