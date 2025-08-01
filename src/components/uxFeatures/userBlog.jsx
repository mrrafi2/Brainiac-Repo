import { useEffect, useState } from "react";
import { database } from "../firebases/firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function UsersBlog() {
  const { currentUser } = useAuth();
  const [recentPosts, setRecentPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setRecentPosts([]);
      return;
    }

    const blogsRef = ref(database, "blogs");
    const unsubscribe = onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const posts = Object.entries(data).map(([id, value]) => ({
          id,
          coverImage: value.coverImage || "",
          ...value,
        }));
        const userPosts = posts.filter(
          (post) => post.author === (currentUser.displayName || "Anonymous")
        );
        userPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentPosts(userPosts.slice(0, 3));
      } else {
        setRecentPosts([]);
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [currentUser]);

  return (
    <div className="container my-4">
      <h2 className="text-dark mb-3">My Blogs</h2>

      {recentPosts.length === 0 ? (
        <p className="text-muted">You have not written any blogs yet.</p>
      ) : (
        <div className="list-group recent-list">
          {recentPosts.map((post) => (
            <Link
  key={post.id}
  to={`/blog/${post.id}`}
  className="list-group-item recent-item"
>
  {post.coverImage && (
    <img
      src={post.coverImage}
      alt={post.title}
      className="recent-thumb"
    />
  )}

  <div className="recent-info-wrapper">
    <div className="recent-info">
      <h5 className="mb-1">{post.title}</h5>
      <p className="text-muted date">
        {new Date(post.date).toLocaleDateString()}
      </p>
    </div>
    <span className="badge cat">{post.category}</span>
  </div>
</Link>
          ))}
        </div>
      )}

      <div className="mt-3 text-center">
        <button
          className="btn btn-outline-danger view-all-btn"
          onClick={() => navigate("/myblogs")}
        >
          View All
        </button>
      </div>

      <style>{`
        h2 {
          font-family: 'Orbitron', sans-serif;
          font-size: 21px;
          letter-spacing: 1px;
          text-align: center;
          background: -webkit-linear-gradient(45deg, #00d4ff, #9147ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          font-weight: bold;
        }

        /* Recent List Container */
        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }


.recent-item {
  display: block;         
  padding: 0;             
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: linear-gradient(135deg, #f7f7f7, #ffffff);
  border: none;

}

.recent-thumb {
  width: 100%;
  height: auto;
  max-height: 180px;       /* cap height for consistency */
  object-fit: cover;
  display: block;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Info + badge container */
.recent-info-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;           /* restore padding around text */
}

/* Hover effects */
.recent-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,212,255,0.3);
}

.recent-item:before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0,212,255,0.1),
    rgba(145,71,255,0.1)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
  z-index: 0;
}
.recent-item:hover:before {
  opacity: 1;
}

.recent-info-wrapper,
.recent-thumb {
  position: relative;
  z-index: 1;
}


        .recent-item:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          background: linear-gradient(45deg, rgba(0,212,255,0.15), rgba(145,71,255,0.15));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }
        .recent-item:hover:before {
          opacity: 1;
        }
        .recent-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,212,255,0.3);
        }
        .recent-info,
        .cat {
          position: relative;
          z-index: 1;
        }

    @media (max-width: 576px) {
  .recent-thumb {
    max-height: 120px;
  }
}

        /* Post Title */
        h5 {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          color: #333;
          transition: color 0.3s ease;
        }
       
        }

        /* Post Date */
        .date {
          font-size: 13px;
          color: #777;
          margin-top: 5px;
        }

        /* Category Badge */
        .cat {
          font-size: 13px;
          background: linear-gradient(45deg, #ff66cc, #9147ff);
          color: #fff;
          padding: 8px 14px;
          border-radius: 20px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }
        .cat:hover {
          transform: scale(1.05);
        }

        /* View All Button */
        .view-all-btn {
          border: 2px solid #ff6600;
          color: #ff6600;
          padding: 10px 20px;
          border-radius: 8px;
          background: transparent;
          transition: background-color 0.3s ease, transform 0.3s ease;
          margin-top : 20px ;
        }
        .view-all-btn:hover {
          background-color: #ff6600;
          color: #fff;
          transform: translateY(-3px);
        }

        /* Responsive Adjustments */
        @media (max-width: 576px) {
          h2 {
            font-size: 18px;
          }
          h5 {
            font-size: 12px;
          }
          .date {
            font-size: 11px;
          }
          .cat {
            font-size: 11px;
            padding: 5px 10px;
          }
        }
      `}</style>
    </div>
  );
}
