// magic text box that finds your blogs by title, category, or secret keywords
// Todo: throttle `handleSearch` to lighten the CPU load

import { useEffect, useState, useRef } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { Search } from "lucide-react";


export default function SearchBar() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [overlayStyle, setOverlayStyle] = useState({});
  const containerRef = useRef(null);
  const navigate = useNavigate();

    // load every blog once, so we can ninja-search them
  useEffect(() => {
    const fetchBlogs = async () => {
      const db = getDatabase();
      const blogsRef = ref(db, "blogs");
      try {
        const snapshot = await get(blogsRef);
        if (snapshot.exists()) {
          const blogData = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          setBlogs(blogData);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []
);

  // position the overlay next to the input field
  useEffect(() => {
    if (showOverlay && containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    let overlayHeight = '70vh';
    let overlayWidth = rect.width;
    let overlayLeft = rect.left;

    if (isMobile) {
      overlayHeight = '70vh';
      overlayWidth = window.innerWidth * 0.9;
      overlayLeft = window.innerWidth * 0.05;
    } else if (isTablet) {
      overlayHeight = '70vh';
    }
     // TODO: adjust for table/desktop breakpoints
    setOverlayStyle ({
      position:"fixed",
      top: rect.bottom + 10,
      left: overlayLeft,
      width: overlayWidth,
      height: overlayHeight,
      background: '#1a1a1a',
      boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
      overflowY: 'auto',
      zIndex: 999,
      padding: '20px',
      maxWidth: '600px',
    } );
  }
}, [showOverlay]
);

  
  const handleSearch = (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    setQuery(searchTerm);

        // split into words, match any in title/category/keywords
    if (searchTerm) {
      const searchWords = searchTerm.split(" ").filter((word) => word !== "");
      const normalizedSearch = searchTerm.replace(/\s+/g, "");

      const filteredResults = blogs.filter((post) => {
        
        const title = post.title ? post.title.toLowerCase() : "";
        const category = post.category ? post.category.toLowerCase() : "";
        let keywords = "";
        if (post.keywords && Array.isArray(post.keywords)) {
          keywords = post.keywords.join(" ").toLowerCase();
        } else if (typeof post.keywords === "string") {
          keywords = post.keywords.toLowerCase();
        }

        const matchesWords = searchWords.every(
          (word) =>
            title.includes(word) ||
            category.includes(word) ||
            keywords.includes(word)
        );

        const normalizedTitle = title.replace(/\s+/g, "");
        const normalizedCategory = category.replace(/\s+/g, "");
        const normalizedKeywords = keywords.replace(/\s+/g, "");
        const matchesNormalized =
          normalizedTitle.includes(normalizedSearch) ||
          normalizedCategory.includes(normalizedSearch) ||
          normalizedKeywords.includes(normalizedSearch);

        return matchesWords || matchesNormalized;
      });

      setResults(filteredResults);
      setShowOverlay(true);
    } else {
      setResults([]);
      setShowOverlay(false);
    }
  };

  const handleNavigate = async (id) => {
    const db = getDatabase();
    const postRef = ref(db, `blogs/${id}`);
    try {
      const snapshot = await get(postRef);
      if (snapshot.exists()) {
        const currentSeen = snapshot.val().seen || 0;
        await update(postRef, { seen: currentSeen + 1 });
      }
    } catch (error) {
      console.error("Error updating seen count:", error);
    }
    setShowOverlay(false);
    navigate(`/blog/${id}`);
  };

  return (
    <div className="search-wrapper" ref={containerRef}>
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search blog..."
          className="search-input"
          value={query}
          onChange={handleSearch}
        />
        <button className="search-button" onClick={() => setShowOverlay(true)}>
          <Search size={17}/>
        </button>
      </div>

      {showOverlay &&
        ReactDOM.createPortal(
          <div className="overlay" style={overlayStyle}>
            <div className="overlay-content">
              <button
                className="overlay-close"
                onClick={() => setShowOverlay(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h4 className="h4">Search Results for: "{query}"</h4>
              <hr />
              {results.length > 0 ? (
                results.map((post) => (
                  <div
                    key={post.id}
                    className="result-item"
                    onClick={() => handleNavigate(post.id)}
                  >
                    <h6 className="result-title">{post.title}</h6>
                    <span className="result-category">
                      {post.category ? post.category : "Uncategorized"}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{fontSize:'12px'}}>No results found.</p>
              )}
            </div>
          </div>,
          document.body
        )}

      <style>{`
        /* Wrapper for the search bar */
        .search-wrapper {
          position: relative;
          width: 400%;
        }
        .search-bar {
          display: flex;
          
          width: 100%;
          max-width: 400px;
          height: 42px;
          border: 1px solid #ddd;
          border-radius: 25px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }
        .search-bar:hover {
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .search-input {
          flex: 1;
          height: 100%;
          border: none;
          padding-left: 15px;
          font-size: 1rem;
          background: transparent;
          color: #333;
        }
        .search-input:focus {
          outline: none;
        }
        .search-button {
          height: 100%;
          background: linear-gradient(45deg, #00d4ff, #9147ff);
          border: none;
          color: #fff;
          padding: 0 15px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .search-button:hover {
          transform: scale(1.05);
        }

        .overlay {
         height: 65vh !important;
             z-index: 5000 !important;

        }
        .overlay .overlay-content {
          position: relative;
          color: #fff;
        }
        .overlay-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          position: absolute;
          top: 10px;
          right: 15px;
          color: #fff;
          cursor: pointer;
          line-height: 1;
        }
        .overlay-content h4 {
          color: #00d4ff;
          font-family: "Orbitron", sans-serif;
          margin-bottom: 10px;
        }
        .overlay-content hr {
          border: none;
          border-top: 1px solid #444;
          margin-bottom: 15px;
        }
        .result-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
          cursor: pointer;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        .result-item:hover {
          background: rgba(0,212,255,0.15);
        }
        .result-title {
          font-size: 1rem;
          margin: 0;
          color: #fff;
          transition: color 0.3s ease;
        }
        .result-item:hover .result-title {
          color: #ff6600;
        }
        .result-category {
          font-size: 0.8rem;
          color: #aaa;
          margin-top: 4px;
        }
        /* Responsive adjustments */
        @media (max-width: 780px) {
          .search-bar {
            max-width: 300px;
            height: 40px;
            
          }
          .search-input {
            font-size: 0.9rem;
            padding-left: 15px;
          }
          .search-button {
            font-size: 0.9rem;
            padding: 0 14px;
          }
          .result-title {
            font-size: 0.9rem;
          }
          .result-category {
            font-size: 0.75rem;
          }
          .overlay {
            height: 60vh !important;
          }
        }

         @media (max-width: 570px) {
          .search-bar {
            max-width: 300px;
            height: 45px;
            position: relative;
            left:-12px;
          }
          .search-input {
            font-size: 0.9rem;
            padding-left: 15px;
          }
          .search-button {
            font-size: 0.8rem;
            padding: 0 11px;
          }
          .result-title {
            font-size: 0.87rem;
          }
          .result-category {
            font-size: 0.67rem;
          }

           .overlay {
            height: 60vh !important;
            
          }

          .overlay .h4 {
          font-size: 0.9rem 
          }
      }
      `}</style>
    </div>
  );
}  