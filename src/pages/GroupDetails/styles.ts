import styled from 'styled-components/native';
import { Form as Unform } from '@unform/mobile';

export const Container = styled.ScrollView`
  padding: 0 20px;
  top: -25px;
  height: 100%;
`;

export const Header = styled.View`
  margin-top: 40px;
  height: auto;
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

  color: #5d6366;

  position: relative;
  top: 30px;
`;

export const TextLabelTitle = styled.Text`
  display: flex;
  margin-bottom: 10px;
  font-size: 24px;
  text-align: center;
  color: #5d6366;
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
  color: #5d6366;
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

export const ButtonConfirm = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 15px;

  height: 50px;
  width: 100%;

  background: #355c7d;
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
export const ButtonConfirmName = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40%;
  height: 100%;
  border-radius: 8px;
  background: green;
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

export const ContainerInfo = styled.SafeAreaView`
  flex-direction: column;
  top: -50px;
`;

export const ButtonSwitchMembers = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
  height: 50px;
  position: relative;
`;

export const TextInfoTitle = styled.Text`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 90%;
  padding-top: 10px;
  padding-left: 10px;

  font-size: 20px;
`;

export const ContainerMembers = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

export const TextUserNameMember = styled.Text`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  padding-left: 10px;
`;

export const TextMemberName = styled.Text`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40px;

  border-bottom-width: 1px;
  border-color: #ffffff;

  margin-top: 35px;
`;

export const ImageUser = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 75px;
  margin-top: 10px;
  margin-left: 10px;
`;

export const ContTest = styled.View`
  width: 100%;
`;

export const List = styled.FlatList`
  height: auto;
`;

export const Actions = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
`;
