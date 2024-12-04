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
    fetch('http://192.168.0.149:5000/api/register', {
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
        if (data.success) {
          Alert.alert('Registro exitoso', `¡Bienvenido, ${nombre} ${apellido_p}!`);
//          navigation.navigate('Login'); // Navega a la pantalla de inicio
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
      <Text style={styles.welcomeText}>Crea una nueva cuenta.</Text>

      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#AAAAAA"
        style={styles.input}
        value={nombre}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Apellido paterno"
        placeholderTextColor="#AAAAAA"
        style={styles.input}
        value={apellido_p}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Apellido materno"
        placeholderTextColor="#AAAAAA"
        style={styles.input}
        value={apellido_m}
        onChangeText={setMiddleName}
      />
      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#AAAAAA"
        style={styles.input}
        keyboardType="email-address"
        value={correo}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#AAAAAA"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.link}>¿Ya estás registrado? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    height: 50,
    borderBottomColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007bff',
  },
});

export default RegisterScreen;