import React from 'react';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { IActionProps } from 'react-native-floating-action';

export const actions: IActionProps[] = [
  {
    text: 'Sair do Grupo',
    name: 'bt_out_group',
    color: '#355c7d',
    icon: <IconMaterial name="logout" size={25} color="#fff" />,
  },
];
