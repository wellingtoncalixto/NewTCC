import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './routes';
import AuthProvider from './hooks/auth';
import GroupProvider from './hooks/group';
import UserProvider from './hooks/user';
import { colors } from './utils/colors';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <UserProvider>
          <GroupProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={`${colors.primary}`}
            />
            <View style={{ flex: 1, backgroundColor: `${colors.primary}` }}>
              <Routes />
            </View>
          </GroupProvider>
        </UserProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
