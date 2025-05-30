import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';

export default function Original() {
  const [serie, setSerie] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRandomSerie = async () => {
    try {
      const randomId = Math.floor(Math.random() * 250); // TVMaze tiene más de 2000, pero hay huecos
      const res = await fetch(`https://api.tvmaze.com/shows/${randomId}`);
      const data = await res.json();
      setSerie(data);
    } catch (error) {
      console.error('Error al obtener serie aleatoria:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRandomSerie();
  }, []);

  const guardarFavorito = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !serie) return;

    const userRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, { favoritos: [] });
    }

    try {
      await updateDoc(userRef, {
        favoritos: arrayUnion({
          id: serie.id,
          name: serie.name,
          image: serie.image?.medium || '',
        }),
      });
      Alert.alert('¡Guardado!', 'Serie agregada a favoritos.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el favorito.');
      console.error(e);
    }
  };

  if (loading || !serie) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎲 Serie Aleatoria</Text>
      <Text style={styles.nombre}>{serie.name}</Text>
      {serie.image?.original && (
        <Image source={{ uri: serie.image.original }} style={styles.imagen} />
      )}
      <Text style={styles.genero}>{serie.genres.join(', ')}</Text>
      <Text numberOfLines={4} style={styles.resumen}>
        {serie.summary?.replace(/<[^>]+>/g, '')}
      </Text>

      <Button title="Agregar a Favoritos" onPress={guardarFavorito} />
      <View style={{ marginTop: 10 }}>
        <Button title="Mostrar otra serie" onPress={getRandomSerie} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  nombre: { fontSize: 20, fontWeight: '600', marginBottom: 5 },
  genero: { fontStyle: 'italic', marginBottom: 5 },
  resumen: { textAlign: 'center', marginVertical: 10 },
  imagen: { width: 200, height: 300, resizeMode: 'cover', borderRadius: 10, marginBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
