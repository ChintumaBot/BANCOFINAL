import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TextInput, Alert, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function TransferScreen({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("");

  const { user } = route.params;

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

  const handleTransfer = () => {
    if (!monto || parseFloat(monto) <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido.");
      return;
    }

    if (!concepto) {
      Alert.alert("Error", "Por favor ingresa un concepto.");
      return;
    }

    fetch("http://192.168.0.149:5000/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromUserId: user.id,
        toUserId: qrData.idUsuario,
        amount: parseFloat(monto),
        concepto,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigation.navigate("TransferConfirmationScreen", {
            recipientName: qrData.nombre,
            amount: monto,
            user: user,
          });
        } else {
          Alert.alert("Error", data.message || "Error en la transferencia.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", "Error de conexión al realizar la transferencia.");
      });
  };

  const handleCancel = () => {
    navigation.goBack();
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
        <View style={styles.formContainer}>
          <Text style={styles.title}>Transferencia para {qrData.nombre}</Text>

          <Text style={styles.label}>Monto</Text>
          <TextInput
            style={styles.amountInput}
            value={monto}
            onChangeText={setMonto}
            placeholder="0 MXN"
            placeholderTextColor="#AAAAAA"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Concepto</Text>
          <TextInput
            style={styles.conceptInput}
            value={concepto}
            onChangeText={setConcepto}
            placeholder="Ingresa el concepto"
            placeholderTextColor="#AAAAAA"
            maxLength={40}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.roundButton} onPress={handleTransfer}>
              <Text style={styles.buttonText}>Transferir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
              color="#1E88E5"
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
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 30,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    padding: 30,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 8,
    fontWeight: "600",
  },
  amountInput: {
    height: 50,
    borderColor: "#1E88E5",
    borderBottomWidth: 2,
    color: "#ffffff",
    fontSize: 24,
    marginBottom: 20,
    paddingLeft: 10,
  },
  conceptInput: {
    height: 50,
    borderColor: "#1E88E5",
    borderBottomWidth: 2,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 30,
    paddingLeft: 10,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  roundButton: {
    backgroundColor: "#1E88E5",
    width: 160,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#d32f2f",
    width: 160,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});