import { useEffect, useState } from "react";
import { database } from "./firebases/firebase";
import { ref, onValue } from "firebase/database";
import Blog from "./blog";

export default function Popular() {
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const blogsRef = ref(database, "blogs");
    onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const posts = Object.entries(data)
          .map(([id, value]) => ({ id, ...value }))
          // Filter out posts with 0 likes or no likes defined
          .filter((post) => (post.likes || 0) > 0)
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 5);
        setPopularPosts(posts);
      }
    });
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-dark mb-4" style={{ fontSize: "21px",fontWeight:"bold" }}>
        Popular Posts
      </h2>

      {popularPosts.length === 0 ? (
        <p className="text-muted">No popular posts available.</p>
      ) : (
        <div className="list-group">
          {popularPosts.map((post) => (
            <Blog key={post.id} blog={post} />
          ))}
        </div>
      )}

      <style>{`
        h5 { 
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
        h5:hover {
          color: #ff6600;
        }
        .author {
          font-size: 0.8rem;
          color: #ff6600;
        }
        .date {
          font-size: 12px;
          position: relative;
          top: -3px;
        }
        .likes {
          font-size: 0.8rem;
        }
        @media (max-width: 576px) {
          .list-group-item {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .list-group-item > div {
            width: 100%;
            margin-bottom: 10px;
          }
          .list-group-item span.badge {
            align-self: flex-end;
          }
          h5 { 
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 12px;
          }
          .author {
            font-size: 0.7rem;
          }
          .date {
            font-size: 10px;
            position: relative;
            top: 1px;
          }
          .likes {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
}
