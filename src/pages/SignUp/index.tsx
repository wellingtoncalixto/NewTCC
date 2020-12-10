import React, { useRef, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { FormHandles } from '@unform/core';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Form,
  ButtonCadastrar,
  TextCadastrar,
  ContainerButtons,
  TextLogin,
  TextTitle,
} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import getValidationErros from '../../utils/getValidationErros';
import { Image } from '../../components/Card/styles';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (data: any) => {
      setLoading(true);
      try {
        const schema = yup.object().shape({
          email: yup
            .string()
            .email()
            .required('Por favor insira um e-mail valido'),
          password: yup
            .string()
            .min(6)
            .required('Por favor insira uma senha valida'),
          confirmPassword: yup
            .string()
            .required()
            .oneOf([yup.ref('password')], 'Passwords must match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
        await signUp(data.email, data.password);

        navigation.navigate('FirstAccess');
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
        }
        setLoading(false);
      }
    },
    [navigation, signUp],
  );

  return (
    <Container>
      <Image
        style={{ width: 100, height: 100 }}
        source={require('../../assets/logo.png')}
      />
      <TextTitle>Notefly</TextTitle>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input name="email" placeholder="Email" />
        <Input name="password" placeholder="Senha" secureTextEntry />
        <Input
          name="confirmPassword"
          placeholder="Confirme sua senha"
          secureTextEntry
        />
      </Form>
      <ContainerButtons>
        <Button onPress={() => formRef.current?.submitForm()}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFF" />
          ) : (
            <TextLogin>Cadastrar</TextLogin>
          )}
        </Button>
        <ButtonCadastrar onPress={() => navigation.navigate('SignIn')}>
          <Icon name="arrow-left" size={20} />
          <TextCadastrar>Já possui uma conta ? Faça login!</TextCadastrar>
        </ButtonCadastrar>
      </ContainerButtons>
    </Container>
  );
};

export default SignUp;
