import styled from 'styled-components/native';

export const Container = styled.View`
  background: #fff;
  height: auto;
  padding: 10px 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const AvatarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 5px;
`;

export const NameContainer = styled.View`
  margin-left: 10px;
  height: 100%;
  justify-content: flex-start;
`;

export const IconsContainer = styled.View`
  flex: 1%;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: row;
`;

export const NameText = styled.Text`
  margin-top: -15px;
  font-size: 20px;
  font-weight: bold;
`;

export const SearchContainer = styled.TouchableOpacity`
  margin-top: 15px;
  height: 50px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  width: 90%;
  height: auto;
`;

export const InfoIcon = styled.View`
  flex: 1;
  margin-right: 10px;
  align-items: flex-end;
`;
