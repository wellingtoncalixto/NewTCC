import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';
import { Text, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import {
  Container,
  Content,
  ContainerCard,
  TextCard,
  Left,
  Right,
} from './styles';
import { Image } from '../../components/Card/styles';
import { useGroup } from '../../hooks/group';
import { toastError } from '../../utils/toastMessage';
import { useAuth } from '../../hooks/auth';

interface Options {
  id: string;
  name: string;
  avatar: string;
}

export interface SelectedOptions {
  userId: string;
  userEmail: string;
  userAvatarUrl: string;
}

const AddNewMembers: React.FC<StackScreenProps<{}, 'AddNewMembers'>> = ({
  route,
}) => {
  const [filterEmail, setFilterEmail] = useState('');
  const [options, setOptions] = useState<Options[]>([]);
  const [optionsFilter, setOptionsFilter] = useState<Options[]>([]);
  const [selectedItens, setSelectedItens] = useState<SelectedOptions[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const { user: userAuth } = useAuth();
  const { addGroup, addNewMembers } = useGroup();
  const { groupId } = route.params;

  useEffect(() => {
    async function buttonSubmit() {
      navigation.setOptions({
        headerRight: () =>
          loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <TouchableOpacity
              onPress={async () => {
                setLoading(true);
                await addNewMembers(groupId, selectedItens);
                const response = await firestore()
                  .collection('Chats')
                  .doc(groupId)
                  .get();
                navigation.navigate('GroupDetails', { chat: response.data() });
              }}
              style={{ marginRight: 20 }}
            >
              <Text>Concluir</Text>
            </TouchableOpacity>
          ),
      });
    }
    buttonSubmit();
  }, [addGroup, groupId, navigation, selectedItens, loading]);

  useEffect(() => {
    async function findUsers() {
      const { _docs: docs } = await firestore().collection('Users').get();
      const array: Options[] = [];
      docs.map((doc: any) => {
        if (doc.data().userId !== userAuth.userId) {
          const user = {
            id: doc.data().userId,
            name: doc.data().userEmail,
            avatar: doc.data().userAvatarUrl,
          };
          array.push(user);
        }
      });
      setOptions(array);
    }
    findUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newOptions: Options[] = [];
    if (filterEmail) {
      options.map(option => {
        const response = option.name.indexOf(filterEmail.toLowerCase()) > -1;
        if (response) {
          newOptions.push(option);
        }
      });
      setOptionsFilter(newOptions);
    } else {
      setOptionsFilter([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterEmail]);

  const addMember = useCallback(async (item: Options) => {
    const response = await firestore().collection('Chats').doc(groupId).get();
    const exist = await response
      .data()
      ?.chatMembers.filter(filter => filter === item.id);
    if (item.id === userAuth.userId) {
      return toastError('Você já esta no grupo');
    }

    if (exist.length === 0) {
      selectedItens.push({
        userId: item.id,
        userEmail: item.name,
        userAvatarUrl: item.avatar,
      });

      setOptionsFilter([]);
      setFilterEmail('');
    } else {
      return toastError('Esse usuario já esta no grupo');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeMember = useCallback((item: SelectedOptions) => {
    setSelectedItens(
      selectedItens.filter(teste => teste.userEmail !== item.userEmail),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <SearchableDropdown
        containerStyle={{
          padding: 10,
          position: 'absolute',
          zIndex: 1,
          width: '100%',
        }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          borderRadius: 5,
          bordeColor: 'none',
        }}
        itemTextStyle={{ color: '#222' }}
        itemsContainerStyle={{
          width: '100%',
          backgroundColor: '#fff',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          position: 'relative',
          top: -10,
        }}
        items={optionsFilter}
        resetValue={false}
        textInputProps={{
          placeholder: 'placeholder',
          underlineColorAndroid: 'transparent',
          style: {
            padding: 12,
            borderRadius: 5,
            backgroundColor: '#fff',
            width: '100%',
          },
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
        onTextChange={(value: string) => setFilterEmail(value)}
        onItemSelect={(item: Options) => addMember(item)}
      />
      <Content>
        {selectedItens.map(item => (
          <ContainerCard key={item.userEmail}>
            <Left>
              <Image
                source={{
                  uri: `${item.userAvatarUrl}`,
                }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <TextCard>{item.userEmail}</TextCard>
            </Left>
            <Right>
              <Icon
                name="trash"
                color="#F67280"
                size={20}
                onPress={() => removeMember(item)}
              />
            </Right>
          </ContainerCard>
        ))}
      </Content>
    </Container>
  );
};

export default AddNewMembers;
