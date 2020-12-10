import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Platform, Alert, Button as ReactButton } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import {
  Container,
  ImageContainer,
  EmptyImage,
  Image,
  Button,
  Form,
  InputUnform,
} from './styles';
import getValidationErros from '../../utils/getValidationErros';

const NewGroup: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const navigation = useNavigation();

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
    (data: any) => {
      async function validation() {
        formRef.current?.setErrors({});
        try {
          const schema = yup.object().shape({
            groupName: yup
              .string()
              .required('Por Favor insira um nome para o grupo'),
          });
          await schema.validate(data, {
            abortEarly: false,
          });

          navigation.navigate('GroupMembers', {
            groupName: data.groupName,
            groupAvatar: imageUri,
          });
        } catch (err) {
          if (err instanceof yup.ValidationError) {
            const errors = getValidationErros(err);
            formRef.current?.setErrors(errors);
          }
        }
      }
      validation();
    },
    [imageUri, navigation],
  );

  return (
    <Container>
      <>
        <ImageContainer>
          {imageUri ? (
            <Image source={{ uri: imageUri }} />
          ) : (
            <EmptyImage>
              <Icon name="photo" size={50} color="#fff" />
            </EmptyImage>
          )}
          <Button onPress={pickImage}>
            <Icon name="add-a-photo" size={25} color="#fff" />
          </Button>
        </ImageContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <InputUnform name="groupName" placeholder="Nome do grupo" />
        </Form>
        <ReactButton
          title="Avançar"
          onPress={() => formRef?.current?.submitForm()}
        />
      </>
    </Container>
  );
};

export default NewGroup;
