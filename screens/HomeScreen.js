import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ route, navigation }) => {
  const { user } = route.params; 

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', onPress: () => navigation.navigate('WelcomeScreen') },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user.nombre}</Text>
        <View style={styles.saldoContainer}>
          <Text style={styles.saldoTitle}>Saldo disponible</Text>
          <Text style={styles.saldoAmount}>${user.saldo.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('TransferScreen')}
        >
          <Icon name="money" size={20} color="#ffffff" style={styles.icon} />
          <Text style={styles.optionText}>Transferir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('RecibirScreen', { user: user })}
        >
          <Icon name="arrow-down" size={20} color="#ffffff" style={styles.icon} />
          <Text style={styles.optionText}>Recibir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('MovimientosScreen')}
        >
          <Icon name="history" size={20} color="#ffffff" style={styles.icon} />
          <Text style={styles.optionText}>Movimientos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#ffffff" style={styles.icon} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  saldoContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  saldoTitle: {
    fontSize: 18,
    color: '#cccccc',
  },
  saldoAmount: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 10,
  },
  optionsContainer: {
    marginTop: 40,
  },
  optionButton: {
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  icon: {
    marginRight: 10,
},
  logoutButton: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;