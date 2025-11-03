import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import "./global.css";
import Header from '@/components/Header';

export default function App() {
  return (
 
      <NavigationContainer>
        
          {/* Header stays at top safely within device notch area */}
          <Header />
          <AppNavigator />
         
      </NavigationContainer>
  
  );
}