import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Animated } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { signUp } from "./authService";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("retailer"); // Default role
  const scaleAnim = useState(new Animated.Value(1))[0]; // Button animation

  const handleSignup = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    const user = await signUp(email, password, role);
    if (user) {
      alert(`✅ Signup Successful as ${role}! Please Login.`);
      router.replace("/auth/login");
    } else {
      alert("❌ Signup Failed! Try again.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://source.unsplash.com/random/?shopping,market" }} // Dynamic background
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Create an Account</Text>

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

        <Text style={styles.label}>Select Role</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={role} style={styles.picker} onValueChange={(itemValue) => setRole(itemValue)}>
            <Picker.Item label="Retailer" value="retailer" />
            <Picker.Item label="Wholesaler" value="wholesaler" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>

        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
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
  label: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 10, width: "90%", marginBottom: 15 },
  picker: { height: 50, width: "100%" },
  buttonContainer: { width: "90%", marginTop: 20 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { color: "#FFD700", marginTop: 15, fontSize: 16 },
});
