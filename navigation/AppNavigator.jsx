import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Import all your screens
import HomeScreen from "../src/screens/Home/HomeScreen";
import CropScreen from "../src/screens/Crop/CropScreen";
import ProfileScreen from "../src/screens/Profile/ProfileScreen";
import ProfileViewScreen from "../src/screens/Profile/ProfileViewScreen";
import HelpSupportScreen from "../src/screens/Profile/HelpSupportScreen"; // Add this import
import AboutScreen from "../src/screens/Profile/AboutScreen";
import LoginScreen from "../src/screens/auth/LoginScreen";
import OTPVerificationScreen from "../src/screens/auth/OTPVerificationScreen";
import FarmerRegistrationScreen from "../src/screens/auth/FarmerRegistrationScreen";

// Create stack navigators for each tab
const HomeStack = createStackNavigator();
const CropStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for Home tab
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
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

// Stack for Profile tab - Updated to include ProfileViewScreen and HelpSupportScreen
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="ProfileView" component={ProfileViewScreen} />
      <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <ProfileStack.Screen name="About" component={AboutScreen} />
    </ProfileStack.Navigator>
  );
}

// Function to get tab bar visibility based on current route
const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'ProfileMain';
  
  // Hide tab bar for these screens
  if (routeName === 'ProfileView' || routeName === 'HelpSupport'  || routeName === 'About') {
    return false;
  }
  
  return true;
};

// Main Tab Navigator (Protected Routes)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 75,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 5,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Crop") iconName = focused ? "leaf" : "leaf-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#6b7280",
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Crop" component={CropStackScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackScreen}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route) ? 'flex' : 'none',
            height: 75,
            paddingTop: 8,
            paddingBottom: 10,
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
          },
        })}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator (Handles Auth + Main App)
export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="FarmerRegistration" component={FarmerRegistrationScreen} />
      
      {/* Main App (Protected) */}
      <Stack.Screen 
        name="MainApp" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}