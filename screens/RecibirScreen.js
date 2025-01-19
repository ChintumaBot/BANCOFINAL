import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente principal de la pantalla de recibir transferencia
const RecibirScreen = ({ route, navigation }) => {
  const { user } = route.params; // Obtiene el usuario de los parámetros de la ruta
  const [hasPermission, setHasPermission] = useState(null); // Estado para el permiso de la cámara
  const [scanned, setScanned] = useState(false); // Estado para saber si el código QR ha sido escaneado
  const [transferencia, setTransferencia] = useState(null); // Estado para almacenar los datos de la transferencia
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  // Solicita permisos para la cámara al montar el componente
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  // Maneja el evento de escaneo del código de barras
  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);

    try {
      const parsedData = JSON.parse(data); // Intenta parsear los datos del código QR
      setTransferencia(parsedData);
      handleConfirmTransfer(parsedData); // Llama a la función para confirmar la transferencia
    } catch (error) {
      Alert.alert("Error", "El QR que escaneaste no es válido.");
      setScanned(false);
    }
  };

  // Maneja la confirmación de la transferencia
  const handleConfirmTransfer = (data) => {
    fetch("http://192.168.1.108:5000/api/transferencia/recibir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toUserId: user.id,
        ...data,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSaldo((prevSaldo) => prevSaldo + data.amount); // Actualiza el saldo del usuario
          Alert.alert("Éxito", "Transferencia recibida exitosamente.");
        } else {
          Alert.alert("Error", data.message || "Error en la transferencia.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", "Error de conexión al recibir la transferencia.");
      });
  };

  // Muestra un mensaje mientras se solicita el permiso para la cámara
  if (hasPermission === null) {
    return <Text>Solicitando permiso para la cámara...</Text>;
  }

  // Muestra un mensaje si no se ha concedido el permiso para la cámara
  if (hasPermission === false) {
    return <Text>No se ha concedido permiso para usar la cámara.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanea el código QR para recibir la transferencia</Text>
      {!scanned && (
        <CameraView
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={styles.scanner}
        />
      )}
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)}>
          <Text style={styles.retryText}>Volver a intentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 30,
    textAlign: "center",
  },
  scanner: {
    height: 300,
    width: 300,
    marginBottom: 20,
  },
  retryText: {
    color: "#1E88E5",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default RecibirScreen;