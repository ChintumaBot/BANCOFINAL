import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [nombre, setFirstName] = useState('');
  const [apellido_p, setLastName] = useState('');
  const [apellido_m, setMiddleName] = useState('');
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!nombre || !apellido_p || !apellido_m || !correo || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // Registro en el backend
    fetch('http://192.168.1.108:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre,
        apellido_p,
        apellido_m,
        correo,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.user) {
          Alert.alert('Registro exitoso', `¡Bienvenido/a, ${nombre}!`);
          navigation.navigate('HomeScreen', { user: data.user });
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Hubo un problema con el registro');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>

      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#666666"
        style={styles.input}
        value={nombre}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Apellido paterno"
        placeholderTextColor="#666666"
        style={styles.input}
        value={apellido_p}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Apellido materno"
        placeholderTextColor="#666666"
        style={styles.input}
        value={apellido_m}
        onChangeText={setMiddleName}
      />
      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#666666"
        style={styles.input}
        keyboardType="email-address"
        value={correo}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#666666"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#0033A0',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#0033A0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#0033A0',
  },
  button: {
    backgroundColor: '#0033A0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#0033A0',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;