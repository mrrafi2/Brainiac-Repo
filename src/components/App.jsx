import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation,matchPath } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./layout";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Write from "./pages/write";
import Singup from "./pages/singup";
import Login from "./pages/login";
import PrivateRoute from "./private";
import BlogDetails from "./pages/BlogDetails";
import CategoryPage from "./pages/categoyPage";
import PrivacyPolicy from "./pages/privacy";
import TermsAndConditions from "./pages/termCond";
import MyBlogs from "./pages/myBlogs";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import BloggerDetail from "./pages/blogerDetail";
import Trending from "./pages/tranding";
import History from "./history";
import Bookmarks from "./bookmark";
import Liked from "./liked";
import Rankings from "./pages/ranking";
import HelpFAQ from "./help";
import ScrollToTop from "./scrollToTop";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop/>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  const noLayoutPaths = ["/singup", "/login", "/write", "/blogger/:username","/privacy","/term","/blog/:id",  "/bookmarks", "/liked", "/ranking","/contact"];

  const shouldUseLayout = !noLayoutPaths.some((path) =>
    matchPath(path, location.pathname)
  );

  return (
    <>
      {shouldUseLayout ? (
        <Layout>
          <TransitionGroup>
            <CSSTransition
              key={location.key}
              timeout={500} 
              classNames="fade"
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<HelpFAQ />} />


                {/* Protected Routes */}
                

                <Route
                  path="/category/:categoryName"
                  element={
                    <PrivateRoute>
                      <CategoryPage />
                    </PrivateRoute>
                  }
                />

             <Route
                  path="/trending"
                  element={
                    <PrivateRoute>
                      <Trending />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/myblogs"
                  element={
                    <PrivateRoute>
                      <MyBlogs />
                    </PrivateRoute>
                  }
                />

               <Route
                  path="/history"
                  element={
                    <PrivateRoute>
                      <History />
                    </PrivateRoute>
                  }
                />



              </Routes>
            </CSSTransition>
          </TransitionGroup>
        </Layout>
      ) : (
        <Routes location={location}>

          <Route path="/write" element={<Write />} />

             <Route
                  path="/contact"
                  element={
                    <PrivateRoute>
                      <Contact />
                    </PrivateRoute>
                  }
                />

          <Route
                  path="/blog/:id"
                  element={
                    <PrivateRoute>
                      <BlogDetails />
                    </PrivateRoute>
                  }
                />

             <Route
                  path="/blogger/:username"
                  element={<BloggerDetail/>}
                />



      
                <Route
                  path="/bookmarks"
                  element={
                    <PrivateRoute>
                      <Bookmarks/>
                    </PrivateRoute>
                  }
                /> 

                <Route
                  path="/liked"
                  element={
                    <PrivateRoute>
                      <Liked/>
                    </PrivateRoute>
                  }
                /> 

                 <Route
                  path="/ranking"
                  element={
                    <PrivateRoute>
                      <Rankings/>
                    </PrivateRoute>
                  }
                />   

          <Route
            path="/singup"
            element={          
                <Singup />
            }
          />

          <Route
            path="/login"
            element={
                <Login />
            }
          />

        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/term" element={<TermsAndConditions />} />
        </Routes>

      )}
    </>
  );
};

export default App;
