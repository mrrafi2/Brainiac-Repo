
# Brainiac 

Brainiac Blogsite is a modern, futuristic, and advanced blogging platform built using React and Firebase. It combines traditional blogging elements with innovative features like real-time engagement tracking, personalized reading history, trending and ranking systems, advanced search, bookmarking, and more. Brainiac is designed to provide a seamless and immersive experience for both writers and readers.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Authentication & Account Management
- **Secure Sign-Up/Login:**  
  Users can register and sign in using email/password or Google authentication. Firebase Authentication handles secure user login and persistence.
- **Profile Management:**  
  Users can update their display names and profile details, with data securely stored in Firebase Realtime Database.

### Blogging Functionality
- **Create, Edit & Delete Blogs:**  
  Authors can write, update, or remove blog posts using an intuitive editor that supports rich text and multimedia.
- **Cover Images & Categories:**  
  Enhance posts with cover images and organize content using categories.

### Interactive Engagement
- **Likes & Comments:**  
  Readers can like posts and leave comments. Comments include editing, deleting, and liking features.
- **View (Seen) Count:**  
  Each post tracks the number of views (excluding views by the author) to gauge popularity.
- **Bookmarking:**  
  Users can bookmark their favorite posts. The bookmark button toggles between "Bookmark" and "Bookmarked" with corresponding icons, saving the data in Firebase.

### Personalized Reading History
- **History Page:**  
  Automatically records blogs viewed by the user, grouping them by date. If a blog is viewed multiple times in one day, only the latest view is displayed.
- **Advanced Loading Animation:**  
  While data is being fetched, a futuristic loading spinner provides visual feedback.

### Trending & Ranking
- **Trending Page:**  
  Uses a dynamic algorithm to calculate a trending score for each blog based on views, likes, comments, and a time-decay factor. This ensures that recent high-engagement posts are featured.
- **Blogger Rankings:**  
  Aggregates statistics for each blogger (total likes, views, and post count) and displays a leaderboard with unique HSL-generated avatars for a distinctive look.

### Advanced Search & Navigation
- **Search Functionality:**  
  Quickly search blogs by title, category, or keywords. Search results appear in an animated overlay.
- **Responsive, Futuristic UI:**  
  Features a stylish offcanvas menu, animated modals, and a cyberpunk-inspired design that adapts to both desktop and mobile screens.

## Technology Stack

- **React:** For building dynamic and responsive user interfaces.
  
- **Firebase Realtime Database:** For real-time data storage and synchronization.
- **Firebase Authentication:** For secure user authentication.
  
- **React Router:** For client-side routing in a single-page application.
  
- **CSS Modules & Custom CSS:** For scoped, modular, and responsive styling.
  
- **React Portals:** For rendering overlays and modals outside the parent stacking context.
  
- **Font Awesome:** For using modern and customizable icons.

- And many other front end libraries.

## Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:mrrafi2/Brainiac-Repo.git
   cd brainiac
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project and enable **Realtime Database** and **Authentication**.
   - Copy your Firebase configuration into `src/firebases/firebase.js`.

4. **Start the development server:**
   ```bash
   npm start
   ```

## Usage

- **Account Management:**  
  Sign up and log in using your credentials. Manage your profile via the Account page.

- **Blogging:**  
  Create, edit, and delete blog posts. Engage with posts by liking, commenting, and bookmarking.
  
- **Interaction:**  
  The trending and ranking pages showcase posts and bloggers based on real-time engagement data (likes, views, comments). Use the search functionality to find posts by keywords, title, or category.

- **Navigation:**  
  The futuristic offcanvas navbar and animated modals ensure smooth transitions between pages, regardless of device.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
   
2. Create a new branch:  
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:  
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to your branch:  
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).


