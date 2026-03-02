import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import AppNavigation from "./Navigation/AppNavigation";
import AuthScreens from "./Navigation/AuthScreens";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://8bc37b30355fd9008157bdd8a758b235@o4510916669800448.ingest.us.sentry.io/4510973228941312',
  sendDefaultPii: true,
  enableLogs: true,
  debug: true, 
  enableNative: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function App() {
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
});