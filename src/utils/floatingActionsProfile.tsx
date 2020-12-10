import React from 'react';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { IActionProps } from 'react-native-floating-action';

export const actions: IActionProps[] = [
  {
    text: 'Log out',
    name: 'btn_logout',
    color: '#355c7d',
    icon: <IconMaterial name="logout" size={23} color="#fff" />,
  },
];
