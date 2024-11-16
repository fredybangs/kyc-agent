import React from 'react';
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

export default function IndexScreen() {
  const router = useRouter();

  const handleNavigateToLogin = () => {
    router.replace("/home");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome to the Agent KYC Portal</ThemedText>
      <ThemedText style={styles.subtitle}>
        Your one-stop platform for managing KYC applications efficiently.
      </ThemedText>

      <ThemedView style={styles.guidelinesContainer}>
        <ThemedText style={styles.guidelinesTitle}>Getting Started:</ThemedText>
        <ThemedText style={styles.guideline}>
          1. Sign in using your registered credentials.
        </ThemedText>
        <ThemedText style={styles.guideline}>
          2. Create, review, or submit new KYC applications.
        </ThemedText>
        <ThemedText style={styles.guideline}>
          3. Manage offline KYC applications and sync them later.
        </ThemedText>
        <ThemedText style={styles.guideline}>
          4. Contact support if you encounter any issues.
        </ThemedText>
      </ThemedView>

      <Pressable onPress={handleNavigateToLogin} style={styles.startButton}>
        <ThemedText style={styles.startButtonText}>Get Started</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {

    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  guidelinesContainer: {
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  guidelinesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#f58f21",
  },
  guideline: {
    fontSize: 16,
    marginBottom: 5,
  },
  startButton: {
    backgroundColor: "#f58f21",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
