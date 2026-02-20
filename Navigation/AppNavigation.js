import { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import { HomePasenger } from "../screens";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Profile from "../screens/Profile";
import HomeDriverPrivate from "../screens/HomeDriverPrivate";
import Header from "../components/Header";

const Tab = createBottomTabNavigator();

const AppNavigation = ({ isHome, setIsLogued }) => {

  useEffect(() => {}, []);
  
  return (
    <Tab.Navigator>
      {isHome ? <Tab.Screen
        name="Home"
        component={HomeDriverPrivate}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: () => <Entypo name="home" color="#666666" size={26} />,
        }}
      /> :
      <Tab.Screen
        name="Viajes"
        component={HomeDriverPrivate}
        options={{
          header: () => <Header />,
          tabBarLabel: "Viajes",
          tabBarIcon: () => (
            <FontAwesome5 name="bus" size={26} color="#666666" />
          ),
        }}
      />}
      <Tab.Screen
        name="Profile"
        options={{
          header: () => <Header />,
          tabBarLabel: "Perfil",
          tabBarIcon: () => <Entypo name="user" color="#666666" size={26} />,
        }}
      >
        {(props) => <Profile {...props} setIsLogued={setIsLogued} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default AppNavigation;
