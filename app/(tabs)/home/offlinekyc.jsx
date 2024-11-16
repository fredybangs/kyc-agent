// screens/OfflineApplicationsScreen.jsx

import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  useColorScheme,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';
import axios from 'axios';
import apiConfig from '../../../services/api/config';
import { 
  removeKYCOffline, 
  addOnlineKYC, 
  clearOfflineKYCs
} from '../../../features/authentication/auth.slice'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';


export default function OfflineApplicationsScreen() {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = makeStyles(isDarkMode);

  const { userDetails, offlineKYCs } = useSelector((state) => state.user);

  const accessToken = userDetails.access_token;
  const [isSending, setIsSending] = useState(false);
  const [sendingIds, setSendingIds] = useState({}); 

  const uploadToImgbb = async (base64Image) => {
    const IMGBB_API_KEY = 'b03bfa94ee382d828ab3da67e813a97a';

    try {
      const formBody = new URLSearchParams({
        key: IMGBB_API_KEY,
        image: base64Image,
      }).toString();

      const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
      });

      const result = await uploadResponse.json();

      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('ImgBB upload error during sync:', error);
      throw error;
    }
  };

  const sendKYCApplication = async (kyc) => {
    setSendingIds((prev) => ({ ...prev, [kyc.timestamp]: true }));

    try {
      const idDocumentUrl = await uploadToImgbb(kyc.id_document_base64);
      const proofOfAddressUrl = await uploadToImgbb(kyc.proof_of_address_base64);
      const selfieUrl = await uploadToImgbb(kyc.selfie_base64);

      const data = {
        name: kyc.name,
        login: kyc.login,
        phone: kyc.phone,
        user_type: kyc.user_type,
        id_type: kyc.id_type,
        id_number: kyc.id_number,
        id_expiry_date: kyc.id_expiry_date,
        id_document_url: idDocumentUrl,
        proof_of_address_url: proofOfAddressUrl,
        selfie_url: selfieUrl,
        current_address: kyc.current_address,
        permanent_address: kyc.permanent_address,
      };

      const response = await axios.post(`${apiConfig.url}/api/kyc/create`, data, {
        headers: {
          'Content-Type': 'application/json',
          'clientId': '12345',
          'accessToken': accessToken,
        },
      });

      const res = response.data;

      if (res.intent) {
        dispatch(removeKYCOffline(kyc.timestamp));
        dispatch(addOnlineKYC(res.application_id));
        Alert.alert('Success', `KYC Application '${res.application_id}' submitted successfully.`);
      } else {
        Alert.alert('Error', res.message || 'An error occurred while submitting the application.');
      }
    } catch (error) {
      console.error('Error submitting KYC application:', error);
      Alert.alert('Error', `Failed to submit KYC Application: ${error.message}`);
    } finally {
      setSendingIds((prev) => {
        const { [kyc.timestamp]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const deleteApplication = (kyc) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this application? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(removeKYCOffline(kyc.timestamp));
            console.log("Application deleted");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  const deleteAll = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all applications? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(clearOfflineKYCs());
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  const sendAllKYCs = async () => {
    if (offlineKYCs.length === 0) {
      Alert.alert('No Applications', 'There are no offline applications to submit.');
      return;
    }

    setIsSending(true);

    for (const kyc of offlineKYCs) {
      await sendKYCApplication(kyc);
    }
    setIsSending(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.kycCard}>
      <ThemedText style={styles.kycTitle}>Application: {item.id_number}</ThemedText>
      <ThemedText>Name: {item.name}</ThemedText>
      <ThemedText>Email: {item.login}</ThemedText>
      <ThemedText>Phone: {item.phone}</ThemedText>
      <ThemedText>User Type: {item.user_type}</ThemedText>
      <ThemedText>ID Type: {item.id_type}</ThemedText>
      <ThemedText>ID Expiry Date: {item.id_expiry_date}</ThemedText>
      <View style={styles.imageContainer}>
        <Image source={{ uri: `data:image/png;base64,${item.id_document_base64}` }} style={styles.imagePreview} />
        <Image source={{ uri: `data:image/png;base64,${item.proof_of_address_base64}` }} style={styles.imagePreview} />
        <Image source={{ uri: `data:image/png;base64,${item.selfie_base64}` }} style={styles.imagePreview} />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: 'green' }]}
          onPress={() => sendKYCApplication(item)}
          disabled={!!sendingIds[item.timestamp]}
        >
          {sendingIds[item.timestamp] ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.sendButtonText}>Send</ThemedText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: 'red' }]}
          onPress={() => deleteApplication(item)}
        >
          <ThemedText style={styles.sendButtonText}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* App Bar */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Offline Applications" titleStyle={styles.headerTitle} />
        <Appbar.Action
          icon={() => <MaterialCommunityIcons name="delete" size={24} color="white" />}
          onPress={deleteAll}
        />
      </Appbar.Header>

      {offlineKYCs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No offline applications available.</ThemedText>
        </View>
      ) : (
        <FlatList
          data={offlineKYCs}
          keyExtractor={(item) => item.timestamp}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Send All Button */}
      {offlineKYCs.length > 0 && (
        <TouchableOpacity
          style={styles.sendAllButton}
          onPress={sendAllKYCs}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.sendAllButtonText}>Send All Applications</ThemedText>
          )}
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const primaryColor = '#F58F21';

const makeStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
    },
    header: {
      backgroundColor: primaryColor,
      elevation: 4,
    },
    headerTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '600',
    },
    listContent: {
      padding: 20,
      paddingBottom: 100, // To accommodate the Send All button
    },
    kycCard: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#F9F9F9',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    kycTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    imagePreview: {
      width: 80,
      height: 80,
      borderRadius: 8,
      resizeMode: 'cover',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    sendButton: {
      backgroundColor: primaryColor,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      alignItems: 'center',
      flex: 0.48,
      marginBottom: 10,
    },
    sendButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    sendAllButton: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: primaryColor,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    sendAllButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 18,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
  });
