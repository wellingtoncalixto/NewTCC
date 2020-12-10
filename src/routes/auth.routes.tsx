import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import RedefinePassword from '../pages/RedefinePassword';
import { colors } from '../utils/colors';

const Auth = createStackNavigator();
const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: `${colors.primary}` },
    }}
  >
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
    <Auth.Screen name="RedefinePassword" component={RedefinePassword} />
  </Auth.Navigator>
);

export default AuthRoutes;
