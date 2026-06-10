import { useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [userInfo, setUserInformation] = useState(null);

  const setUserInfo = (value: any) => {
    setUserInformation(value);
    console.log("value", value);
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
