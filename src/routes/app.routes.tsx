import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/colors';
import Group from '../pages/Group';
import UserChats from '../pages/UserChats';
import Header from '../components/Header';
import NewGroup from '../pages/NewGroup';
import GroupMembers from '../pages/NewGroup/GroupMembers';
import Chat from '../pages/Chat';
import FirstAccess from '../pages/FirstAccess';
import { useAuth } from '../hooks/auth';
import NewUserChat from '../pages/NewUserChat';
import Profile from '../pages/Profile';
import GroupDetails from '../pages/GroupDetails';
import AddNewMembers from '../pages/AddNewMembers';

const AppStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const MyTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: colors.secondary,
        },
        labelStyle: {
          color: '#6c5b7b',
          fontSize: 15,
        },
      }}
    >
      <Tab.Screen
        name="Grupos"
        component={Group}
        options={() => ({
          tabBarIcon: () => <Icon name="group" size={20} color="#355c7d" />,
        })}
      />
      <Tab.Screen
        name="Chats"
        component={UserChats}
        options={() => ({
          tabBarIcon: () => (
            <IconMaterial name="chat" size={20} color="#355c7d" />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  return (
    <>
      <AppStack.Navigator
        screenOptions={{
          cardStyle: { backgroundColor: `${colors.primary}` },
        }}
      >
        {user.userFirstAccess ? (
          <AppStack.Screen
            name="FirstAccess"
            component={FirstAccess}
            options={{
              headerTitle: 'Bem vindo ao NoteFly',
              headerStyle: {
                backgroundColor: colors.primary,
                shadowColor: 'transparent',
                elevation: 0,
              },
              headerTitleStyle: {
                fontWeight: '600',
                fontSize: 30,
                marginTop: 30,
                shadowColor: '#000',
                shadowOpacity: 0.5,
              },
              headerTintColor: '#FFF',
              headerTitleAlign: 'center',
            }}
          />
        ) : (
          <>
            <AppStack.Screen
              name="Dashboard"
              component={MyTabs}
              options={{
                header: () => <Header />,
              }}
            />
            <AppStack.Screen
              name="NewGroup"
              component={NewGroup}
              options={{
                headerTitle: 'Novo Grupo',
              }}
            />
            <AppStack.Screen
              name="GroupMembers"
              component={GroupMembers}
              options={{
                headerTitle: 'Membros do Grupo',
              }}
            />
            <AppStack.Screen
              name="AddNewMembers"
              component={AddNewMembers}
              options={{
                headerTitle: 'Adicionar Membros',
              }}
            />
            <AppStack.Screen
              name="NewChat"
              component={NewUserChat}
              options={{
                title: '',
                headerStyle: {
                  backgroundColor: colors.primary,
                  shadowColor: 'transparent',
                  elevation: 0,
                },
              }}
            />
            <AppStack.Screen
              name="GroupDetails"
              component={GroupDetails}
              options={{
                headerShown: false,
              }}
            />
            <AppStack.Screen name="Chat" component={Chat} />
            <AppStack.Screen name="Profile" component={Profile} />
          </>
        )}
      </AppStack.Navigator>
    </>
  );
};

export default AppRoutes;
