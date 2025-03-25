import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen() {
  const router = useRouter();
  const { cartItems } = useLocalSearchParams();
  const [cart, setCart] = useState(cartItems ? JSON.parse(cartItems as string) : []);

  // ✅ Remove Item from Cart by index
  const removeItem = (index: number) => {
    const updatedCart = cart.filter((item: any, i: number) => i !== index); // Explicitly type 'item' and 'i'
    setCart(updatedCart);
  };
  

  // ✅ Calculate Total Price
  const totalPrice = cart.reduce((total: number, item: { price: number }) => total + Number(item.price), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Your Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty!</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()} // Use index as the unique key
            renderItem={({ item, index }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>₹{item.price}</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(index)}>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* ✅ Total Price */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ₹{totalPrice.toFixed(2)}</Text>
          </View>

          {/* ✅ Proceed to Payment Button */}
          <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push("./payment")}>
            <Text style={styles.checkoutText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  emptyText: { fontSize: 18, color: "#888", textAlign: "center", marginTop: 50 },

  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: "bold" },
  productPrice: { fontSize: 16, color: "#28a745" },

  totalContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    alignItems: "center",
  },
  totalText: { fontSize: 22, fontWeight: "bold", color: "#333" },

  checkoutButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
