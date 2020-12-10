import React, { useState, useCallback, useRef, useEffect } from 'react';

import firestore from '@react-native-firebase/firestore';

import { FormHandles } from '@unform/core';
import { Text, Image } from 'react-native';
import Toast from 'react-native-tiny-toast';
import * as yup from 'yup';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Step1, Step2, Form, Step2Text } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { AuthState } from '../../utils/interfaces';
import { toastError } from '../../utils/toastMessage';
import getValidationErros from '../../utils/getValidationErros';
import { useGroup } from '../../hooks/group';

const NewUserChat: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const [error, setError] = useState<string>('');
  const [userFilter, setUserFilter] = useState({});
  const [step, setStep] = useState<number>(1);
  const { addChatUser } = useGroup();

  useEffect(() => {
    step === 2 && navigation.setOptions({});
  }, [step, navigation]);

  const findUser = useCallback(async data => {
    formRef.current?.setErrors({});
    try {
      const schema = yup.object().shape({
        emailFilter: yup
          .string()
          .email()
          .required('Por favor insira um e-mail valido'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { docs } = await firestore()
        .collection('Users')
        .where('userEmail', '==', `${data.emailFilter.toLowerCase()}`)
        .get();

      if (docs.length !== 0) {
        setUserFilter(docs[0].data());
        setStep(2);
      } else toastError('Nenhum Usuario encontrado com esse email');
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
      }
    }
  }, []);

  return (
    <>
      {step === 1 && (
        <>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              marginTop: 50,
              marginBottom: 20,
            }}
          >
            Digite o email do usuario que deseja iniciar uma conversa
          </Text>
          <Step1>
            {!!error && <Text>{error}</Text>}
            <Form ref={formRef} onSubmit={findUser}>
              <Input name="emailFilter" placeholder="Digite o email" />
              <Button onPress={() => formRef.current?.submitForm()}>
                <Text>Avançar</Text>
              </Button>
            </Form>
          </Step1>
        </>
      )}
      {step === 2 && (
        <Step2>
          <Image
            source={{ uri: userFilter.userAvatarUrl }}
            style={{ width: 150, height: 150, borderRadius: 75 }}
          />
          <Step2Text>{`Deseja iniciar uma conversa com ${userFilter.userEmail}`}</Step2Text>
          <Button
            onPress={async () => {
              const chat = await addChatUser(userFilter.userId);
              navigation.navigate('Chat', { chat });
            }}
          >
            <Text>Confirmar</Text>
          </Button>
        </Step2>
      )}
    </>
  );
};

export default NewUserChat;
