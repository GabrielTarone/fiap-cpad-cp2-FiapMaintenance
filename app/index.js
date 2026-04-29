// Pagina Home do App

import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SalaCard from "../components/SalaCard";
import { SalasContext } from "../context/SalasContext";
import { logout } from "../services/authService";

export default function Home() {
  const router = useRouter();
  const { salas } = useContext(SalasContext);

  // Pega maior urgência da sala
  function getUrgenciaMaisAlta(problemas) {
    if (!problemas.length) return "nenhuma";

    if (problemas.some((p) => p.urgencia === "alta")) return "alta";
    if (problemas.some((p) => p.urgencia === "media")) return "media";
    return "baixa";
  }

  // Ordem de urgência (prioridade)
  const salasOrdenadas = [...salas].sort((a, b) => {
    const prioridade = { alta: 3, media: 2, baixa: 1, nenhuma: 0 };

    const urgA = getUrgenciaMaisAlta(a.problemas);
    const urgB = getUrgenciaMaisAlta(b.problemas);

    return prioridade[urgB] - prioridade[urgA];
  });

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  // Lista para separar com problema do sem problema
  const salasComProblema = salasOrdenadas.filter((s) => s.problemas.length > 0);

  // Lista para separar sem problema do com problema
  const salasSemProblema = salasOrdenadas.filter(
    (s) => s.problemas.length === 0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Cadastro </Text>
          <Text style={styles.tituloSecundario}>de Manutenção</Text>
        </Text>

        <Image
          source={require("../assets/images/logo_fiap.png")}
          style={styles.logo}
        />
      </View>
      {/* Prioridades */}
      <Text style={styles.info}>Lista de Prioridades</Text>
      <FlatList
        data={salasComProblema}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SalaCard
            sala={item}
            onPress={() =>
              router.push({
                pathname: "/detalhes",
                params: { id: item.id, nome: item.nome },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma sala com problemas</Text>
        }
      />
      {/* Salas sem problemas */}
      <Text style={styles.info}>Sem problemas / Solucionados</Text>
      <FlatList
        data={salasSemProblema}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SalaCard
            sala={item}
            onPress={() =>
              router.push({
                pathname: "/detalhes",
                params: { id: item.id, nome: item.nome },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Todas as salas possuem problemas</Text>
        }
      />
      {/* Botão cadastrar sala */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push("/novaSala")}
      >
        <Text style={styles.botaoTexto}>Cadastrar Sala</Text>
      </TouchableOpacity>
      {/* Botão remover sala */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push("/removerSala")}
      >
        <Text style={styles.botaoTexto}>Remover Sala</Text>
      </TouchableOpacity>
      {/* Botão Logout */}
      <TouchableOpacity style={styles.botao} onPress={handleLogout}>
        <Text style={styles.botaoTexto}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titulo: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
  },
  tituloDestaque: {
    color: "#E1306C",
  },
  tituloSecundario: {
    color: "#fff",
    letterSpacing: 2,
  },
  info: {
    color: "#888",
    fontSize: 14,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#E1306C",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  logo: {
    width: 80,
    height: 50,
    resizeMode: "contain",
    marginLeft: 10,
  },
  vazio: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
