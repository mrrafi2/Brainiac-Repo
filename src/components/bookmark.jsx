import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./style/bookmark.module.css"; 

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("No current user");
        setCurrentUser(null);
        setBookmarks([]);
      } else {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const db = getDatabase();
    const bookmarksRef = ref(db, `bookmarks/${currentUser.uid}`);
    const unsubscribe = onValue(
      bookmarksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.entries(data).map(([id, record]) => ({
            id,
            ...record,
          }));
          // Sort by timestamp descending (most recent first)
          items.sort((a, b) => b.timestamp - a.timestamp);
          setBookmarks(items);
        } else {
          setBookmarks([]);
        }
      },
      (error) => {
        console.error("Error fetching bookmarks:", error);
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
      <h1 className={styles.title}> Bookmarked Posts</h1>
      {bookmarks.length === 0 ? (
        <p className={styles.noData}>You haven't bookmarked any blogs yet.</p>
      ) : (
        <div className={styles.grid}>
          {bookmarks.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => handleClick(item.blogId)}
            >
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardMeta}>By {item.author || "Unknown"}</p>
              <p className={styles.cardMeta}>Category: {item.category}</p>
              <p className={styles.cardDate}>
                Bookmarked on:{" "}
                {new Date(item.timestamp).toLocaleDateString()}{" "}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
