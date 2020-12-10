import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Platform, Alert, ActivityIndicator, View } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFeather from 'react-native-vector-icons/Feather';

import { FormHandles } from '@unform/core';
import * as yup from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { actions } from '../../utils/floatingActionsGroup';
import { actions as actionsAdmin } from '../../utils/floatingActionsGroupAdmin';

import {
  Image,
  ImageContainer,
  ButtonAddPhoto,
  EmptyImage,
  FormContainer,
  TextLabelTitle,
  TextUserName,
  ButtonEditName,
  TextLogin,
  Container,
  ButtonConfirmName,
  ButtonCancelName,
  ConteinarButtons,
  ContainerInfo,
  TextInfoTitle,
  ButtonSwitchMembers,
  ContainerMembers,
  ImageUser,
  TextUserNameMember,
  List,
  Header,
  Actions,
} from './styles';
import Input from '../../components/Input';
import getValidationErros from '../../utils/getValidationErros';
import { useGroup } from '../../hooks/group';
import { useAuth } from '../../hooks/auth';
import { toastError } from '../../utils/toastMessage';

interface UserInfo {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userAvatarUrl: string;
}
const GroupDetail: React.FC = ({ route }) => {
  const { chat } = route.params;
  const { user } = useAuth();
  const {
    updateGroup,
    removeMemberGroup,
    deleteGroup,
    addChatUser,
  } = useGroup();
  const formRefName = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const [groupInfo, setGroupInfo] = useState();
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  // Labels
  const GroupMembersLabel = useState('Membros do Grupo');

  // ChangeName vars and functions
  const [inputVisible, setInputVisible] = useState<boolean>(false);

  // PhotoAdd
  const [imageUri, setImageUri] = useState<string>('');

  const [membersVisible, setMembersVisible] = useState(true);
  const [switchArrowGM, setSwitchArrowGM] = useState(true);

  async function userMemberInfo(memberId: string) {
    const response = await firestore().collection('Users').doc(memberId).get();
    const userInfo: UserInfo = {
      userId: response.data()?.userId,
      userFirstName: response.data()?.userFirstName,
      userLastName: response.data()?.userLastName,
      userEmail: response.data()?.userEmail,
      userAvatarUrl: response.data()?.userAvatarUrl,
    };
    return userInfo;
  }

  useEffect(() => {
    setImageUri('');
    async function getGroupInfo() {
      await firestore()
        .collection('Chats')
        .doc(chat.chatId)
        .onSnapshot(async response => {
          const array: UserInfo[] = [];
          const promisse = response
            .data()
            ?.chatMembers.map(async (memberId: string) => {
              const responseUser = await userMemberInfo(memberId);
              array.push(responseUser);
            });
          await Promise.all(promisse);
          setGroupInfo({ ...response.data(), chatMembers: array });
          setLoadingPage(false);
        });
    }
    getGroupInfo();
  }, []);

  useEffect(() => {
    async function updateAvatar() {
      if (imageUri) {
        setLoading(true);
        await updateGroup({ chatId: chat.chatId, chatAvatar: imageUri });

        await firestore()
          .collection('Chats')
          .doc(chat.chatId)
          .get()
          .then(response => {
            chat.chatAvatarUrl = response.data().chatAvatarUrl;
          });
        setLoading(false);
      }
    }
    updateAvatar();
  }, [imageUri]);

  async function handleChatWithUser(id) {
    const chatData = await addChatUser(id);

    if (chatData !== null) {
      navigation.navigate('Chat', { chat: chatData });
    } else {
      toastError('Erro ao iniciar a conversa, por favor tente novamente ');
    }
  }

  const onPressEditUserName = useCallback(async data => {
    formRefName.current?.setErrors({});
    try {
      const schema = yup.object().shape({
        groupName: yup.string().required('Por favor insira seu nome'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
      await updateGroup({ chatId: chat.chatId, chatName: data.groupName });
      chat.chatName = data.groupName;
      setInputVisible(false);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErros(err);
        formRefName.current?.setErrors(errors);
      }
    }
  }, []);

  // AddPhoto Functions

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Sorry, we need camera roll permissions to make this work!',
          );
        }
      }
    })();
  }, []);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  }, []);

  // Alimentar a lista com os membros futuramente, seguindo esse layout
  const renderItem = ({ item }) => {
    return (
      <>
        <ContainerMembers>
          <ImageUser source={{ uri: item.userAvatarUrl }} />
          <TextUserNameMember>{`${item.userFirstName} ${item.userLastName}`}</TextUserNameMember>
          <Actions>
            {user.userId !== item.userId && (
              <>
                <TouchableOpacity
                  onPress={async () => {
                    handleChatWithUser(item.userId);
                  }}
                >
                  <Icon name="chat" size={25} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      '',
                      'Certeza que deseja remover esse usuario do grupo?',
                      [
                        {
                          text: 'Não',
                          style: 'cancel',
                        },
                        {
                          text: 'Sim',
                          onPress: () =>
                            removeMemberGroup(item.userId, chat.chatId),
                        },
                      ],
                    )
                  }
                >
                  <IconFeather
                    name="trash"
                    size={25}
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              </>
            )}
          </Actions>
        </ContainerMembers>
      </>
    );
  };

  return (
    <>
      {loadingPage ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size={50} color="#000" />
        </View>
      ) : (
        <>
          <Container>
            <Header>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <IconFeather name="arrow-left" size={30} />
              </TouchableOpacity>
            </Header>
            <ImageContainer>
              {!loading ? (
                <>
                  <Image source={{ uri: chat.chatAvatarUrl }} />
                </>
              ) : (
                <>
                  <EmptyImage>
                    <ActivityIndicator size={50} color="#000" />
                  </EmptyImage>
                </>
              )}
              <ButtonAddPhoto onPress={pickImage}>
                <Icon name="edit" size={25} color="#fff" />
              </ButtonAddPhoto>
            </ImageContainer>
            <ContainerInfo>
              <FormContainer ref={formRefName} onSubmit={onPressEditUserName}>
                {!inputVisible ? (
                  <>
                    <TextUserName onPress={() => setInputVisible(true)}>
                      {chat.chatName}
                    </TextUserName>
                    <ButtonEditName onPress={() => setInputVisible(true)}>
                      <Icon name="edit" size={25} color="#fff" />
                    </ButtonEditName>
                  </>
                ) : (
                  <>
                    <Input
                      name="groupName"
                      label="Nome do Grupo"
                      defaultValue={chat.chatName}
                    />
                    <ConteinarButtons>
                      <ButtonConfirmName
                        onPress={() => formRefName.current?.submitForm()}
                      >
                        <TextLogin>Confirmar</TextLogin>
                      </ButtonConfirmName>
                      <ButtonCancelName onPress={() => setInputVisible(false)}>
                        <TextLogin>Cancelar</TextLogin>
                      </ButtonCancelName>
                    </ConteinarButtons>
                  </>
                )}
              </FormContainer>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderColor: '#ffff',
                }}
              >
                <TextInfoTitle>{GroupMembersLabel}</TextInfoTitle>
                {switchArrowGM ? (
                  <ButtonSwitchMembers
                    onPress={() => {
                      setSwitchArrowGM(false);
                      setMembersVisible(false);
                    }}
                  >
                    <Icon name="arrow-drop-down" size={40} color="#000" />
                  </ButtonSwitchMembers>
                ) : (
                  <ButtonSwitchMembers
                    onPress={() => {
                      setSwitchArrowGM(true);
                      setMembersVisible(true);
                    }}
                  >
                    <Icon name="arrow-drop-up" size={40} color="#000" />
                  </ButtonSwitchMembers>
                )}
              </View>
              {membersVisible ? (
                <SafeAreaView>
                  <List
                    data={groupInfo.chatMembers}
                    renderItem={renderItem}
                    keyExtractor={(item: any) => item.userId}
                  />
                </SafeAreaView>
              ) : (
                <></>
              )}
            </ContainerInfo>
          </Container>

          <FloatingAction
            color="#355c7d"
            actions={
              chat.chatAdmin === auth().currentUser?.uid
                ? actionsAdmin
                : actions
            }
            floatingIcon={
              <Icon
                name="table-rows"
                style={{ fontSize: 25, color: '#ffffff' }}
              />
            }
            onPressItem={async name => {
              if (name === 'btn_add_member') {
                navigation.navigate('AddNewMembers', { groupId: chat.chatId });
              }
              if (name === 'bt_out_group') {
                if (
                  groupInfo.chatAdmin === user.userId &&
                  groupInfo.chatMembers.length !== 1
                ) {
                  return Alert.alert(
                    'Info!',
                    'Como você é o administrador do grupo vc precisa deletar o grupo para sair ',
                  );
                }
                if (
                  groupInfo.chatAdmin === user.userId &&
                  groupInfo.chatMembers.lenght === 1
                ) {
                  await deleteGroup(chat.chatId);
                  return navigation.navigate('Dashboard');
                }
                removeMemberGroup(user.userId, chat.chatId);
                navigation.navigate('Dashboard');
              }
              if (name === 'btn_delete_group') {
                await deleteGroup(chat.chatId);
                navigation.navigate('Dashboard');
              }
            }}
            onClose={() => {}}
            onOpen={() => {}}
          />
        </>
      )}
    </>
  );
};

export default GroupDetail;
