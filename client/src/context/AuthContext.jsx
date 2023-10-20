import {useState, createContext, useEffect} from 'react';
import jwtDecode from 'jwt-decode'

// Create a Context
export const authContext = createContext();


// Create a Component wrapper from Context.Provider
export default function AuthProvider(props) {
  // Shared states
  const [user, setUser] = useState(null);

  useEffect(() => {
    if(localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      
      // if the token has expired
      if (decodedToken.exp * 1000 < Date.now()) {
        // make sure that the user is set to null 
        setUser(null);
        // remove the token from storage
        localStorage.removeItem("token");
        
      } else {
        // Set the user to the decoded token
        setUser(decodedToken);
      }
      
    } else {
      // Make sure the user is removed
      setUser(null);
    }
  }, [])

  const setToken = (userData) => {
    localStorage.setItem("token", userData.token);
  }

  const clearToken = () => {
    localStorage.removeItem("token");
  }
  
  // Provider data
  const providerData = { 
    user,
    setUser,
    setToken,
    clearToken
  };

  // Wrapper
  return (
    <authContext.Provider value={providerData}>
      {props.children}
    </authContext.Provider>
  );
};