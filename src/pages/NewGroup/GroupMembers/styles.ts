import styled from 'styled-components/native';

export const Container = styled.View``;

export const Content = styled.ScrollView`
  margin: 80px 10px;
  margin-bottom: 0;
`;

export const ContainerCard = styled.View`
  background: #fff;
  margin-bottom: 5px;
  height: 65px;
  padding: 10px;

  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TextCard = styled.Text`
  margin-left: 15px;

  font-size: 15px;
  font-weight: bold;
`;

export const Left = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Right = styled.View``;
