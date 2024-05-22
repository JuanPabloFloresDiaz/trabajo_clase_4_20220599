import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

import PokemonItem from '../components/PokemonItem';
import FormularioPokemon from '../components/FormularioPokemon';

export default function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cantidadPokemon, setCantidadPokemon] = useState(20);
  const [nombrePokemon, setNombrePokemon] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${cantidadPokemon}`);
      const data = await response.json();
      const results = data.results.map((result, index) => ({ ...result, id: index + 1 }));
      setPokemon(results);
      setFilteredPokemon(results);
    } catch (error) {
      console.log("Hubo un error listando los pokemones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cantidadPokemon]);

  useEffect(() => {
    console.log("Nombre de Pokémon:", nombrePokemon); // Agregar para depurar
    if (nombrePokemon) {
      const lowerCaseName = nombrePokemon.toLowerCase();
      const filtered = pokemon.filter(p => p.name.toLowerCase().includes(lowerCaseName));
      console.log("Pokémon filtrados:", filtered); // Agregar para depurar
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemon);
    }
  }, [nombrePokemon, pokemon]);

  return (
    <View style={styles.container}>
      <FormularioPokemon
        tituloFormulario='Listado de Pokemones usando Fetch'
        labelInput='Ingrese la cantidad de pokemon a cargar: '
        placeHolderInput='20'
        valor={cantidadPokemon}
        setValor={setCantidadPokemon}
        isNumeric={true}
      />
      <FormularioPokemon
        tituloFormulario='Listado de Pokemones usando Fetch'
        labelInput='Ingrese el nombre de pokemon a cargar: '
        placeHolderInput=''
        valor={nombrePokemon}
        setValor={setNombrePokemon}
        isNumeric={false}
      />
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredPokemon}
          renderItem={({ item }) => <PokemonItem item={item} />}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  list: {
    justifyContent: 'center',
  },
  loading: {
    marginTop: 20,
  },
});
