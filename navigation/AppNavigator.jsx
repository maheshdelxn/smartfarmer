// navigation/AppNavigator.jsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons"; // ✅ Icons

import HomeScreen from "../src/screens/Home/HomeScreen";
import CropDetailsScreen from "../src/screens/Home/add_crop"
import CropScreen from "../src/screens/Crop/CropScreen";
import ProfileScreen from "../src/screens/Profile/ProfileScreen";

const HomeStack = createStackNavigator();
const CropStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Stack for Home tab
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Crop Details" component={CropDetailsScreen}/>
    </HomeStack.Navigator>
  );
}

// Stack for Crop tab
function CropStackScreen() {
  return (
    <CropStack.Navigator screenOptions={{ headerShown: false }}>
      <CropStack.Screen name="CropMain" component={CropScreen} />
    </CropStack.Navigator>
  );
}

// Stack for Profile tab
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // ✅ Increase height & style of bottom tab bar
        tabBarStyle: {
          height: 75,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb", // Tailwind gray-200
        },

        // ✅ Label styling
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 5,
        },

        // ✅ Icons setup
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Crop") iconName = focused ? "leaf" : "leaf-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={28} color={color} />;
        },

        tabBarActiveTintColor: "#16a34a", // Tailwind green-600
        tabBarInactiveTintColor: "#6b7280", // gray-500
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Crop" component={CropStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}
