 import { useParams, Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../../style/BlogDetails.module.css";
import { database } from "../../firebases/firebase";
import {getDatabase, ref, onValue, update, set, push, serverTimestamp,remove } from "firebase/database";
import { getAuth,onAuthStateChanged } from "firebase/auth";
import {useAuth} from "../../contexts/AuthContext";
import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Home,
  Heart,
  Bookmark,
  PencilLine,
  Trash2,
  Share2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";



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
  const [shareOpen, setShareOpen] = useState(false);


  const navigate = useNavigate ()


  useEffect(() => {
    document.body.classList.toggle("darkMode", darkMode);
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
    if (!currentUser || !id) return; 
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

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"]
    ]
  }), []);

  const formats = useMemo(() => [
    "header","bold","italic","underline","strike",
    "blockquote","code-block","list","bullet",
    "link","image","video","suggestion"
  ], []);
  
if (!blog) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
    </div>
  );
}

return (
    <div className={`${styles.root} ${darkMode ? styles.darkMode : ""}`}> 
  <div className={styles.container}>
    
    <div className={styles.topNavigation}>
      <div className={styles.navButtonGroup}>
        <button onClick={() => navigate(-1)} className={styles.navButton}>
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className={styles.navButtonGroup}>
        <button
          onClick={() => setDarkMode(dm => !dm)}
          className={styles.navButton}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={() => navigate("/")} className={styles.navButton}>
          <Home size={20} />
        </button>
      </div>
    </div>

    {/* Blog Header */}
    <h1 className={styles.blogTitle}>{blog.title}</h1>
    {blog.coverImage && (
      <img
        src={blog.coverImage}
        alt={blog.title}
        className={styles.coverImage}
      />
    )}

    {/* Metadata */}
    <div className={styles.blogMeta}>
      <div className={styles.authorName}>
        {blog.author || "Unknown Author"}
      </div>
      <div className={styles.blogDate}>
        {new Date(blog.date).toLocaleDateString()}
      </div>
      <div className={styles.blogCategory}>
        {blog.category}
      </div>
    </div>

    {/* Content */}
    <div className={styles.markdownContent}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ inline, className, children, ...props }) {
            const lang = className?.replace("language-", "") || "txt";
            if (inline) {
              return (
                <code {...props}>
                  {children}
                </code>
              );
            }
            return (
              <div>
                <div>
                  {["#ff5f56", "#ffbd2e", "#27c93f"].map(color => (
                    <span key={color} />
                  ))}
                  <span>{`snippet.${lang}`}</span>
                </div>
                <pre className={className} {...props}>
                  {children}
                </pre>
              </div>
            );
          }
        }}
      >
        {blog.content}
      </ReactMarkdown>
    </div>

    <hr className={styles.sectionDivider} />

    {/* Actions */}
    <div className={styles.actionButtons}>
      <button
        onClick={handleLike}
        className={`${styles.actionButton} ${styles.likeButton}`}
      >
        <Heart
          size={18}
          color={liked ? "#fff" : "#fee2e2"}
          fill={liked ? "#fff" : "none"}
        />
        Like {blog.likes || 0}
      </button>

      <div className={styles.shareWrapper}>
  <button
    className={styles.shareIconButton}
    onClick={() => setShareOpen(o => !o)}
    aria-label="Share"
  >
    <Share2 size={20} />
  </button>

  {shareOpen && (
    <div className={styles.shareMenu}>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
        target="_blank" rel="noopener noreferrer"
        title="Facebook"
      >
        <i className="fab fa-facebook-f" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
        target="_blank" rel="noopener noreferrer"
        title="X"
      >
        <i className="fab fa-x-twitter" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`}
        target="_blank" rel="noopener noreferrer"
        title="LinkedIn"
      >
        <i className="fab fa-linkedin-in" />
      </a>
      <a
        href={`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}`}
        target="_blank" rel="noopener noreferrer"
        title="Reddit"
      >
        <i className="fab fa-reddit-alien" />
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(window.location.href)}`}
        title="Email"
      >
        <i className="fas fa-envelope" />
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`}
        target="_blank" rel="noopener noreferrer"
        title="Telegram"
      >
        <i className="fab fa-telegram-plane" />
      </a>
      <a
        href={`fb-messenger://share?link=${encodeURIComponent(window.location.href)}`}
        title="Messenger"
      >
        <i className="fab fa-facebook-messenger" />
      </a>
      <a
        href={`https://imo.im/chat?shareurl=${encodeURIComponent(window.location.href)}`}
        target="_blank" rel="noopener noreferrer"
        title="IMO"
      >
        <i className="fab fa-imdb" />
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`}
        target="_blank" rel="noopener noreferrer"
        title="WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </a>
    </div>
  )}
</div>

      <button
        onClick={handleToggleBookmark}
        className={`${styles.actionButton} ${styles.bookmarkButton}`}
      >
        <Bookmark
          size={18}
          color={isBookmarked ? "#fff" : "#fef3c7"}
          fill={isBookmarked ? "#fff" : "none"}
        />
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </button>
    </div>

    {/* Comments */}
    <div className={styles.commentSection}>
      <h2 className={styles.commentsTitle}>Comments</h2>
      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment…"
          className={styles.commentInput}
        />
        <button type="submit" className={styles.commentSubmitButton}>
          Submit
        </button>
      </form>

      <ul className={styles.commentsList}>
        {comments.map((c, i) => {
          const bg = (() => {
            let h = 0;
            for (let ch of c.userId || "U") h = ch.charCodeAt(0) + ((h << 5) - h);
            return `hsl(${h % 360},70%,60%)`;
          })();

          return (
            <li key={i} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <div
                  className={styles.commentAvatar}
                  style={{ backgroundColor: bg }}
                >
                  {(c.username || "User").slice(0, 2).toUpperCase()}
                </div>

                {editCommentIndex === i ? (
                  <input
                    value={editCommentText}
                    onChange={e => setEditCommentText(e.target.value)}
                    className={styles.commentEditInput}
                  />
                ) : (
                  <p className={styles.commentText}>{c.text}</p>
                )}
              </div>

              <div className={styles.commentActions}>
                <button
                  onClick={() => handleLikeComment(i)}
                  className={styles.commentActionButton}
                >
                  <Heart
                    size={16}
                    color={c.likedBy?.includes(userId) ? "#10b981" : "#6b7280"}
                    fill={c.likedBy?.includes(userId) ? "#10b981" : "none"}
                  />
                  {c.likes}
                </button>

                {c.userId === userId && (
                  <>
                    <button
                      onClick={() => handleEditComment(i)}
                      className={styles.commentActionButton}
                    >
                      <PencilLine size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(i)}
                      className={styles.commentActionButton}
                    >
                      <Trash2 size={16} />
                    </button>
                    {editCommentIndex === i && (
                      <button
                        onClick={() => handleUpdateComment(i)}
                        className={styles.saveButton}
                      >
                        Save
                      </button>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>

    {/* Related Posts */}
    <h2 className={styles.relatedPostsTitle}>Related Posts</h2>
    {relatedPosts.length > 0 ? (
      <div className={styles.relatedPostsGrid}>
        {relatedPosts.map(p => (
          <div key={p.id} className={styles.relatedPostCard}>
            <Link to={`/blog/${p.id}`} className={styles.relatedPostTitle}>
              {p.title}
            </Link>
            <div className={styles.relatedPostCategory}>
              {p.category}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.noRelatedPosts}>
        No related posts available.
      </div>
    )}
  </div>
  </div>
);

} 