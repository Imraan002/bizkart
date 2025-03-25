import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

// ✅ Define Product Type
type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export default function WholesalerDashboard() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Function to Pick Image
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("🔥 Image Picker Error:", error);
    }
  };

  // ✅ Function to Add Product
  const addProduct = async () => {
    if (!productName || !price || !image) {
      alert("❌ Please fill all fields!");
      return;
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const docRef = await addDoc(collection(db, "products"), {
        name: productName,
        price,
        image,
        wholesalerId: auth.currentUser?.uid,
      });

      console.log("✅ Product Added:", docRef.id);
      alert("✅ Product added successfully!");
      setProductName("");
      setPrice("");
      setImage(null);
      fetchProducts();
    } catch (error) {
      console.error("🔥 Error adding product:", error);
    }
  };

  // ✅ Function to Fetch Products
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(productList);
    } catch (error) {
      console.error("🔥 Error fetching products:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Wholesaler Dashboard</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="pricetag" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          placeholderTextColor="#888"
          value={productName}
          onChangeText={setProductName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="cash" size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="#888"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Ionicons name="image" size={24} color="#fff" />
        <Text style={styles.imageButtonText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity style={styles.button} onPress={addProduct}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.subTitle}>My Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/auth/login")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#141E30",
    alignItems: "center",
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    marginBottom: 10,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#fff" },
  imageButton: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    justifyContent: "center",
    marginBottom: 10,
  },
  imageButtonText: { color: "#fff", fontSize: 16, marginLeft: 8 },
  image: { width: 120, height: 120, borderRadius: 10, marginVertical: 10 },
  button: {
    backgroundColor: "#007BFF", // Bright modern blue
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "90%",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  logoutButton: {
    backgroundColor: "#DC3545", // Classic bold red for logout
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "90%",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  subTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#fff",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    width: "90%",
  },
  productImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  productPrice: { fontSize: 16, color: "#FFD700" },
});
