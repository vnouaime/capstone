import React, { useState, useEffect } from 'react'
import { BrowserRouter } from "react-router-dom";
import { decodeToken } from "react-jwt"

import useLocalStorage from "./hooks/useLocalStorage";
import LoadingSpinner from "./common/LoadingSpinner";
import UserContext from "./auth/UserContext";
import FurnifyAPI from './api/FurnifyAPI';

import SearchAccountNavBar from './routes-nav/SearchAccountNavBar';
import CategoriesNavBar from "./routes-nav/CategoriesNavBar";
import Routes from "./routes-nav/Routes";
import Footer from './routes-nav/Footer';

import './App.css'

// Key name for storing token in localStorage
export const TOKEN_STORAGE_ID = "furnify-token"

/** Furnify application.
 *
 * - infoLoaded: user data fetched from FurnifyAPI. Manages loading spinner. 
 *
 * - currentUser: user obj from API. Used to determine whether user is logged in. 
 *   This is passed around via context throughout app.
 *
 * - token: From logged in users. Required to be set for mostt API calls. Initially read from
 *   localStorage and stored through useLocalStorage hook.
 *
 * App -> Routes
 */
function App() {
  const[infoLoaded, setInfoLoaded] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID)

  console.debug(
    "App",
    "infoLoaded=", infoLoaded,
    "currentUser=", currentUser,
    "token=", token,
  );

  // Loads current user data from FurnifyAPI. Only runs if a user is logged in and a token is provided. useEffect is dependent on token changing so if a user logs out, it will re-run. 
  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = decodeToken(token);

          // put the token on the Api class so it can use it to call the API.
          FurnifyAPI.token = token;
          let currentUser = await FurnifyAPI.getCurrentUser(username);
          
          setCurrentUser(currentUser);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true)
    }

    // When info is loading, setInfoLoaded is set to false. False activates the loading spinner. When info has loaded, setInfoLoaded is set to true. 
    setInfoLoaded(false) 
    getCurrentUser();
  }, [token]);

  /** logout 
   * Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  /** signup
   * Handles site-wide signup.
   *
   * Automatically logs them in by setting token upon signup.
   */
  async function signup(signupData) {
    try {
      let token = await FurnifyAPI.signup(signupData);
      setToken(token);

      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /** login
   * Handles site-wide login.
   *
   * Sets token logging user in. 
   */
  async function login(loginData) {
    try {
      let token = await FurnifyAPI.login(loginData);
      setToken(token);

      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider 
          value={{ currentUser, setCurrentUser }}>
        <div className="App">
          <SearchAccountNavBar logout={logout}/>
          {/* <CategoriesNavBar />  */}
          <Routes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
