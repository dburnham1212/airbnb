import {useState, createContext, useEffect} from 'react';
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';

// Create a Context
export const authContext = createContext();

// Create a Component wrapper from Context.Provider
export default function AuthProvider(props) {
  // Shared states
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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
        setUser(decodedToken);
      }
    }
  }, [])

  // Function used to set a token
  const setToken = (userData) => {
    localStorage.setItem("token", userData.token);
  }

  // Function used to clear a token
  const clearToken = () => {
    localStorage.removeItem("token");
  }

  // Logout function to clear token, set user object to null, and navigate to the login page
  const onLogout = () => {
    clearToken();
    setUser(null);
    navigate("/login")
  }

  const handleJWTErrors = (error) => {
    error.graphQLErrors.map((err) => {
      if(err.extensions.code === "JWT_ERROR") {
        setUser(null)
        clearToken();
        navigate('/login')
      }
    });
  }
  
  // Provider data
  const providerData = { 
    user,
    setUser,
    setToken,
    clearToken,
    onLogout,
    handleJWTErrors
  };

  // Wrapper
  return (
    <authContext.Provider value={providerData}>
      {props.children}
    </authContext.Provider>
  );
};