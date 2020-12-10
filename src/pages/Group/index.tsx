import React, { useEffect, useState } from 'react';
import { FloatingAction } from 'react-native-floating-action';
import { useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../hooks/auth';
import { Container, CardsContainer } from './styles';
import Card from '../../components/Card';
import { actions } from '../../utils/floatingActions';

const Group: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [groups, setGroups] = useState<Array<any>>();

  useEffect(() => {
    async function getGroups() {
      const ref = firestore().collection('Chats');
      await ref
        .where('chatType', '==', 'group')
        .where('chatMembers', 'array-contains', user.userId)
        .onSnapshot(async response => {
          if (response !== null) {
            response.docs.sort((a, b) => {
              return (
                b.data().lastUpdate.toDate() - a.data().lastUpdate.toDate()
              );
            });
            setGroups(response.docs);
          }
        });
    }
    getGroups();
  }, []);

  return (
    <Container>
      <CardsContainer>
        {groups !== undefined &&
          groups.length !== 0 &&
          groups.map(
            (group: any) =>
              group.data().chatType === 'group' && (
                <Card chat={group.data()} key={group.data().chatId} />
              ),
          )}
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

export default Group;
