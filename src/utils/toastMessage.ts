import Toast from 'react-native-tiny-toast';

export const toastError = (msg: string) =>
  Toast.show(msg, {
    position: -100,
    containerStyle: {
      backgroundColor: '#f00',
      borderRadius: 15,
    },
    textStyle: {
      color: '#fff',
    },
    imgStyle: {},
    mask: false,
    maskStyle: {},
    duration: 4000,
    animation: true,
  });

export const toastSuccess = (msg: string) =>
  Toast.show(msg, {
    position: -100,
    containerStyle: {
      backgroundColor: '#0f0',
      borderRadius: 15,
    },
    textStyle: {
      color: '#fff',
    },
    imgStyle: {},
    mask: false,
    maskStyle: {},
    duration: 4000,
    animation: true,
  });
