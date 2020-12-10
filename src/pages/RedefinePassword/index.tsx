import React, { useRef, useCallback, useState } from 'react';
import { FormHandles } from '@unform/core';
import auth from '@react-native-firebase/auth';
import * as yup from 'yup';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input';
import {
  Form,
  Container,
  TextForm,
  TextConfirmation,
  TextBackButton,
  TextSend,
  ArrowContainer,
} from './styles';
import { toastError } from '../../utils/toastMessage';
import getValidationErros from '../../utils/getValidationErros';
import Button from '../../components/Button';

const RedefinePassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [step, setStep] = useState(false);
  const navigation = useNavigation();
  const handleSubmit = useCallback(async data => {
    formRef.current?.setErrors({});
    try {
      const schema = yup.object().shape({
        email: yup
          .string()
          .email()
          .required('Por favor insira um e-mail valido'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      auth()
        .sendPasswordResetEmail(data.email)
        .then(() => {
          setStep(true);
        })
        .catch(() => {
          toastError('Usuario não encontrado');
        });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
      }
    }
  }, []);
  return (
    <>
      {!step ? (
        <>
          <ArrowContainer onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} />
          </ArrowContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <TextForm>Digite seu email cadastrado</TextForm>
            <Input name="email" placeholder="E-mail" />
            <Button onPress={() => formRef.current?.submitForm()}>
              <TextSend>Enviar</TextSend>
            </Button>
          </Form>
        </>
      ) : (
        <Container>
          <TextConfirmation>
            Email enviado com sucesso. Se não encontrar o email por favor
            verificar sua caixa de spam
          </TextConfirmation>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <TextBackButton>Voltar para o login</TextBackButton>
          </TouchableOpacity>
        </Container>
      )}
    </>
  );
};

export default RedefinePassword;
