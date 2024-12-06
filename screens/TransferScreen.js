import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function TransferScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);

    try {
      const parsedData = JSON.parse(data);
      setQrData(parsedData);
    } catch (error) {
      setErrorMessage(true);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para la cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No se ha concedido permiso para usar la cámara.</Text>;
  }

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            El QR que escaneaste no es válido.
          </Text>
          <Button
            title="Volver a intentar"
            onPress={() => {
              setErrorMessage(false);
              setScanned(false);
            }}
          />
        </View>
      ) : qrData ? (
        <Text style={styles.info}>Nombre: {qrData.nombre} | ID de cuenta en la base de datos: {qrData.idUsuario}</Text>
      ) : (
        <>
          <Text style={styles.title}>Escanea el código QR</Text>
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
            <Button
              title="Volver a intentar"
              onPress={() => setScanned(false)} 
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: "#cccccc",
    marginBottom: 10,
  },
  scanner: {
    height: 300,
    width: 300,
    marginBottom: 20,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff6666",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});