import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

const PokemonItem = React.memo(({ item }) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${item.id}`);
        const data = await response.json();
        const flavorTextEntry = data.flavor_text_entries.find(entry => entry.language.name === 'en');
        if (flavorTextEntry) {
          setDescription(flavorTextEntry.flavor_text);
        }
      } catch (error) {
        console.log("Hubo un error obteniendo la descripción del pokemon", error);
      }
    };

    fetchDescription();
  }, [item.id]);

  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png` }}
      />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
});

export default PokemonItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 5,
    width: WIDTH / numColumns - 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
});
