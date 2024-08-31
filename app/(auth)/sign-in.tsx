import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext } from 'react';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });

  const { email, password } = form;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.welcomeText}>Welcome Back!</Text>
      <Text style={styles.subText}>
        Enter your email address and password to get access to your account.
      </Text>

      <View style={styles.inputContainer}>
        <AntDesign name="mail" size={20} color="#fff" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <EvilIcons name="lock" size={20} color="#fff" />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry={false}
        />
        <AntDesign name="eye" size={20} color="#ccc" />
      </View>

      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotText}>Forgot?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => login(email, password)}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => router.push('/sign-up')}
      >
        <Text style={styles.createAccountText}>
          Don't have an account?{' '}
          <Text style={styles.createAccountLink}>Create account</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0e23',
    padding: 20,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1d36',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    marginLeft: 10,
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: '#ccc',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#5f40f7',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createAccountButton: {
    alignSelf: 'center',
  },
  createAccountText: {
    color: '#ccc',
  },
  createAccountLink: {
    color: '#5f40f7',
    fontWeight: 'bold',
  },
});
