import { useParams, Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { database } from "../firebases/firebase";
import {getDatabase, ref, onValue, update, set, push, serverTimestamp,remove } from "firebase/database";
import { getAuth,onAuthStateChanged } from "firebase/auth";
import blogP2 from "../images/bloggs.webp";
import {useAuth} from "../contexts/AuthContext"

export default function BlogDetails() {
  const { id } = useParams();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const username = user ? user.displayName || "User" : "User";

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [editCommentIndex, setEditCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [currentUser, setCurrentUser] = useState(null); 
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate ()


  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!userId) return;
    const blogRef = ref(database, `blogs/${id}`);
    onValue(blogRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBlog(data);
        setComments(Array.isArray(data.comments) ? data.comments : []);
        setLiked(data.likedBy?.includes(userId) || false);
        fetchRelatedPosts(data.category);
        saveToHistory(data); 

      }
    });
  }, [id, userId]);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []); 


  const saveToHistory = (blogData) => {
    if (!userId || !blogData) return;
    const historyRef = ref(database, `history/${userId}`);
    
    const newHistoryEntry = {
      blogId: id,
      title: blogData.title,
      author: blogData.author || "Unknown",
      category: blogData.category,
      timestamp: serverTimestamp(),
    };
    
    set(push(historyRef), newHistoryEntry);
  };

  const fetchRelatedPosts = (category) => {
    if (!category) return;
    const blogsRef = ref(database, "blogs");
    onValue(blogsRef, (snapshot) => {
      const allBlogs = snapshot.val();
      if (allBlogs) {
        const related = Object.entries(allBlogs)
          .filter(([key, value]) => key !== id && value.category === category)
          .map(([key, value]) => ({ id: key, ...value }))
          .slice(0, 3);

        setRelatedPosts(related);
      }
    });
  };

  const handleLike = () => {
    if (!userId) return alert("Please log in to like.");
    let updatedLikes = blog.likes || 0;
    let updatedLikedBy = blog.likedBy || [];

    if (liked) {
      updatedLikes -= 1;
      updatedLikedBy = updatedLikedBy.filter((uid) => uid !== userId);
    } else {
      updatedLikes += 1;
      updatedLikedBy.push(userId);
    }

    update(ref(database, `blogs/${id}`), { likes: updatedLikes, likedBy: updatedLikedBy });
    setLiked(!liked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!userId) return alert("Please log in to comment.");

    const newCommentObj = {
      userId,
      username,
      text: newComment,
      likes: 0,
      likedBy: []
    };

    const updatedComments = [...comments, newCommentObj];
    update(ref(database, `blogs/${id}`), { comments: updatedComments });
    setComments(updatedComments);
    setNewComment("");
  };

  const handleLikeComment = (index) => {
    if (!userId) return alert("Please log in to like a comment.");
    const updatedComments = [...comments];
    let comment = updatedComments[index];

    if (!comment.likedBy) comment.likedBy = [];

    if (comment.likedBy.includes(userId)) {
      comment.likedBy = comment.likedBy.filter((uid) => uid !== userId);
      comment.likes = (comment.likes || 0) - 1;
    } else {
      comment.likedBy.push(userId);
      comment.likes = (comment.likes || 0) + 1;
    }

    setComments(updatedComments);
    update(ref(database, `blogs/${id}`), { comments: updatedComments });
  };

  const handleDeleteComment = (index) => {
    if (!userId) return alert("Please log in to delete a comment.");
    const comment = comments[index];

    if (comment.userId !== userId) {
      return alert("You can only delete your own comments.");
    }

    const updatedComments = comments.filter((_, i) => i !== index);
    update(ref(database, `blogs/${id}`), { comments: updatedComments });
    setComments(updatedComments);
  };

  const handleEditComment = (index) => {
    setEditCommentIndex(index);
    setEditCommentText(comments[index].text);
  };

  const handleUpdateComment = (index) => {
    const updatedComments = [...comments];
    updatedComments[index].text = editCommentText;
    update(ref(database, `blogs/${id}`), { comments: updatedComments });
    setEditCommentIndex(null);
  };


  useEffect(() => {
    if (!id) return; // Ensure ID exists
    const db = getDatabase();
    const blogRef = ref(db, `blogs/${id}`);
  
    onValue(
      blogRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setBlog(data);
        } else {
          setBlog(null);
        }
      },
      (error) => {
        console.error("Error fetching blog:", error);
      }
    );
  }, [id]);
  
  useEffect(() => {
    if (!currentUser || !id) return; // Ensure user and ID exist
    const db = getDatabase();
    const bookmarkRef = ref(db, `bookmarks/${currentUser.uid}/${id}`);
  
    onValue(
      bookmarkRef,
      (snapshot) => {
        setIsBookmarked(snapshot.exists());
      },
      (error) => {
        console.error("Error fetching bookmark status:", error);
      }
    );
  }, [currentUser, id]);
  
  const handleToggleBookmark = async () => {
    if (!currentUser) return alert("Please log in to bookmark.");
    if (!blog) return alert("Blog data not loaded yet.");
  
    const db = getDatabase();
    const bookmarkRef = ref(db, `bookmarks/${currentUser.uid}/${id}`);
  
    if (isBookmarked) {
      try {
        await remove(bookmarkRef);
        setIsBookmarked(false);
      } catch (error) {
        console.error("Error removing bookmark:", error);
      }
    } else {
      const newBookmark = {
        blogId: id,
        title: blog.title || "Untitled",
        author: blog.author || "Unknown",
        category: blog.category || "Uncategorized",
        timestamp: serverTimestamp(),
      };
  
      try {
        await set(bookmarkRef, newBookmark);
        setIsBookmarked(true);
      } catch (error) {
        console.error("Error setting bookmark:", error);
      }
    }
  };
  
  if (!blog)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <span className="spinner-border  p-2" style={{ backgroundColor: "white" , color:'#ff6600'}}></span>
      </div>
    );

  return (
    <div className="container p-4 ">

      <div className="d-flex justify-content-between mb-4   shadow-sm p-2 px-4" style={{position: "sticky" , top:0 , 
                 borderRadius: '7px',
                 background:' rgba(255, 255, 255, 0.25)',
                 backdropFilter:' blur(15px)' ,
                 boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'

       }} >

        <button className="btn btn-light border-0   "   onClick={() => navigate(-1)}
          style={{padding:'0px 10px',borderRadius:"10px"}}
          >
        <i className="fa-solid fa-left-long" 
        style={{fontSize:"15px"}}
        ></i>       
         </button>

         <div className="d-flex justify-content-between " style={{width:"170px"}}>
          
          <button 
             className="btn btn-light border-0" 
             onClick={() => setDarkMode(prevMode => !prevMode)}
             style={{padding:'7px 14px'}}
          >
          <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
         </button>

         <button className="btn btn-light btn-sm border-0  "   onClick={() => navigate("/")}
           style={{padding:'8px 13px'}}
          >
        <i className="fa-solid fa-home" style={{fontSize:"16px"}}></i>       
         </button>

         </div>
      </div>

      <h3 className="mb-5">{blog.title}</h3>
      
      <p className="mb-1 " style={{ fontSize: "14px", fontWeight: "bold", opacity: 0.8, position: 'relative', top: '-4px', color: darkMode ? "#ddd" : "#555" }}>
        {blog.author ? `${blog.author}` : "Unknown Author"}
      </p>
      <p className="" style={{color: darkMode ? "#fff" : "#333" }} >{new Date(blog.date).toLocaleDateString()}</p>
      <p style={{ color: "#ff6600", fontWeight: 500, marginBottom: '30px' }}>{blog.category}</p>
      
      <div className=" mb-5 blog-content " dangerouslySetInnerHTML={{ __html: blog.content }} style={{color: darkMode ? "#ddd" : "#333", fontFamily: `"Inter", sans-serif` }} />

      <hr className="bg-secondary" style={{ height: "3px", opacity: 0.6 }} />
       
       <div className="d-flex w-75 justify-content-between mb-5">

      <button className="btn btn-primary mt-3 mb-2" onClick={handleLike} style={{ position: 'relative', left: '-2px' }}>
        <i className={liked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i> {blog.likes || 0}
      </button>

      {/* NEW: Bookmark Button */}
      <button
            className="btn btn-secondary mt-3 mb-2"
            onClick={handleToggleBookmark}
          >
            {isBookmarked ? (
              <><i className="fa-solid fa-bookmark"></i> Bookmarked</>
            ) : (
              <><i className="fa-regular fa-bookmark"></i> Bookmark</>
            )}
          </button>

      </div>

      <form onSubmit={handleCommentSubmit} className="comment-section mt-4">
        <div className="comment-input">
          <input
            type="text"
            className="form-control comment-box"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
        </div>
        <button type="submit" className="btn submit-btn mt-2 ms-2">Submit</button>
      </form>

      <h4 className="mt-5 text-secondary">Comments</h4>

      <ul className="list-unstyled">
        {comments.map((comment, index) => {
          // Generate unique background color for avatar
          const getColorFromString = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
              hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return `hsl(${hash % 360}, 70%, 60%)`;
          };

          const bgColor = getColorFromString(comment.userId || "defaultUser");

          return (
            <li className="mt-3 p-3 border rounded" key={index}>
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center me-2 comment-avatar"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: bgColor,
                    fontSize: '13px',
                    fontWeight: "bold",
                  }}
                >
                  {(comment.username || "User").slice(0, 2).toUpperCase()}
                </div>

                {editCommentIndex === index ? (
                  <div className="w-100">
                    <input
                      type="text"
                      className="form-control border-1"
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                    />
                    <button
                      className="btn btn-success btn-sm mt-2 ms-1"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleUpdateComment(index)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="w-100">
                    <p className="text-secondary mb-0 comment-text">{comment.text}</p>
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center mt-0 ms-2">
                <button
                  className="btn btn-sm btn-white border-0 ms-4"
                  style={{ fontSize: '12px' }}
                  onClick={() => handleLikeComment(index)}
                >
                  <i
                    className={
                      comment.likedBy?.includes(userId)
                        ? "fa-solid fa-heart text-danger"
                        : "fa-regular fa-heart"
                    }
                  ></i>{" "}
                  {comment.likes || 0}
                </button>

                {comment.userId === userId && (
                  <>
                    <button
                      className="btn btn-sm btn-white border-0 ms-2"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleEditComment(index)}
                    >
                      <i className="fa-sharp fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-white border-0 ms-5"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleDeleteComment(index)}
                    >
                      <i className="fa-sharp fa-regular fa-trash-can"></i>
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <h4 className="mt-5">Related Posts</h4>
      <div className="row">
        {relatedPosts.length > 0 ? (
          relatedPosts.map((post) => (
            <div key={post.id} className="col-md-4 mb-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="card-title">
                    <Link to={`/blog/${post.id}`} className="text-dark fw-bold" style={{ textDecoration: "none" }}>
                      {post.title}
                    </Link>
                  </h6>
                  <p className="text-muted small">{post.category}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No related posts available.</p>
        )}
      </div>

      <style>{`

      .dark-mode {
  background-color: #171717;
  color: #f1f1f1;
}
  
  /* General Blog Content Enhancements */
  .blog-img {
    width: 100%;
    max-width: 700px; 
    display: block;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  .blog-content {
    font-size: 18px;
    line-height: 1.9; /* Improved readability */
    color: #4d4d4d;
    text-align: justify;
    margin-bottom: 40px;
  }

  /* Buttons Section */
  .btn {
    font-size: 18px; /* Increased font size */
    font-weight: 600; /* Stronger emphasis */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 8px;
    padding: 11px 20px; /* Larger padding for prominence */
  }
  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
  }
  .btn-primary {
    background: linear-gradient(45deg, #4e8eff, #1a73e8);
    color: white;
    border: none;
  }
  .btn-secondary {
    background: linear-gradient(45deg, #ff6600, #e65c00);
    color: white;
    border: none;
  }
  .btn-light {
    background: #fff;
    color: #6c757d;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    padding: 12px;
  }
  .btn-light:hover {
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
  }

  /* Comment Section */
  .comment-section {
    margin-top: 40px;
    padding: 20px;
    border-radius: 12px;
    background:  rgba(250, 250, 250, 0.85);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .comment-box {
    width: calc(100% - 140px); 
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #f9f9f9;
    transition: border 0.3s ease, box-shadow 0.3s ease;
    font-size: 16px; /* Larger input text */
  }
  .comment-box:focus {
    border-color: #4e8eff;
    box-shadow: 0 0 6px rgba(78, 142, 255, 0.5);
    outline: none;
  }
  .submit-btn {
    background: linear-gradient(45deg, #4e8eff, #1a73e8);
    color: white;
    border: none;
    padding: 12px 24px; 
    border-radius: 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    font-size: 16px;
    margin-top : 10px;
  }
  .submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  /* Comment Item */
  .comment-avatar {
    width: 40px; 
    height: 40px;
    font-size: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  .comment-text {
    font-size: 15px;
    color: #555;
    padding: 12px;
    background: #f1f1f1;
    border-radius: 10px;
    margin-left: 10px;
  }
  li {
    list-style: none;
  }

  /* Related Posts Section */
  .related-post-card {
    background: #fff;
    border: none;
    border-radius: 10px; /* Slightly larger border radius */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    padding: 15px; /* Larger padding for better spacing */
  }
  .related-post-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  }
  .related-post-card .card-body {
    padding: 18px;
  }
  .related-post-card .card-title {
    font-size: 18px;
    font-weight: 700; /* Bolder titles for prominence */
    color: #333;
  }
  .related-post-card .card-title:hover {
    color: #4e8eff;
  }
  .related-post-card .card-category {
    font-size: 15px; /* Slightly larger font size for categories */
    color: #777;
  }

  /* Spinner Styles */
  .spinner-border {
    width: 60px; /* Larger spinner */
    height: 60px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #ff6600;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Small Screen Enhancements */
  @media (max-width: 576px) {
    .blog-img {
      width: 100%;
    }
    h3 {
      font-size: 21px;
    }
    .blog-content {
      font-size: 15px; 
    }
    .btn {
      font-size: 16px;
      padding: 10px 16px;
    }
    .related-post-card .card-title {
      font-size: 13px;
    }
    .related-post-card .card-category {
      font-size: 11px;
    }
    .comment-section {
      padding: 15px;
    }
    .comment-box {
      font-size: 14px;
      padding: 10px;
    }
    .submit-btn {
      font-size: 12px;
      padding: 6px 12px;
    }
    .comment-avatar {
      width: 36px;
      height: 36px;
      font-size: 14px;
    }
  }
`}</style>


    </div>
  );
}
