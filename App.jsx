// App.jsx
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AppNavigator from "./navigation/AppNavigator";
import Header from "./src/components/Header";
import "./global.css";

export default function App() {
  return (
 
      <NavigationContainer>
        
          {/* Header stays at top safely within device notch area */}
          <Header />
          <AppNavigator />
         
      </NavigationContainer>
  
  );
}
