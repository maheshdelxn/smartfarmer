// navigation/AppNavigator.jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../src/screens/Home/HomeScreen';
import CropScreen from '../src/screens/Crop/CropScreen';
import ProfileScreen from '../src/screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Crop" component={CropScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}