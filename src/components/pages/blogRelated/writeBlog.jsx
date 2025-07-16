
import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';


const Inline = Quill.import("blots/inline");
class SuggestionBlot extends Inline {
  static create(value) {
    const node = super.create();
    node.setAttribute("data-suggestion", value);
    node.style.backgroundColor = "#fffae6";
    node.style.borderBottom = "2px dotted orange";
    return node;
  }
  static formats(node) {
    return node.getAttribute("data-suggestion");
  }
}
SuggestionBlot.blotName = "suggestion";
SuggestionBlot.tagName = "span";
Quill.register(SuggestionBlot);

const turndownService = new TurndownService({
  headingStyle: 'atx',      
  codeBlockStyle: 'fenced', 
});

export default function Write() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [debouncedContent, setDebouncedContent] = useState("");
  

  const categories = [
    "Business", "Arts", "Technology", "Science", "Geopolitics",
    "Sports", "Health", "History", "Geography", "Education",
    "Entertainment", "Nature", "Animals", "Religions", "Lifestyles",
    "Travel", "Finance", "Gaming", "Productivity", "Fashion",
    "Wellness", "Mindset", "Innovation"
  ];

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  }), []);
  const formats = useMemo(() => [
    "header", "bold", "italic", "underline", "strike",
    "blockquote", "code-block", "list", "bullet",
    "link", "image", "video", "suggestion"
  ], []);

  const onDrop = files => {
    const file = files[0];
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedContent(content), 1000);
    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    const plain = debouncedContent.replace(/<[^>]+>/g, " ").trim();
    if (!plain) return;
    fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text: plain, language: "en-US" })
    })
      .then(res => res.json())
      .then(data => applySuggestions(quillRef.current.getEditor(), data.matches || []))
      .catch(console.error);
  }, [debouncedContent]);

  const applySuggestions = (editor, matches) => {
    matches.forEach(m => {
      if (m.replacements.length) {
        editor.formatText(m.offset, m.length, "suggestion", m.replacements[0].value);
      }
    });
  };

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    const onKeyDown = e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const sel = editor.getSelection();
        const [blot] = editor.scroll.descendant(SuggestionBlot, sel.index);
        if (blot) {
          const suggestion = blot.domNode.getAttribute('data-suggestion');
          const len = blot.length();
          editor.deleteText(sel.index, len);
          editor.insertText(sel.index, suggestion);
          editor.setSelection(sel.index + suggestion.length);
        }
      }
    };
    editor?.root.addEventListener('keydown', onKeyDown);
    return () => editor?.root.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleTagKey = e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/,$/, '');
      if (val && !tags.includes(val)) setTags([...tags, val]);
      setTagInput('');
    }
  };
  const removeTag = idx => setTags(tags.filter((_, i) => i !== idx));

  const uploadCover = async () => {
  if (!coverFile) return "";

  const data = new FormData();
  data.append("file", coverFile);

  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  data.append("upload_preset", preset);

  // Perform the upload
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: data }
  );

  if (!response.ok) {
    console.error("Cloudinary upload error:", await response.text());
    return "";
  }

  const result = await response.json();
  return result.secure_url;
};

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

