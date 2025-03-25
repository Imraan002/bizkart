import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Animated } from "react-native";
import { useRouter } from "expo-router";
import { login } from "./authService";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const scaleAnim = useState(new Animated.Value(1))[0]; // Button animation

  const handleLogin = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    const user = await login(email, password);
    if (user) {
      alert(`✅ Welcome ${user.email} (${user.role})!`);

      // Role-based navigation
      if (user.role === "wholesaler") router.replace("../dashboard/wholesaler");
      else if (user.role === "retailer") router.replace("../dashboard/retailer");
      else if (user.role === "admin") router.replace("../dashboard/admin");
    } else {
      alert("❌ Login Failed! Check credentials.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://source.unsplash.com/random/?business,shop" }} // Dynamic background
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to BizKart</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 30 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, padding: 15, width: "90%", marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#333" },
  buttonContainer: { width: "90%", marginTop: 20 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { color: "#FFD700", marginTop: 15, fontSize: 16 },
});

