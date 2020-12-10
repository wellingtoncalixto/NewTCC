import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { CustomButton } from './styles';

const Button: React.FC<TouchableOpacityProps> = ({ children, ...rest }) => {
  return <CustomButton {...rest}>{children}</CustomButton>;
};

export default Button;
