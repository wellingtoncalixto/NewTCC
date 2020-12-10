import styled from 'styled-components/native';
import { Form as Unform } from '@unform/mobile';

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`;

export const Text = styled.Text`
  margin-top: 15px;
  font-size: 20px;
  font-family: Roboto Slab;
  flex-wrap: wrap;
  text-align: center;
  color: #fff;
`;

export const Form = styled(Unform)`
  margin-top: 10px;

  width: 100%;
`;

export const TextLogin = styled.Text`
  font-size: 36px;
  color: #fff;
  justify-content: center;
  align-items: center;
`;

export const ContainerButtons = styled.View`
  margin-top: 30px;
  width: 100%;
`;
export const ButtonCadastrar = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 20px;
  flex-direction: row;
`;

export const TextCadastrar = styled.Text`
  font-size: 15px;
  color: #343640;
`;

export const TextTitle = styled.Text`
  font-size: 30px;
  color: #fff;
  font-family: Roboto Slab;
  font-weight: 700;
`;
