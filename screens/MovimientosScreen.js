import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MovimientosScreen = ({ route }) => {
  const { userId } = route.params;
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerMovimientos = async () => {
      try {
        const response = await fetch('http://192.168.0.149:5000/api/movimientos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (data.success) {
          setMovimientos(data.movimientos);
        } else {
          console.error('No se pudieron obtener los movimientos');
        }
      } catch (error) {
        console.error('Error al obtener movimientos:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerMovimientos();
  }, [userId]);

  const renderItem = ({ item }) => {
    const esTransferenciaRecibida = item.id_destino === userId;
    const monto = esTransferenciaRecibida ? item.monto : -item.monto;
    const estadoColor = item.estado === 'completada' ? '#999' : 'orange';
    const fechaColor = '#999';

    return (
      <View style={styles.movimientoContainer}>
        <View style={styles.leftColumn}>
          <Icon
            name={esTransferenciaRecibida ? 'arrow-down' : 'arrow-up'}
            size={20}
            color={esTransferenciaRecibida ? 'green' : 'red'}
            style={styles.icon}
          />
        </View>

        <View style={styles.middleColumn}>
          <Text style={styles.movimientoTextBold}>{item.nombre || 'Desconocido'}</Text>
          <Text style={styles.movimientoText}>{item.concepto || 'Sin descripción'}</Text>
          <Text style={[styles.fechaText, { fontStyle: 'italic', color: fechaColor }]}>
            {new Date(item.fecha).toLocaleString()}
          </Text>

          <View style={styles.estadoContainer}>
            <Text style={[styles.stateText, { color: estadoColor }]}>
              {item.estado}
            </Text>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>${monto}</Text>
            <Text style={styles.mxnText}> MXN</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Transacciones</Text>
      <FlatList
        data={movimientos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  movimientoContainer: {
    backgroundColor: '#121212',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  rightColumn: {
    width: '35%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  movimientoText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 5,
  },
  movimientoTextBold: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  fechaText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  stateText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  icon: {
    marginLeft: 5,
  },
  amountText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mxnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 10,
  },
});

export default MovimientosScreen;