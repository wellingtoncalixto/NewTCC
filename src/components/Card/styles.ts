import styled from 'styled-components/native';
import { lighten } from 'polished';
import { colors } from '../../utils/colors';

export const Container = styled.TouchableOpacity`
  width: 100%;
  height: 100px;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background: #fff;
  border-radius: 15px;
  margin-bottom: 5px;
`;

export const Image = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;

export const Content = styled.View`
  margin-left: 10px;
`;

export const TextNameGroup = styled.Text`
  font-weight: 600;
  font-size: 18px;
`;

interface TextLastMessage {
  new: boolean;
}

export const TextLastMessage = styled.Text<TextLastMessage>`
  margin-top: 5px;
  width: 200px;
  color: ${props =>
    props.new ? `${colors.primary}` : `${lighten(0.2, '#000')}`};
`;

export const NumberOfMessages = styled.View`
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
  justify-content: center;
  align-items: center;

  background: ${colors.primary};
  position: absolute;
  right: 20px;
`;

export const NumberOfMessagesText = styled.Text`
  color: #fff;
`;

export const LineVertical = styled.View``;