turndownService.use(gfm);

  const handleUpload = async e => {
    e.preventDefault();
    if (!currentUser) return alert('You must be logged in.');
    setLoading(true);

    const coverUrl = await uploadCover();

    const markdownString = turndownService.turndown(content);

    const db = getDatabase();
    const blogRef = ref(db, 'blogs');
    const payload = {
      title,
      content: markdownString,
      category,
      tags,
      coverImage: coverUrl,
      author: currentUser.displayName || 'Anonymous',
      authorUID: currentUser.uid,
      date: serverTimestamp(),
      likes: 0,
      comments: [],
    };

    push(blogRef, payload)
      .then(() => setShowModal(true))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <>
      
      <div className="modern-write-container">
        <div className="write-header">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="write-title">
                 <i className="fa-solid fa-pen-fancy me-3"></i>
                  Create Your Story
                </h1>
                <p className="write-subtitle">Share your thoughts with the world</p>
              </div>
              <div className="col-auto">
                <button 
                  onClick={() => navigate('/')} 
                  className="btn btn-outline-light btn-lg close-btn"
                  aria-label="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-12">
              <form onSubmit={handleUpload} className="modern-write-form">
                
                {/* Title Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3><i className="fas fa-heading me-2"></i>Title</h3>
                  </div>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-gradient">
                      <i className="fas fa-quote-left"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control modern-input"
                      placeholder="Enter your compelling title..."
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category & Tags Row */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-section">
                      <div className="section-header">
                        <h3><i className="fas fa-folder me-2"></i>Category</h3>
                      </div>
                      <select
                        className="form-select form-select-lg modern-select"
                        required
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                      >
                        <option value="">Choose a category...</option>
                        {categories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-section">
                      <div className="section-header">
                        <h3><i className="fas fa-tags me-2"></i>Tags</h3>
                      </div>
                      <div className="tags-container">
                        <div className="tags-display">
                          {tags.map((t, i) => (
                            <span key={i} className="badge tag-badge">
                              #{t}
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                aria-label={`Remove tag ${t}`}
                                onClick={() => removeTag(i)}
                              ></button>
                            </span>
                          ))}
                        </div>
                        <div className="input-group">
                          <span className="input-group-text bg-gradient">
                            <i className="fas fa-hashtag"></i>
                          </span>
                          <input
                            className="form-control modern-input"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={handleTagKey}
                            placeholder="Type tag and press Enter..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Image Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3><i className="fas fa-image me-2"></i>Cover Image</h3>
                  </div>
                  <div
                    {...getRootProps()}
                    className={`dropzone-modern ${isDragActive ? 'active' : ''} ${coverPreview ? 'has-image' : ''}`}
                  >
                    <input {...getInputProps()} />
                    {coverPreview ? (
                      <div className="image-preview-container">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="cover-preview-img"
                        />
                        <div className="image-overlay">
                          <i className="fas fa-edit fa-2x"></i>
                          <p className="mt-2">Click or drag to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="dropzone-content">
                        <i className="fas fa-cloud-upload-alt fa-3x mb-3"></i>
                        <h4>Drop your cover image here</h4>
                        <p className="text-muted">or click to browse files</p>
                        <small className="text-muted">Supports: JPG, PNG, webp (Max 10MB)</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Editor Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3><i className="fas fa-edit me-2"></i>Content</h3>
                    <small className="text-muted">Press Tab to accept grammar suggestions</small>
                  </div>
                  <div className="editor-wrapper">
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      formats={formats}
                      placeholder="Start writing your amazing story... Use rich formatting, add images, and let your creativity flow!"
                      className="modern-editor"
                    />
                  </div>
                </div>

                {/* Submit Section */}
                <div className="form-section text-center">
                  <button
                    type="submit"
                    className="btn btn-lg publish-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Publishing Your Story...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-rocket me-2"></i>
                        Publish Your Story
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showModal && (
          <div className="modal-overlay-modern" onClick={() => navigate('/')}>
            <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
              <div className="modal-success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>🎉 Success!</h3>
              <p>Your blog has been published successfully!</p>
              <div className="modal-actions">
                <button 
                  onClick={() => navigate('/')} 
                  className="btn btn-primary btn-lg"
                >
                  <i className="fas fa-home me-2"></i>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modern-write-container {
          min-height: 100vh;
        background: linear-gradient(145deg, #2C3E50 0%, #4CA1AF 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Header Styles */
        .write-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px 0;
          margin-bottom: 0;
        }

        .write-title {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .write-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          margin: 0;
          font-weight: 300;
        }

        .close-btn {
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 50px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: white;
          color: white;
          transform: rotate(90deg);
        }

        /* Form Styles */
        .modern-write-form {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          margin-bottom: 40px;
        }

        .form-section {
          margin-bottom: 40px;
          position: relative;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f8f9fa;
        }

        .section-header h3 {
          color: #2c3e50;
          font-size: 1.4rem;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .section-header i {
          color: #667eea;
        }

        /* Input Styles */
        .modern-input, .modern-select {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 15px 20px;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          background: #fafbfc;
        }

        .modern-input:focus, .modern-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          background: white;
          transform: translateY(-2px);
        }

        .input-group-text.bg-gradient {
          background: linear-gradient(45deg, #667eea, #764ba2) !important;
          color: white;
          border: none;
          border-radius: 12px 0 0 12px;
        }

        /* Tags Styles */
        .tags-container {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
        }

        .tags-display {
          margin-bottom: 15px;
          min-height: 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .tag-badge {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          font-size: 0.9rem;
          padding: 8px 15px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Dropzone Styles */
        .dropzone-modern {
          border: 3px dashed #d1d5db;
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          background: #fafbfc;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .dropzone-modern:hover, .dropzone-modern.active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-2px);
        }

        .dropzone-content {
          color: #6b7280;
        }

        .dropzone-content i {
          color: #667eea;
          margin-bottom: 15px;
        }

        .dropzone-content h4 {
          color: #374151;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .image-preview-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .cover-preview-img {
          width: 70%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 12px;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-preview-container:hover .image-overlay {
          opacity: 1;
        }

        /* Editor Styles */
        .editor-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .modern-editor .ql-toolbar {
          background: #f8f9fa;
          border: none;
          border-bottom: 1px solid #e9ecef;
          padding: 15px;
        }

        .modern-editor .ql-container {
          border: none;
          font-size: 1.1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .modern-editor .ql-editor {
          min-height: 500px;
          padding: 40px;
          line-height: 1.6;
        }

        .modern-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: italic;
        }

        /* Publish Button */
        .publish-btn {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          color: white;
          padding: 15px 40px;
          font-size: 1.2rem;
          font-weight: 600;
          border-radius: 50px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
          min-width: 250px;
        }

        .publish-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
          background: linear-gradient(45deg, #5a67d8, #6b46c1);
        }

        .publish-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Modal Styles */
        .modal-overlay-modern {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
        }

        .modal-content-modern {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          animation: modalIn 0.3s ease;
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-success-icon {
          color: #10b981;
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .modal-content-modern h3 {
          color: #1f2937;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .modal-content-modern p {
          color: #6b7280;
          font-size: 1.1rem;
          margin-bottom: 30px;
        }

        .modal-actions .btn {
          min-width: 180px;
          border-radius: 50px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .write-title {
            font-size: 2rem;
          }

          .modern-write-form {
            padding: 25px;
            margin: 20px 10px;
            border-radius: 15px;
          }

          .form-section {
            margin-bottom: 30px;
          }

          .section-header h3 {
            font-size: 1.2rem;
          }

          .modern-input, .modern-select {
            font-size: 1rem;
            padding: 12px 15px;
          }

          .publish-btn {
            width: 100%;
            min-width: auto;
          }

          .dropzone-modern {
            padding: 25px;
          }

          .tags-container {
            padding: 15px;
          }
        }

        @media (max-width: 576px) {
          .write-header {
            padding: 15px 0;
          }

          .write-title {
            font-size: 1.8rem;
          }

          .write-subtitle {
            font-size: 1rem;
          }

          .modern-write-form {
            padding: 20px;
            margin: 15px 5px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .modern-editor .ql-editor {
            min-height: 300px;
            padding: 20px;
          }
        }

        /* Animation Classes */
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Focus and Interaction States */
        .form-section:focus-within .section-header {
          border-bottom-color: #667eea;
        }

        .form-section:focus-within .section-header i {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }

        /* Loading States */
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }

        /* Accessibility Improvements */
        .modern-input:focus,
        .modern-select:focus,
        .publish-btn:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .modern-input, .modern-select {
            border-width: 3px;
          }
          
          .publish-btn {
            border: 2px solid #000;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
