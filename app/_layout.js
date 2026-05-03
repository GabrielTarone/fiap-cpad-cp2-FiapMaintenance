import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SalasProvider } from "../context/SalasContext";
import { getUsuarioLogado } from "../services/authService";

export default function Layout() {
  const [carregando, setCarregando] = useState(true);

  const router = useRouter();
  const segments = useSegments();
  const rotaAtual = segments.join("/");

  useEffect(() => {
    async function verificarUsuarioInicial() {
      await getUsuarioLogado();
      setCarregando(false);
    }

    verificarUsuarioInicial();
  }, []);

  useEffect(() => {
    if (carregando) return;

    async function protegerRotas() {
      const user = await getUsuarioLogado();
      const estaNaAuth = segments[0] === "login" || segments[0] === "cadastro";

      if (!user && !estaNaAuth) {
        router.replace("/login");
        return;
      }

      if (user && estaNaAuth) {
        router.replace("/");
      }
    }

    protegerRotas();
  }, [carregando, rotaAtual, router, segments]);

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
