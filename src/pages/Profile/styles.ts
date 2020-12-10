import styled from 'styled-components/native';
import { Form as Unform } from '@unform/mobile';
import Button from '../../components/Button';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 0 20px;
  margin-bottom: 20px;
`;

export const ImageContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 25px;
`;

export const Image = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
`;

export const EmptyImage = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;

  border-radius: 75px;
  background: #c6c6c6;
`;

export const ButtonAddPhoto = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 50px;
  width: 50px;

  position: relative;

  top: -60px;
  left: 50px;
  border-radius: 25px;
  background: #355c7d;
`;

export const FormContainer = styled(Unform)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const TextLabelEmail = styled.Text`
  display: flex;
  align-items: center;
  justify-content: center;

  color: #000;

  position: relative;
  top: 30px;
`;

export const TextLabelTitle = styled.Text`
  display: flex;
  margin-bottom: 10px;
  font-size: 24px;
  text-align: center;
  color: #000;
`;

export const TextUserName = styled.Text`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;

  border-bottom-width: 1px;
  border-color: #ffffff;
`;

export const TextLabelSubTitle = styled.Text`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  color: #000;
`;

export const TextLogin = styled.Text`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: bold;

  color: #ffffff;
`;

export const ButtonEditName = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;

  position: relative;

  top: -50px;
  left: 150px;
  margin-bottom: -20px;
`;

export const TextInputUserName = styled.TextInput`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;

  border-bottom-width: 1px;
  border-color: #ffffff;
`;

export const TextInputPasswordConfirm = styled.TextInput`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;

  border-bottom-width: 1px;
  border-color: #ffffff;
`;

export const TextInputPasswordNew = styled.TextInput`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;

  border-bottom-width: 1px;
  border-color: #ffffff;
`;

export const ButtonConfirm = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 15px;

  height: 50px;
  width: 100%;

  border-radius: 15px;
  margin-bottom: 15px;
`;

export const ContainerPasswordChange = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
`;

export const ConteinarButtons = styled.View`
  display: flex;
  flex-direction: row;
  height: 40px;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 10px;
`;
export const ButtonConfirmName = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40%;
  height: 100%;
  border-radius: 8px;
`;
export const ButtonCancelName = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40%;
  height: 100%;
  border-radius: 8px;
  background: red;
`;
