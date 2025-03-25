import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Platform } from "react-native"; // Detect if running on Web

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === "web") {
      // ✅ Create and inject reCAPTCHA div for Web users
      const recaptchaDiv = document.createElement("div");
      recaptchaDiv.id = "recaptcha-container";
      document.body.appendChild(recaptchaDiv);
    }

    setTimeout(() => {
      router.replace("/auth/login"); // Redirect AFTER mounting
    }, 100); // Small delay to prevent errors
  }, []);

  return null; // No UI needed, just redirecting
}
