// the auth party host: signs up, logs in/out, and keeps the user state in check

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import "../firebases/firebase";
import { getDatabase, ref, set } from "firebase/database";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {

  const [loading, setLoading] = useState(true);  // auth in progress
  const [currentUser, setCurrentUser] = useState();

  // listen for login/logout events
  useEffect(( ) => {
   const auth= getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }
  );
    return unsubscribe;
  }, [ ]);


    //  register new user and write to db AKA signup
  async function signup(email, password, username) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);

    // update profile with the username
    await updateProfile(auth.currentUser, {
      displayName: username,
    });

    const user = auth.currentUser;
    setCurrentUser({ ...user });

    // write user data to Realtime Database under "users/{uid}"
    const db = getDatabase();
    set(ref(db, `users/${user.uid}`), {
      displayName: username,
      email: email,
      uid: user.uid,
    });
  }

  // Login function
  function login(email, password) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }
  
// TODO: add Google/Facebook login here to spice things up

  // Logout function
  function logout() {
    const auth = getAuth();
    return signOut(auth);
  }

   // can rename yourself
  async function updateDisplayName(newDisplayName) {
    const auth = getAuth();
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      setCurrentUser({ ...auth.currentUser });

      const db = getDatabase();
      set(ref(db, `users/${auth.currentUser.uid}`), {
        displayName: newDisplayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
      });
    }
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateDisplayName,
  };


  return (
    <AuthContext.Provider value={value}>
      {/* don't show children until auth is ready */}
      { !loading && children }
    </AuthContext.Provider>
  );
}
