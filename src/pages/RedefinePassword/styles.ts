import styled from 'styled-components/native';
import { Form as Unform } from '@unform/mobile';

export const Form = styled(Unform)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin-top: -100px;
`;

export const ArrowContainer = styled.TouchableOpacity`
  padding: 30px 20px;
`;

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 25px;
`;

export const TextSend = styled.Text`
  color: #fff;
  font-size: 20px;
`;

export const TextForm = styled.Text`
  font-size: 20px;
`;

export const TextConfirmation = styled.Text`
  text-align: center;
  font-size: 20px;
`;

export const TextBackButton = styled.Text`
  margin-top: 20px;
  text-decoration: underline;
  font-size: 15px;
`;
