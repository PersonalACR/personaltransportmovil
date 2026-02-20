import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import ForgotPassword from "../screens/ForgotPassword";

const Stack = createNativeStackNavigator();

const AuthScreens = ({ setIsLogued }) => {
  useEffect(() => {}, []);
  return (
    <Stack.Navigator initialRouteName={"Login"}>
      <Stack.Screen
        name="Login"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <Login {...props} setIsLogued={setIsLogued} />}
      </Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthScreens;
