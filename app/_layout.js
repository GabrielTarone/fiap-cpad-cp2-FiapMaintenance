import { Stack } from "expo-router";
import { SalasProvider } from "../context/SalasContext";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getUsuarioLogado } from "../services/authService";
import { useRouter, useSegments } from "expo-router";

export default function Layout() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    verificarUsuario();
  }, []);

  async function verificarUsuario() {
    const user = await getUsuarioLogado();
    setUsuario(user);
    setCarregando(false);
  }

  useEffect(() => {
    if (carregando) return;

    const estaNaAuth = segments[0] === "login" || segments[0] === "cadastro";

    // 🔒 NÃO LOGADO → manda pro login
    if (!usuario && !estaNaAuth) {
      router.replace("/login");
    }

    // 🔓 LOGADO → impede voltar pro login
    if (usuario && estaNaAuth) {
      router.replace("/");
    }
  }, [usuario, carregando]);

  // 🔹 Loading
  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
        }}
      >
        <ActivityIndicator size="large" color="#E1306C" />
      </View>
    );
  }

  return (
    <SalasProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SalasProvider>
  );
}
