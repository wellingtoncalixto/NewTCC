import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Platform, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FormHandles } from '@unform/core';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  ImageContainer,
  EmptyImage,
  Image,
  ButtonAddPhoto,
  Form,
  InputUnform,
  WelcomeText,
  TextConfirm,
} from './styles';
import getValidationErros from '../../utils/getValidationErros';
import { useUser } from '../../hooks/user';
import { FirstUpdadeData } from '../../utils/interfaces';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

const FirstAccess: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { firstUpdate } = useUser();
  const { signOut } = useAuth();
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleSubmit = useCallback(
    async (data: FirstUpdadeData) => {
      setLoading(true);
      formRef.current?.setErrors({});
      try {
        const schema = yup.object().shape({
          firstName: yup
            .string()
            .required('Por favor insira seu primeiro nome'),
          lastName: yup.string().required('Por Favor insira seu ultimo nome'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
        await firstUpdate({ avatar: imageUri, ...data });
        navigation.navigate('Dashboard');
        setLoading(false);
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
        }
        setLoading(false);
      }
    },
    [firstUpdate, imageUri],
  );

  return (
    <Container>
      <WelcomeText>
        Escolha uma foto para seu perfir e digite seu nome e sobrenome
      </WelcomeText>
      <ImageContainer>
        {imageUri ? (
          <Image source={{ uri: imageUri }} />
        ) : (
          <EmptyImage>
            <Icon name="photo" size={50} color="#fff" />
          </EmptyImage>
        )}
        <ButtonAddPhoto onPress={pickImage}>
          <Icon name="add-a-photo" size={25} color="#fff" />
        </ButtonAddPhoto>
      </ImageContainer>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <InputUnform name="firstName" placeholder="Primeiro Nome" />
        <InputUnform name="lastName" placeholder="Ultimo Nome" />
        <Button onPress={() => formRef.current?.submitForm()}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFF" />
          ) : (
            <TextConfirm>Confirmar</TextConfirm>
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default FirstAccess;
