import { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

// ✅ Define Product Type
type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

// ✅ Retailer Dashboard Component
export default function RetailerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Fetch Products from Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("🔥 Error fetching products:", error);
    }
  };

  // ✅ Add to Cart Function
  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // ✅ Navigate to Cart & Pass Cart Data
  const goToCart = () => {
    router.push({
      pathname: "./cart",
      params: { cartItems: JSON.stringify(cart) }, // ✅ Pass cart data as a JSON string
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retailer Dashboard</Text>

      {/* 🛒 Cart Button */}
      <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
        <Ionicons name="cart" size={28} color="#fff" />
        {cart.length > 0 && <Text style={styles.cartText}>{cart.length}</Text>}
      </TouchableOpacity>

      {/* 📌 Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
                <Ionicons name="cart" size={20} color="#fff" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },

  // 🛒 Cart Button
  cartButton: { position: "absolute", top: 15, right: 20, backgroundColor: "#007BFF", padding: 12, borderRadius: 50, flexDirection: "row", alignItems: "center" },
  cartText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 5 },

  // 📌 Product Card
  productCard: { flexDirection: "row", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  productImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  productPrice: { fontSize: 16, color: "#28a745", marginBottom: 5 },

  // 🛒 Add to Cart Button
  addToCartButton: { backgroundColor: "#FF6600", padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" },
  addToCartText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 5 },
});
