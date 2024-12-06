import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function TransferConfirmationScreen({ route, navigation }) {
  const { name, amount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transferencia exitosa</Text>
      <Text style={styles.message}>
        Tu transferencia a <Text style={styles.bold}>{name}</Text> por{" "}
        <Text style={styles.bold}>${amount} MXN</Text> se realizó con éxito.
      </Text>
      <Button
        title="Ir a inicio"
        onPress={() => navigation.navigate("HomeScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d2d2d",
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
});