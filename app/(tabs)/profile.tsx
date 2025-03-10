import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/lib/supabase";
import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ProtectedRoute permission="viewOwnProfile">
      <ThemedView style={styles.container}>
        <Text style={styles.title}>This is you</Text>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 90,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 18,
    color: "gray",
    marginTop: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
  },
});

export default Profile;
