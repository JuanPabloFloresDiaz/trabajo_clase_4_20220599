import React, { useState, useEffect, useCallback} from 'react';
import fetchData from '../components/componentes';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';

const ScreenApi = () => {
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState('');
    const [error, setError] = useState(null);

    const API_HAMACAS = 'servicios/publica/prueba.php';

    
    const fetchDataFromApi = async () => {
        try {
            const data = await fetchData(API_HAMACAS, 'readAll');
            setResponse(data.dataset);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataFromApi();
    }, []);

    
    useFocusEffect(
        useCallback(() => {
            fetchDataFromApi();
        }, [])
    );

    const insertarRegistros = async () => {
        try {
            const form = new FormData();
            form.append('nombreRol', roles);
            const data = await fetchData(API_HAMACAS, 'createRow', form);

            if (data.status) {
                console.log('Se agregó exitosamente');
                setRoles(''); // Limpiar el campo de texto
                fetchDataFromApi();
            } else {
                console.error('Error al agregar');
            }
        } catch (error) {
            console.error('No se pudo acceder a la API', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>{item.NOMBRE}</Text>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (

        <View style={styles.container}>
            <View style={styles.containerInput}>
                <TextInput
                    placeholder='Roles'
                    onChangeText={setRoles}
                    value={roles}
                    style={styles.input}
                    id='nombreRol'
                />
                <TouchableOpacity style={styles.botonAgregar} onPress={insertarRegistros}>
                    <Text style={styles.botonAgregarTexto}>Agregar Roles</Text>
                </TouchableOpacity>
            </View>

            {error && (
                <Text style={styles.errorText}>Error: {error.message}</Text>
            )}

            <Text style={styles.title}>API Prueba</Text>
            <FlatList
                data={response}
                renderItem={renderItem}
                keyExtractor={item => item.ID.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        marginRight: 10,
    },
    botonAgregar: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 4,
    },
    botonAgregarTexto: {
        color: '#fff',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 3, // Para Android
        shadowColor: '#000', // Para iOS
        shadowOffset: { width: 0, height: 2 }, // Para iOS
        shadowOpacity: 0.8, // Para iOS
        shadowRadius: 2, // Para iOS
    },
    cardText: {
        fontSize: 18,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default ScreenApi;
