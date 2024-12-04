import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Comienza a gestionar tu dinero de manera rápida y segura.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007bff',
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
});

export default WelcomeScreen;