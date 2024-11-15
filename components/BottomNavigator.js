import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyledCycle } from 'fluent-styles';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MIcon from "react-native-vector-icons/MaterialIcons";
import Start from "../screens/Start";
import Orders from "../screens/Orders";
import Settings from "../screens/Settings";
import { useAppContext } from "./hooks/AppContext";
import Login from "../screens/Login";
import { theme } from "../util/theme";
import SearchSeller from "../screens/SearchSeller";
import EditProfile from "../screens/EditProfile";

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { token } = useAppContext()

  const tabBarPlatformStyle = Platform.select({
    ios: {
      shadowColor: theme.colors.gray[1],
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
    },
    android: {
      elevation: 5,
    },
  });

  const tabBarItemStyle = Platform.select({
    ios: {
      paddingVertical: 8
    },
    android: {

    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          marginHorizontal: 20,
          left: 20,
          right: 20,
          backgroundColor: theme.colors.gray[100],
          borderRadius: 30,
          height: 60,
          ...tabBarPlatformStyle
        },
        tabBarItemStyle: {
          ...tabBarItemStyle,
          pointerEvents: 'auto'
        }

      }}
    >
      <Tab.Screen name='Home' component={Start} options={{
        tabBarIcon: ({ focused }) => {
          return (
            <Icon focused={focused} size={24} color={focused ? theme.colors.green[600] : theme.colors.gray[300]} name= {focused ? "home" : "home-outline"} />
          )
        }
      }} />

      <Tab.Screen name='Orders' component={token ? Orders : Login} options={{
        tabBarIcon: ({ focused }) => {
          return (
            <Icon focused={focused} size={24} color={focused ? theme.colors.green[600] : theme.colors.gray[300]} name={focused ? "shopping" : "shopping-outline"} />
          )
        }
      }} />

      <Tab.Screen name='searchSeller' component={SearchSeller} options={{
        tabBarIcon: ({ focused }) => {
          return (
            <StyledCycle marginTop={-25} height={60} width={60} borderWidth={3} borderColor={theme.colors.gray[50]} backgroundColor={focused ? theme.colors.green[600] : theme.colors.yellow[500]} >
              <MIcon focused={focused} size={24} color={focused ? theme.colors.green[600] : theme.colors.gray[1]} name={'search'} />
            </StyledCycle>
          )
        }
      }} />

      <Tab.Screen name='edit-profile' component={token ? EditProfile : Login} options={{
        tabBarIcon: ({ focused }) => {
          return (
            <Icon focused={focused} size={24} color={focused ? theme.colors.green[600] : theme.colors.gray[300]} name={"account-circle"} />
          )
        }
      }} />

      <Tab.Screen name='Settings' component={Settings} options={{
        tabBarIcon: ({ focused }) => {
          return (
            <MIcon focused={focused} size={24} color={focused ? theme.colors.green[600] : theme.colors.gray[300]} name='settings' />
          )
        }
      }} />
    </Tab.Navigator>
  );
}
