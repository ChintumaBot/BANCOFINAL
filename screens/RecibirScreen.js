import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const RecibirScreen = ({ route }) => {
  const { user } = route.params;

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Recibir dinero es fácil y rápido</Text>

      <View style={styles.qrContainer}>
        <QRCode
          value={JSON.stringify({
            idUsuario: user.id,
            nombre: user.nombre,
          })}
          size={200}
          color="black"
          backgroundColor="white"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  qrContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
});

export default RecibirScreen;