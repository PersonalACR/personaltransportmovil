import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import AppNavigation from "./Navigation/AppNavigation";
import AuthScreens from "./Navigation/AuthScreens";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPasenger, setIsPasenger] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  const checkLoggedInStatus = async () => {
    const user = await AsyncStorage.getItem("user");
    const userLogued = JSON.parse(user);
    
    setIsPrivate(userLogued.companyType);
    if (userLogued !== null) {
      setIsLoggedIn(true);
      if (userLogued.role == "Pasenger") {
        setIsPasenger(true);
      } else {
        setIsPasenger(false);
      }
    }
  };

  useEffect(() => {
    checkLoggedInStatus();
  }, [isLoggedIn, isPasenger]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppNavigation
          isHome={isPasenger}
          setIsLogued={setIsLoggedIn}
          isPrivate={isPrivate}
        />
      ) : (
        <AuthScreens setIsLogued={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
}
