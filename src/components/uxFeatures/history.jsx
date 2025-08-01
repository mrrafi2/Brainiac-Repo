//  shows what user already peeked at 
// Todo: pull grouping logic into a custom hook for clarity

import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "../style/history.module.css";

export default function History() {

  const [historyItems, setHistoryItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const navigate = useNavigate();

   // watch for login/logout
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("No current user");
        setCurrentUser(null);
        setHistoryItems([]);
        setLoading(false); 

      } else {
        setCurrentUser(user);
      }
    }
  );
    return () => unsubscribe();
  }, [ ] 
);

// load history 
  useEffect(() => {
    if (!currentUser) return;

    const db = getDatabase();
    // adjusted path per our updated rules
    const historyRef = ref(db, `history/${currentUser.uid}`);
    
    const unsubscribe = onValue(
      historyRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.entries(data).map(([id, record]) => ({
            id,
            ...record,
          } )
        );
          // sort by timestamp descending (newest first)
          items.sort((a, b) => b.timestamp - a.timestamp);
          setHistoryItems(items);
        } else {
          setHistoryItems([]);

        }
        setLoading(false); 

      },
      (error) => {
        console.error("Error fetching history:", error);
      }
    );
    return () => unsubscribe();
  }, [currentUser]
);

// group by date
  let groupedHistory = historyItems.reduce((acc, item) => {
    const dateKey = new Date(item.timestamp).toLocaleDateString();

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);

    return acc;
  }, { } 
);

  Object.keys (groupedHistory).forEach((dateKey) => {
    const group = groupedHistory[dateKey];
    const uniqueByBlog = group.reduce((acc, item) => {
      const blogId = item.blogId;
      if (!acc[blogId] || item.timestamp > acc[blogId].timestamp) {
        acc[blogId] = item;
      }
      return acc;
    }, {});
    groupedHistory[dateKey] = Object.values(uniqueByBlog);
  });

  // Sort group keys in descending order (most recent date first)
  const sortedGroupKeys = Object.keys(groupedHistory).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handleClick = (blogId) => {
    if (blogId) navigate(`/blog/${blogId}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
       
        <h4 style={{ textAlign: "center", color: "#777" }}>
          Your Reading History
        </h4>
        {historyItems.length === 0 ? (
          <p className={styles.noHistory}>
            You haven't viewed any blogs yet.
          </p>
        ) : (
          sortedGroupKeys.map((dateKey) => {
            const today = new Date().toLocaleDateString();
            const badgeLabel = dateKey === today ? "Today" : dateKey;
            return (
              <div key={dateKey} className={styles.groupContainer}>
                <div
                  className={styles.groupHeader}
                  style={{
                    borderTop: "2px solid #ddd",
                    padding: "10px 0",
                    position: "relative",
                    marginBottom: "25px",
                    marginTop: "70px",
                  }}
                >
                  <span
                    className={styles.groupBadge}
                    style={{
                      position: "absolute",
                      left: "0px",
                      top: "-88%",
                      transform: "translateY(-50%)",
                      background: "#4f4b47",
                      color: "#fff",
                      padding: "5px 16px",
                      borderRadius: "0px 10px 0px 0px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {badgeLabel}
                  </span>
                </div>
                <div className={styles.groupGrid}>
                  {groupedHistory[dateKey].map((item) => (
                    <div
                      key={item.id}
                      className={styles.card}
                      onClick={() => handleClick(item.blogId)}
                    >
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardMeta}>
                        By {item.author || "Unknown"}
                      </p>
                      <p className={styles.cardMeta}>{item.category}</p>
                      <p
                        className={styles.cardTime}
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#777",
                          margin: "4px 0px",
                        }}
                      >
                        Viewed at:{" "}
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
      <style>{`
       /* Additional inline styles for the new layout */
        .${styles.groupContainer} {
          margin-bottom: 30px;
        }
        .${styles.groupHeader} {
          border-top: 2px solid #ddd;
          padding: 10px 0;
          position: relative;
          margin-bottom: 15px;
        }
        .${styles.groupBadge} {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: #ff6600;
          color: #fff;
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: bold;
        }    
       
        .${styles.homeBtn} {
           position: absolute;
    top: 15px;
    left: 20px;
    z-index: 10;
    background: linear-gradient(135deg, #ff6600, #e65c00);
    color: #fff;
    border-radius: 5px;
    width: auto;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    padding: 8px 16px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    width : 60px
        }

.${styles.card} {
  background: #fefefe;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;

}
.${styles.card}:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  border-color: #ff6600;
}
.${styles.cardTitle} {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
  transition: color 0.3s ease;
}
.${styles.cardTitle}:hover {
  color: #ff6600;
}
.${styles.cardMeta} {
  font-size: 12px;
  color: #777;
  margin: 2px 0;
  /* Added a subtle gradient background and padding for decoration */
  background: linear-gradient(90deg, #fff, #f7f7f7);
  padding: 2px 4px;
  border-radius: 4px;
}
.${styles.cardTime} {
  color: #777;
  margin: 4px 6px;
  
}

 .${styles.loadingContainer} {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .${styles.loader} {
    width: 50px;
    height: 50px;
    border: 6px solid #f3f3f3;
    border-top: 6px solid #ff6600;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

/* Responsive adjustments for small screens */
@media (max-width: 576px) {
  .${styles.groupBadge} {
    font-size: 12px;
    padding: 4px 8px;
  }
  .${styles.cardTitle} {
    font-size: 14px;
  }
  .${styles.cardMeta},
  .${styles.cardTime},
  .${styles.cardSeen} {
    font-size: 11px;
  }
}

      `}</style>
    </>
  );
}
