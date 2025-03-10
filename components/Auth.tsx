import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";
import { Input } from "@rneui/themed";
import { useSession } from "@/contexts/SessionContext";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const session = useSession();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    else Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  if (session.session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          disabled={loading}
          onPress={signInWithEmail}
        >
          <Text style={[styles.buttonText, styles.signInButtonText]}>
            SIGN IN
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          disabled={loading}
          onPress={signUpWithEmail}
        >
          <Text style={[styles.buttonText, styles.signUpButtonText]}>
            SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 50,
  },
  signInButton: {
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "black",
  },
  signUpButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
  },
  buttonText: {
    fontSize: 18,
    marginRight: 10,
  },
  signInButtonText: {
    color: "white",
  },
  signUpButtonText: {
    color: "black",
  },
});
