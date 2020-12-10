import React from 'react';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { IActionProps } from 'react-native-floating-action';

export const actions: IActionProps[] = [
  {
    text: 'New Group',
    name: 'bt_new_group',
    color: '#355c7d',
    icon: <IconMaterial name="group-add" size={25} color="#fff" />,
  },
  {
    text: 'New Chat',
    name: 'bt_new_chat',
    color: '#355c7d',
    icon: <IconMaterial name="chat" size={23} color="#fff" />,
  },
];
