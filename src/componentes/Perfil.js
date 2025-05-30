import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const traerDatos = async () => {
      try {
        const docRef = doc(db, 'usuarios', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || '');
          setFecha(data.fecha || '');
          setTelefono(data.telefono || '');
          setFavoritos(data.favoritos || []);
        } else {
          Alert.alert('Perfil no encontrado');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos');
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    traerDatos();
  }, [uid]);

  const actualizarDatos = async () => {
    try {
      const docRef = doc(db, 'usuarios', uid);
      await updateDoc(docRef, {
        nombre,
        fecha,
        telefono,
      });
      Alert.alert('Datos actualizados');
    } catch (error) {
      Alert.alert('Error al actualizar');
      console.error(error);
    }
  };

  if (cargando) return <Text style={styles.cargando}>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Perfil del Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Button title="Guardar cambios" onPress={actualizarDatos} />

      <Text style={styles.subtitulo}>⭐ Series Favoritas</Text>
      {favoritos.length === 0 ? (
        <Text>No hay series favoritas aún.</Text>
      ) : (
        favoritos.map((serie, index) => (
          <View key={index} style={styles.favorito}>
            {serie.image ? (
              <Image source={{ uri: serie.image }} style={styles.imagen} />
            ) : null}
            <Text style={styles.nombre}>{serie.name}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
  },
  cargando: { marginTop: 50, textAlign: 'center' },
  favorito: { alignItems: 'center', marginBottom: 15 },
  imagen: { width: 100, height: 140, resizeMode: 'cover', borderRadius: 5 },
  nombre: { marginTop: 5, fontWeight: '500', textAlign: 'center' },
});
