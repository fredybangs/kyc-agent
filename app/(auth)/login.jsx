import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { Appbar } from 'react-native-paper';
import { authenticate } from '../../services/authService';
import { login, updateUserDetails } from '../../features/authentication/auth.slice';
import { useDispatch } from 'react-redux';

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const saveLogin = async value => {
        dispatch(login(value));
    };

    const saveUserDetails = async data => {
        dispatch(updateUserDetails(data));
    };

    const handleSignIn = async () => {
        setIsSubmitting(true);

        const payload = {
            username: email,
            password: password,
        };

        try {
            const response = await authenticate(payload);
            if (response.access_token) {
                saveUserDetails(response);
                saveLogin(true);
                router.push('/home'); 
            } else if (response.connectionError) {
                Alert.alert('Connection Error', 'Server not reachable. Please check your connection.');
            } else {
                Alert.alert('Error', response.message|| 'Login failed. Please try again.');
            }
        } catch (err) {
            Alert.alert('Error', 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <Appbar.Content title="Qcell KYC"/>
            </Appbar.Header>

            <View style={styles.form}>
                <ThemedText type='title' style={styles.title}>Agent Sign In</ThemedText>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    placeholderTextColor="#aaa"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    textContentType="password"
                    placeholderTextColor="#aaa"
                />

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleSignIn}
                    disabled={isSubmitting} 
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" /> 
                    ) : (
                        <ThemedText type='title' style={styles.signInButtonText}>Sign In</ThemedText>
                    )}
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    appBar: {
        backgroundColor: '#f58f21',
    },
    form: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    signInButton: {
        backgroundColor: '#f58f21',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    registerLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
