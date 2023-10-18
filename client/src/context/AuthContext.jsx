import {useState, createContext} from 'react';

// Create a Context
export const authContext = createContext();

// Create a Component wrapper from Context.Provider
export default function AuthProvider(props) {
  // Here is our Shared State Object
  const [user, setUser] = useState({});

  // This list can get long with a lot of functions.  Reducer may be a better choice
  const providerData = { 
    user,
    setUser,
  };

  // We can now use this as a component to wrap anything
  // that needs our state
  return (
    <authContext.Provider value={providerData}>
      {props.children}
    </authContext.Provider>
  );
};