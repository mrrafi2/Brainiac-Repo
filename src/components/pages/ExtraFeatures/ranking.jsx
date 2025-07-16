import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import styles from "../../style/ranking.module.css";

const getAvatarColor = (str) => {
  if (!str) return "#ccc";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
};

export default function Rankings() {
  const [rankings, setRankings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRankings = async () => {
      const db = getDatabase();
      const blogsRef = ref(db, "blogs");
      const snapshot = await get(blogsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const blogsArray = Object.entries(data).map(([id, blog]) => ({
          id,
          ...blog,
        }));

        const authorStats = {};
        blogsArray.forEach((blog) => {
          const author = blog.author || "Unknown";
          if (!authorStats[author]) {
            authorStats[author] = { totalLikes: 0, totalViews: 0, blogCount: 0 };
          }
          authorStats[author].totalLikes += blog.likes || 0;
          authorStats[author].totalViews += blog.seen || 0;
          authorStats[author].blogCount += 1;
        });

        const rankingArray = Object.entries(authorStats).map(
          ([author, stats]) => ({
            author,
            ...stats,
          })
        );
        rankingArray.sort((a, b) => {
          if (b.totalLikes !== a.totalLikes) {
            return b.totalLikes - a.totalLikes;
          }
          return b.totalViews - a.totalViews;
        });

        setRankings(rankingArray);
      }
    };

    fetchRankings();
  }, []);

  const handleClick = (author) => {
    navigate(`/blogger/${author}`);
  };

  return (
    <div className={styles.container}>
      <button
        className={`border-0 mt-2 text-light ${styles.homeBtn}`}
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h1 className={styles.title}>Bloggers</h1>
      {rankings.length === 0 ? (
        <p className={styles.noData}>No ranking data available.</p>
      ) : (
        <div className={styles.list}>
          {rankings.map((item, index) => (
            <div
              key={item.author}
              className={styles.card}
              onClick={() => handleClick(item.author)}
            >
              <div className={styles.rankNumber}>{index + 1}</div>
              <div className={styles.bloggerInfo}>
                <div
                  className={styles.avatar}
                  style={{ backgroundColor: getAvatarColor(item.author) }}
                >
                  {item.author.slice(0, 2).toUpperCase()}
                </div>
                <div className={styles.details}>
                  <h3 className={styles.bloggerName}>{item.author}</h3>
                  <p className={styles.stats}>
                    Blogs: {item.blogCount} | Likes: {item.totalLikes} | Views:{" "}
                    {item.totalViews}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
