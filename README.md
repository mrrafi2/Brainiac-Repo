
# Brainiac – A Minimalist Blogging Platform for Creators

*Tagline: Write. Share. Inspire.*

Brainiac Blogsite is a modern, futuristic, and advanced blogging platform built using React and Firebase. It combines traditional blogging elements with innovative features like real-time engagement tracking, personalized reading history, trending and ranking systems, advanced search, bookmarking, and more. Brainiac is designed to provide a seamless and immersive experience for both writers and readers.


**Live Demo:** [https://brainiac.example.com](https://brainiac.example.com)
**Repo:** [https://github.com/mrrafi2/Brainiac-Repo](https://github.com/mrrafi2/Brainiac-Repo)

**Tech Stack:**

* **Vite** for ultra-fast bundling and HMR
* **React** (v18) for component-driven, declarative UI
* **Firebase** (Auth & Realtime Database) for secure, scalable backend
* **TailwindCSS & Bootstrap** for utility-first, responsive styling
* **Turndown** for converting rich-text HTML to Markdown
* **EmailJS** for contact-form integration

---

### 🎥 Screenshots & GIFs

<br>
| Home Page                | Write Blog Editor            | Blog Details              |
| ------------------------ | ---------------------------- | ------------------------- |
| ![](./screenshots/home.gif) | ![](./screenshots/write-blog.png) | ![](./screenshots/blog-details.png) |

*Click to enlarge.*

---

## ✅ Installation & Quick Start

Follow these steps to run Brainiac locally in under 5 minutes.

1. **Clone the repo**

   ```bash
   git clone git@github.com
   cd brainiac
   ```
2. **Install dependencies**

   ```bash
   pnpm install
   ```
3. **Set up environment variables**

   * Duplicate `.env.example` and rename to `.env.local`
   * Populate with your Firebase and EmailJS credentials:

     ```bash
     VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
     VITE_EMAILJS_SERVICE_ID=YOUR_EMAILJS_SERVICE_ID
     VITE_EMAILJS_TEMPLATE_ID=YOUR_EMAILJS_TEMPLATE_ID
     VITE_EMAILJS_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY
     ```
4. **Run the development server**

   ```bash
   pnpm dev
   ```
5. **Open** [http://localhost:3000](http://localhost:3000) to see Brainiac in action.

**Tip:** If ports conflict, adjust `PORT` in `.env.local` or pass `--port` to `npm run dev`.

---

## 🎯 Usage & Key Features

Brainiac is designed to be intuitive, fast, and scalable. Here’s how you (and your users) can make the most of it:

* **Homepage Feed**

  * Latest posts appear in a responsive Masonry grid.
  * Click on any post to dive into full details.
* **Authentication**

  * Email/password sign-up and login flows via Firebase Auth.
  * Email verification and password reset built-in.
* **Rich Blog Editor**

  * WYSIWYG + Markdown support: switch between visual and raw modes.
  * Live preview to catch formatting issues early.
  * Category tags for organization.
* **Simple My Blogs Dashboard**

  * CRUD operations: create new posts or delete articles.
* **Category & Tag Filtering**

  * Navigate to `/category/:name` to see all posts under a given category.
  * Sidebar for quick category jumps.
* **Like, Bookmark & Share System**

  * One-click to bookmark posts for later reading.
  * Heart icon to like posts—real-time like counts.
  * Share in different digital platform
* **Reading History**

  * Automatically tracks and show the posts you viewed with date seperated.
  * Accessible via the “History” button in the header.
* **Protected Routes**

  * Only authenticated users can access `WriteBlog` and `MyBlogs` pages.
  * Global redirect logic sends unauthenticated visitors to `/login`.

---

## 🗂️ 2. Project Structure & Architecture

Dive deep into how Brainiac is organized under the hood.

```bash
brainiac/
├─ .env.local             # Local env variables (ignored by Git)
├─ public/                # Static assets (favicons, manifest)
├─ src/
│  ├─ components/         # Reusable UI components (atoms, molecules)
│  │   ├─ Auth/           # Login, Signup, Account pages
│  │   ├─ Blogs/          # BlogCard, BlogGrid, PopularPosts
│  │   ├─ UX/             # SearchBar, Bookmark, History, Like
│  │   └─ Layout/         # Header, Layout, ScrollToTop
│  ├─ pages/              # Route-backed pages (Home, BlogDetails, WriteBlog)
│  ├─ firebases/           # Integrations (Firebase config, EmailJS, Turndown)
│  ├─ context/            # AuthContext & global state providers
│  ├─ index.css           # Global styles & Tailwind imports
│  └─ main.jsx            # App initialization & Router setup
├─ README.md              # Project overview & docs
├─ vite.config.js         # Vite bundler settings
├─ tailwind.config.cjs    # Tailwind customization
├─ postcss.config.cjs     # PostCSS plugins for Tailwind
└─ package.json           # Project metadata & dependencies
```

### Routing Logic

* **React Router v6** with nested routes in `App.jsx`.
* `<Layout>` wraps all public pages; `<PrivateRoute>` wraps protected ones.
* Example route setup:

  ```js
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="blog/:id" element={<BlogDetails />} />
      <Route path="category/:name" element={<CategoryPage />} />
      <Route
        path="write-blog"
        element={
          <PrivateRoute>
            <WriteBlog />
          </PrivateRoute>
        }
      />
      <Route
        path="my-blogs"
        element={
          <PrivateRoute>
            <MyBlogs />
          </PrivateRoute>
        }
      />
    </Route>
  </Routes>
  ```

### State Management

* **AuthContext** (Context API + `useReducer`) holds user state and auth methods.
* **Local React state** for form inputs, modals, and editor content.
* **Realtime updates** via Firebase SDK’s `onValue` subscriptions.

### Database Schema (Firebase Realtime DB)

```text
/users/{uid}:
  profile: { displayName, email, avatarUrl }
  bookmarks: { postId: true }
  history: [ postId1, postId2, ... ]
/posts/{postId}:
  authorId, title, contentHtml, contentMarkdown, category, createdAt, likes
/categories/{categoryName}:
  postIds: [ ... ]
```

### Env Variables

All variables prefixed with `VITE_` to be exposed to the front end.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

---

## ⚙️ 3. Setup & Deployment Guide

### 🧑‍💻 Local Development

1. Ensure Node.js v16+ & npm v8+ (or `pnpm` v7+).
2. Clone and install:

   ```bash
   git clone ...
   npm install
   ```
3. Copy `.env.example` → `.env.local` and fill keys.
4. Start dev server:

   ```bash
   npm run dev
   ```
5. Development features:

   * **HMR** refreshes only changed modules.
   * **Tailwind JIT** instantly reflects styling changes.

### 🚀 Production Deployment

* **Recommended**: [Vercel](https://vercel.com)

  * Connect GitHub repo, set env vars in dashboard, auto-deploy on push.
* **Alternative**: Firebase Hosting or Netlify

  * `firebase init hosting`, set `build` output folder, deploy with `firebase deploy`.

**Build Command:**

```bash
npm run build
```

**Output Directory:** `dist/`

### CI/CD & Monitoring

* GitHub Actions pipeline runs lint, tests, and builds on PRs.
* Future: integrate Sentry for error tracking and Lighthouse for performance.

---

## 🛠️ 4. Technologies Used & Rationale

| Technology  | Purpose             | Reason for Choice                    |
| ----------- | ------------------- | ------------------------------------ |
| React       | UI library          | Component model & huge ecosystem     |
| Vite        | Build tool          | Blazing build & dev speeds           |
| Firebase    | Backend (Auth & DB) | Zero‑server setup, real‑time sync    |
| TailwindCSS | Styling             | Utility classes, highly customizable |
| Turndown    | Markdown conversion | Lightweight & configurable           |
| EmailJS     | Email integration   | No custom backend needed             |

**Alternatives Considered:** Next.js (SSR), AWS Amplify, Styled-Components.

---

## 🧠 5. Design Decisions & Tradeoffs

* **Context API over Redux:** Lower boilerplate, adequate for small-to-medium apps.
* **Rich-text vs Markdown:** Enabled dual-mode editor; more complex but flexible for writers.
* **No server-side rendering:** Prioritized dev speed—future scope for SSR if SEO demands.
* **Dynamic imports:** Code-splitting for less-used features (ranking, history) to speed cold load.

---

## 🔐 6. Authentication & Authorization Flow

1. **Login & Token Handling:** Firebase manages tokens; refreshes automatically.
2. **Protected Routes:** `PrivateRoute` component checks `AuthContext.user`.
3. **Logout:** Clears Context and in-memory tokens, then redirects to `/login`.

**Security Considerations:**

* Tokens stored in secure HTTP-only cookies by default (Firebase SDK handles this).
* Realtime DB rules allow only owners to write their own posts.

---

## 📤 7. API / Backend Reference

*All interactions via Firebase SDK, no custom REST server.*

* **Fetch Posts:** `onValue(ref(db, '/posts'))`
* **Create Post:** `push(ref(db, '/posts'), postData)`
* **Delete Post:** `remove(ref(db, '/posts/${postId}'))`
* Error handling surfaces user-friendly alerts via `toastify`.

**EmailJS Contact Form**

```js
emailjs.sendForm(
  process.env.VITE_EMAILJS_SERVICE_ID,
  process.env.VITE_EMAILJS_TEMPLATE_ID,
  formRef.current,
  process.env.VITE_EMAILJS_PUBLIC_KEY
)
```

---

## 💾 8. Database / Firestore Design

*(Realtime DB rules enforce user data isolation.)*

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid"
      }
    },
    "posts": {
      ".read": true,
      "$postId": {
        ".write": "auth.uid === data.child('authorId').val()"
      }
    }
  }
}
```

---

## 🧪 9. Testing

* **Vitest** for unit tests: run `npm run test:unit`
* **Playwright** (planned) for end-to-end flows
* Coverage badge in README shows current coverage status

---

## 📲 10. Responsiveness & Accessibility

* **Mobile-first layouts** via Bootstrap breakpoints.
* **ARIA roles** on navigation, dialogs, and form elements.
* **Keyboard navigation** supported on all interactive elements.
* **Contrast checks** ensure WCAG AA compliance.

---

## 🌐 11. Progressive Web App / Meta Features

* **Web Manifest** defines installable app details.
* **Service Worker** caches assets & recent posts for offline use.
* **Custom install prompts** guide users on supported browsers.
* **Open Graph** and **Twitter Card** meta tags for social sharing.

---

## 🧭 12. Known Issues & Roadmap

* [ ] **Dark Mode:** Add user toggle and theme persistence.
* [ ] **Image Uploads:** Integrate Cloudinary or Firebase Storage.
* [ ] **SEO Improvements:** Generate site map; add SSR.
* [ ] **Testing:** End-to-end coverage & performance benchmarks.

---

## 🗣️ 13. Contributing Guidelines

* **Branch Strategy:** `main` (stable), `dev` (active development)
* **Commit Convention:** Use Conventional Commits (e.g., `feat:`, `fix:`).
* **Pull Requests:** Link an issue, include screenshots, add tests.
* **Code of Conduct:** Please read [CODE\_OF\_CONDUCT.md](./CODE_OF_CONDUCT.md).

---

> **Challenges & Problem-Solving Highlights**
> 1️⃣ **Realtime Sync Hiccups**: By default, occasional race conditions caused stale state. I built a custom `useFirebaseSubscription` hook that ensures cleanup and debounced updates, substantially reducing UI jank.
> 2️⃣ **Markdown → HTML Conversion**: Early versions stored only HTML, causing hard-to-edit blobs. Integrating Turndown for round-trip Markdown storage fixed maintainability and allowed version diffs in Git.
> 3️⃣ **Bundle Bloat**: Turndown & EmailJS were inflating initial load. I implemented dynamic imports (`React.lazy`) for editor and contact form modules, cutting initial JS payload by \~30%.
> 4️⃣ **Casing Chaos**: Mixed-case filename imports led to CI failures on Linux runners. I created a Node script (`scripts/rename-pascal.js`) to automate refactoring and enforced naming conventions via lint rules.

> *This README captures both the "how" and the "why"—so future you (or any collaborator) has the full story, not just the code.*
