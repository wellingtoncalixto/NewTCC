import React from 'react';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { IActionProps } from 'react-native-floating-action';

export const actions: IActionProps[] = [
  {
    text: 'Adicionar Membro',
    name: 'btn_add_member',
    color: '#355c7d',
    icon: <IconMaterial name="group-add" size={23} color="#fff" />,
  },
  {
    text: 'Sair do Grupo',
    name: 'bt_out_group',
    color: '#355c7d',
    icon: <IconMaterial name="logout" size={25} color="#fff" />,
  },
  {
    text: 'Excluir Grupo',
    name: 'btn_delete_group',
    color: '#355c7d',
    icon: <IconMaterial name="delete" size={23} color="#fff" />,
  },
];
