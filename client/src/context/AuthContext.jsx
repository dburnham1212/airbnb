import {useState, createContext, useEffect} from 'react';
import jwtDecode from 'jwt-decode'

// Create a Context
export const authContext = createContext();


// Create a Component wrapper from Context.Provider
export default function AuthProvider(props) {
  // Here is our Shared State Object
  const [user, setUser] = useState({});
  
  useEffect(() => {
    if(localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
  
      if(decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token")
      } else {
        setUser(decodedToken);
        console.log(decodedToken)
      }
      
    }
  }, [])

  const setToken = (userData) => {
    localStorage.setItem("token", userData.token);
  }

  const clearToken = () => {
    localStorage.removeItem("token");
  }
  
  // This list can get long with a lot of functions.  Reducer may be a better choice
  const providerData = { 
    user,
    setUser,
    setToken,
    clearToken
  };

  // We can now use this as a component to wrap anything
  // that needs our state
  return (
    <authContext.Provider value={providerData}>
      {props.children}
    </authContext.Provider>
  );
};