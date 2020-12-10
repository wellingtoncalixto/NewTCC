import styled from 'styled-components/native';
import { TextInput as Input } from 'react-native-gesture-handler';
import { colors } from '../../utils/colors';

interface ErrorProps {
  error: boolean;
}

export const Container = styled.View`
  width: 100%;
  margin-bottom: 10px;
`;

export const Label = styled.Text<ErrorProps>`
  font-family: Roboto Slab;
  color: ${props => (props.error ? 'red' : `${colors.secondary}`)};
  margin-left: 2px;
  font-size: 15px;
  margin-bottom: 5px;
`;

export const InputContainer = styled.View<ErrorProps>`
  background: white;
  height: 45px;
  border-radius: 10px;

  border: ${props => (props.error ? '1px solid red' : '1px solid transparent')};
`;

export const TextInput = styled(Input)``;

export const ErrorText = styled.Text`
  color: red;
`;
