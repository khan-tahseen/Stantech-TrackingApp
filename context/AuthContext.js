import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsloading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async (email, password) => {
    setIsloading(true);
    const response = await axios.post(`http://localhost:3000/login`, {
      email,
      password,
    });
    console.log('userToken: ', userToken);

    if (response.data.token) {
      setUserToken(response.data.token);
      AsyncStorage.setItem('userToken', userToken);
      Alert.alert('Success', 'Login Successfully');
      router.push('/(page)/home');
    } else {
      Alert.alert('Error', 'Error registering user'); 
    }
  };

  const logout = () => {
    setIsloading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    router.replace('/(auth)/sign-in')
    setIsloading(false);
  };

  useEffect(() => {
    isLoggedIn();
  });

  const isLoggedIn = async () => {
    try {
      setIsloading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
      }
      setIsloading(false);
    } catch (error) {
      console.log('error isLoggedIn: ', error);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
