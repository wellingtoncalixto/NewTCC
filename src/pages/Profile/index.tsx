import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Platform, Alert, ActivityIndicator } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FloatingAction } from 'react-native-floating-action';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { FormHandles } from '@unform/core';
import * as yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import { actions } from '../../utils/floatingActionsProfile';
import {
  Image,
  ImageContainer,
  ButtonAddPhoto,
  EmptyImage,
  FormContainer,
  TextLabelEmail,
  TextLabelTitle,
  TextUserName,
  ButtonEditName,
  ButtonConfirm,
  TextLogin,
  Container,
  ContainerPasswordChange,
  ButtonConfirmName,
  ButtonCancelName,
  ConteinarButtons,
} from './styles';
import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import getValidationErros from '../../utils/getValidationErros';
import { useUser } from '../../hooks/user';

const Profile: React.FC = () => {
  const { user, setData, signOut } = useAuth();
  const { updateUser } = useUser();
  const formRefName = useRef<FormHandles>(null);
  const formRefPassword = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  // Labels
  const NameLabel = useState('Nome');
  const ChangePassLabel = useState('Alterar Senha');
  const LabelConfChange = useState('Trocar senha');

  // ChangeName vars and functions
  const [inputVisible, setInputVisible] = useState(false);
  // PhotoAdd
  const [imageUri, setImageUri] = useState<string>('');

  const onPressConfirmUserName = useCallback(async (data: any) => {
    formRefName.current?.setErrors({});
    try {
      const schema = yup.object().shape({
        firstName: yup.string().required('Por favor insira seu nome'),
        lastName: yup.string().required('Por favor insira seu sobrenome'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
      await updateUser({ lastName: data.lastName, firstName: data.firstName });

      setData({
        ...user,
        userFirstName: data.firstName,
        userLastName: data.lastName,
        userName: `${data.firstName} ${data.lastName}`,
      });

      await AsyncStorage.setItem(
        '@notefly:user',
        JSON.stringify({
          ...user,
          userFirstName: data.firstName,
          userLastName: data.lastName,
          userName: `${data.firstName} ${data.lastName}`,
        }),
      );

      setInputVisible(false);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErros(err);
        formRefName.current?.setErrors(errors);
      }
    }
  }, []);

  const onPressEditUserName = useCallback(() => {
    formRefName.current?.setErrors({});
    setInputVisible(true);
  }, []);

  // PassWordChange
  const onPressConfirmPassWordChange = useCallback(async (data: any) => {
    formRefPassword.current?.setErrors({});
    try {
      const schema = yup.object().shape({
        oldPassword: yup.string().required('Por favor insira sua senha atual'),
        newPassword: yup
          .string()
          .min(6)
          .when('oldPassword', (oldPassword: string, schemaNew: any) =>
            oldPassword
              ? schemaNew.required('Por favor, digite sua nova senha')
              : schemaNew,
          ),
        confirmPassword: yup
          .string()
          .when('newPassword', (newPassword: string, schemaConfirm: any) =>
            newPassword
              ? schemaConfirm.required('Por favor confirme sua nova senha')
              : schemaConfirm,
          )
          .oneOf([yup.ref('newPassword')], 'As senhas não são iguais'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const response = await updateUser({
        oldPassword: data.oldPassword,
        password: data.newPassword,
      });
      if (!response) {
        formRefPassword.current?.reset();
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErros(err);
        formRefPassword.current?.setErrors(errors);
      }
    }
  }, []);

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

  useEffect(() => {
    async function updateAvatar() {
      if (imageUri) {
        setLoading(true);
        await updateUser({ avatar: imageUri });

        await firestore()
          .collection('Users')
          .doc(user.userId)
          .get()
          .then(response => {
            user.userAvatar = response.data()?.userAvatarUrl;
          });
        setLoading(false);
      }
    }
    updateAvatar();
  }, [imageUri]);
  return (
    <>
      <Container>
        <ImageContainer>
          {!loading ? (
            <>
              <Image source={{ uri: user.userAvatar }} />
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

        <FormContainer ref={formRefName} onSubmit={onPressConfirmUserName}>
          <TextLabelTitle>{NameLabel}</TextLabelTitle>

          {!inputVisible ? (
            <>
              <TextUserName onPress={() => onPressEditUserName()}>
                {`${user.userFirstName} ${user.userLastName}`}
              </TextUserName>
              <ButtonEditName onPress={() => onPressEditUserName()}>
                <Icon name="edit" size={25} color="#fff" />
              </ButtonEditName>
            </>
          ) : (
            <>
              <Input
                name="firstName"
                label="Primeiro Nome"
                defaultValue={user.userFirstName}
              />
              <Input
                name="lastName"
                label="Sobrenome"
                defaultValue={user.userLastName}
              />
              <ConteinarButtons>
                <ButtonCancelName onPress={() => setInputVisible(false)}>
                  <TextLogin>Cancelar</TextLogin>
                </ButtonCancelName>
                <ButtonConfirmName
                  onPress={() => formRefName.current?.submitForm()}
                >
                  <TextLogin>Confirmar</TextLogin>
                </ButtonConfirmName>
              </ConteinarButtons>
            </>
          )}
        </FormContainer>
        <FormContainer
          ref={formRefPassword}
          onSubmit={onPressConfirmPassWordChange}
        >
          <ContainerPasswordChange>
            <TextLabelTitle>{ChangePassLabel}</TextLabelTitle>

            <Input
              name="oldPassword"
              label="Digite a senha atual"
              secureTextEntry
            />

            <Input
              name="newPassword"
              label="Digite sua nova senha"
              secureTextEntry
            />

            <Input
              name="confirmPassword"
              label="Confirme sua nova senha"
              secureTextEntry
            />

            <ButtonConfirm
              onPress={() => formRefPassword.current?.submitForm()}
            >
              <TextLogin>{LabelConfChange}</TextLogin>
            </ButtonConfirm>
          </ContainerPasswordChange>
        </FormContainer>
      </Container>

      <FloatingAction
        color="#355c7d"
        actions={actions}
        floatingIcon={
          <Icon name="table-rows" style={{ fontSize: 25, color: '#ffffff' }} />
        }
        onPressItem={name => {
          if (name === 'btn_logout') {
            signOut();
          }
        }}
        onClose={() => {}}
        onOpen={() => {}}
      />
    </>
  );
};

export default Profile;
