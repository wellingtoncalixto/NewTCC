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
import { Image } from '../../../components/Card/styles';
import { useGroup } from '../../../hooks/group';

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

const GroupMembers: React.FC<StackScreenProps<{}, 'GroupMembers'>> = ({
  route,
}) => {
  const [filterEmail, setFilterEmail] = useState('');
  const [options, setOptions] = useState<Options[]>([]);
  const [optionsFilter, setOptionsFilter] = useState<Options[]>([]);
  const [selectedItens, setSelectedItens] = useState<SelectedOptions[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const { addGroup } = useGroup();
  const { groupAvatar, groupName } = route.params;

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
                await addGroup(
                  groupName as string,
                  groupAvatar as string,
                  selectedItens,
                );
                navigation.navigate('Dashboard');
              }}
              style={{ marginRight: 20 }}
            >
              <Text>Concluir</Text>
            </TouchableOpacity>
          ),
      });
    }
    buttonSubmit();
  }, [addGroup, groupName, groupAvatar, navigation, selectedItens, loading]);

  useEffect(() => {
    async function findUsers() {
      const { _docs: docs } = await firestore().collection('Users').get();
      const array: Options[] = [];
      docs.map((doc: any) => {
        const user = {
          id: doc.data().userId,
          name: doc.data().userEmail,
          avatar: doc.data().userAvatarUrl,
        };
        array.push(user);
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
    selectedItens.push({
      userId: item.id,
      userEmail: item.name,
      userAvatarUrl: item.avatar,
    });

    setOptionsFilter([]);
    setFilterEmail('');
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

export default GroupMembers;
