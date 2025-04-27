import React from "react";
import styles from "./style/help.module.css";
import {Link} from "react-router-dom"

export default function HelpFAQ() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Help & FAQ</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>General Overview</h2>
        <p className={styles.paragraph}>
          Welcome to Brianiac, your advanced blogsite built with modern web technologies and a traditional touch. Here you can read, comment, like, bookmark, and share blogs. Our platform includes features such as a dynamic trending system, blogger rankings, search, and a personalized reading history.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Account & Authentication</h2>
        <ul className={styles.list}>
          <li>
            <strong>Q:</strong> How do I sign up and log in?
            <br /><br />
            <strong>A:</strong> Use the sign-up form to create your account with an email, password, and username. Once registered, log in using the provided credentials. Our Auth system ensures your account data is safely stored and that only you can access your personalized features.
          </li>
          <li>
            <strong>Q:</strong> How is my user data secured?
            <br /> <br />

            <strong>A:</strong> We use Firebase Authentication and Realtime Database security rules to ensure that your data is only accessible to you. Rules are set to restrict access to your personal data such as bookmarks and reading history.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
      <h1 className={styles.bigHeader}>📚 Reading & Engaging with Blogs
      </h1>
      <br />
      <h2 className={styles.sectionHeader}>Read Blogs ?
      </h2>
        <ul className={styles.list}>
          <li>
            <strong>Q:</strong> How can I find blogs?

            <br /> <br />
            <strong>A:</strong> You can discover content through: <br />
🔍 Search Bar – Find blogs by title, category, or keywords. <br />
🔥 Trending Section – See the most popular blogs based on engagement. <br />
🏷️ Categories – Explore different topics with custom themes & animations.

          </li>
        
         </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Blog Interactions</h2>
        <ul className={styles.list}>
          <li>
            <strong>Q:</strong> How do I like a blog post?
            <br /> <br />
            <strong>A:</strong> Simply click the thumbs-up icon on a blog post. The like count is updated in real time and only authenticated users can like posts.
          </li>
          <li>
            <strong>Q:</strong> How can I leave a comment?
            <br /> <br />
            <strong>A:</strong> Use the comment input field at the bottom of a blog post. You can submit your comment and interact further by liking or editing your own comments.
          </li>
          <li>
            <strong>Q:</strong> What does the "seen" count represent?
            <br /> <br />
            <strong>A:</strong> The seen count indicates how many times a blog post has been viewed by users (excluding the author). This helps determine the popularity of the content.
          </li>
          <li>
            <strong>Q:</strong> What are bookmarks and how do I use them?
            <br /> <br />
            <strong>A:</strong> The bookmark feature lets you save posts for later reading. Click the Bookmark button beside the Like button on any blog post. The icon toggles between an outlined bookmark ( <i className="fa-regular fa-bookmark"></i> ) and a solid bookmark with the text changing from “Bookmark” to “Bookmarked”. Your bookmarks are saved in your account for quick access.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Personal Libary</h2>
        <ul className={styles.list}>
        <li>
          <strong>Q:</strong> How to get Bookmarked posts?
          <br /> <br />
          
          <strong>A:</strong> See on the top right corner, your account avatar is positioned click it to get options like "Bookmarkes" and "Liked" to get your library!
        </li>
        </ul>
        </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Advanced Features</h2>
        <ul className={styles.list}>
          <li>
            <strong>Q:</strong> What is the Trending section?
            <br /> <br />
            <strong>A:</strong> The Trending page calculates a score for each blog post based on views, likes, and comments, adjusted by a time-decay factor. This ensures that recent high-engagement posts are featured, keeping the trends dynamic.
          </li>
          <li>
            <strong>Q:</strong> How are Blogger Rankings determined?
            <br /> <br />
            <strong>A:</strong> Blogger Rankings are based on aggregated metrics across all posts by an author. This includes total likes, total views, and the number of blogs written. Bloggers are then sorted by these metrics to highlight the most influential voices on Brianiac.
          </li>
          <li>
            <strong>Q:</strong> How do I search for blogs?
            <br /> <br />
            <strong>A:</strong> Our search feature lets you find blogs by title, category, or keywords. Simply type your query into the search bar, and matching results will be displayed in an overlay.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Troubleshooting & Support</h2>
        <ul className={styles.list}>
          <li>
            <strong>Q:</strong> My bookmarks or reading history are not updating. What should I do?
            <br /> <br />
            <strong>A:</strong> Ensure you are logged in and that your internet connection is stable. If the problem persists, check your Firebase security rules and console logs for errors.
          </li>
          <li>
            <strong>Q:</strong> How can I report an issue or get help?
            <br /> <br />
            <strong>A:</strong> Please visit our <Link to="/contact">Contact Us</Link> page for support or further assistance.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeader}>Additional Information</h2>
        <p className={styles.paragraph}>
          Brianiac combines traditional blog features with modern functionalities such as real-time view counts, personalized reading history, and dynamic trending calculations. Our advanced bookmarking, ranking, and search systems are designed to enhance your blogging experience and help you discover content that matters.
        </p>
      </section>
    </div>
  );
}
