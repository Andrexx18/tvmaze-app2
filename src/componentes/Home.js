import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export default function Home() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const obtenerSeries = async () => {
      try {
        const res = await fetch('https://api.tvmaze.com/shows');
        const data = await res.json();
        setSeries(data.slice(0, 50)); // Muestra solo las primeras 50
      } catch (error) {
        console.error('Error al obtener las series:', error);
      }
    };

    obtenerSeries();
  }, []);

  return (
    <ScrollView>
      <View style={styles.contenedor}>
        {series.map((serie) => (
          <View key={serie.id} style={styles.card}>
            <Text style={styles.titulo}>{serie.name}</Text>
            {serie.image?.medium && (
              <Image source={{ uri: serie.image.medium }} style={styles.imagen} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    backgroundColor: '#f2f2f2',
    width: '48%',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  titulo: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  imagen: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 5,
  },
});
