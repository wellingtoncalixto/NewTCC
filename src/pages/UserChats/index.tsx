import React, { useEffect, useState } from 'react';
import { FloatingAction } from 'react-native-floating-action';
import { useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { useAuth } from '../../hooks/auth';
import { Container, CardsContainer } from './styles';
import Card from '../../components/Card';
import { actions } from '../../utils/floatingActions';
import { IChat } from '../../utils/interfaces';

const UserChats: React.FC = () => {
  const navigation = useNavigation();
  const userId = auth().currentUser?.uid;
  const [chats, setChats] = useState<IChat[]>([]);

  useEffect(() => {
    firestore()
      .collection('Chats')
      .where('chatMembers', 'array-contains', userId)
      .onSnapshot(async response => {
        if (response !== null) {
          if (response.docs.length !== 0) {
            const filter = response.docs.filter(
              fil => fil.data().chatType === 'chat',
            );

            await filter.sort((a, b) => {
              return (
                b.data().lastUpdate.toDate() - a.data().lastUpdate.toDate()
              );
            });

            return setChats(filter);
          }
          setChats([]);
        }
      });
  }, []);

  return (
    <Container>
      <CardsContainer>
        {chats !== undefined &&
          chats.length !== 0 &&
          chats.map((chat: IChat) => (
            <Card chat={chat.data()} key={chat.data().chatId} />
          ))}
      </CardsContainer>
      <FloatingAction
        color="#355c7d"
        actions={actions}
        onPressItem={name => {
          if (name === 'bt_new_group') {
            navigation.navigate('NewGroup');
          }
          if (name === 'bt_new_chat') {
            navigation.navigate('NewChat');
          }
        }}
        onClose={() => {}}
        onOpen={() => {}}
      />
    </Container>
  );
};

export default UserChats;
