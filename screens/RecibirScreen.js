import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const RecibirScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [saldo, setSaldo] = useState(user.saldo);
  const [transferencia, setTransferencia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      console.error("No se proporcionó un usuario válido.");
      setLoading(false);
      return;
    }

    const obtenerTransferencia = async () => {
      try {
        const response = await fetch('http://172.17.182.104:5000/api/transferencia/verificar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();
        if (data.success) {
          setTransferencia(data.transferencia);
        } else {
          setTransferencia(null);
        }
      } catch (error) {
        setTransferencia(null);
      } finally {
        setLoading(false);
      }
    };
    obtenerTransferencia();

    const interval = setInterval(obtenerTransferencia, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const actualizarEstadoTransferencia = async (transferenciaId) => {
    try {
      const response = await fetch('http://172.17.182.104:5000/api/transferencia/actualizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transferenciaId,
          estado: 'completada',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTransferencia((prev) => ({
          ...prev,
          estado: 'completada',
        }));
        navigation.navigate('HomeScreen', { user: { ...user, saldo } })
      } else {
        console.error('No se pudo actualizar el estado de la transferencia');
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!transferencia && <Text style={styles.message}>Recibir dinero es fácil y rápido</Text>}

      {transferencia ? (
        <View style={styles.transferenciaContainer}>
          <Icon name="money" size={60} color="#4CAF50" style={styles.icon} />
          <Text style={styles.transferenciaTitle}>¡Transferencia recibida!</Text>
          <Text style={styles.transferenciaText}>{`De: ${transferencia.remitente}`}</Text>
          <Text style={styles.transferenciaText}>{`Monto: $${transferencia.monto} MXN`}</Text>
          <Text style={styles.transferenciaText}>{`Concepto: ${transferencia.concepto}`}</Text>
          <Text style={[styles.transferenciaText, styles.fecha]}>
            {new Date(transferencia.fecha).toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
            })}
          </Text>

          {transferencia.estado === 'pendiente' && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => actualizarEstadoTransferencia(transferencia.id)}
            >
              <Text style={styles.confirmButtonText}>Confirmar recepción</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={styles.transferenciaText}>
          {loading ? "Cargando información..." : ""}
        </Text>
      )}

      {!transferencia && user && user.id && user.nombre && (
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
      )}
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
  transferenciaContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#1F1F1F',
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
  },
  transferenciaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  transferenciaText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 8,
  },
  fecha: {
    color: '#b0b0b0', 
    marginBottom: 12,  
  },
  confirmButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    elevation: 2,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
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