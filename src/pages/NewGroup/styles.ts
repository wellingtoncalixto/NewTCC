import styled from 'styled-components/native';
import { Form as Unform } from '@unform/mobile';
import Input from '../../components/Input';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 30px 30px;
`;

export const ImageContainer = styled.View`
  align-items: center;
  justify-content: center;
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

export const Button = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;

  position: relative;

  top: -40px;
  left: 50px;
  border-radius: 25px;
  background: #355c7d;
`;

export const Form = styled(Unform)`
  width: 100%;
  margin-top: -40px;
`;

export const InputUnform = styled(Input)`
  width: 100%;
`;

export const AddContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const AddText = styled.Text`
  margin-bottom: 15px;

  color: #000;
  font-size: 18px;
`;

export const AddInput = styled.TextInput`
  background: #fff;
  width: 100%;
  border-radius: 10px;
`;

export const AddShowList = styled.ScrollView`
  flex: 1;
  margin-top: 10px;
  width: 100%;
  background: #f2f2f2;
`;
