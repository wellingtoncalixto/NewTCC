import styled from 'styled-components/native';
import { darken } from 'polished';

export const CustomButton = styled.TouchableOpacity`
  height: 45px;
  width: 100%;
  background: ${darken(0.15, '#355c7d')};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;
