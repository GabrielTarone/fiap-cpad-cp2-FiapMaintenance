import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SalaCard from "../components/SalaCard";
import { SalasContext } from "../context/SalasContext";

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

  // Pega o problema mais urgente da sala
  function getProblemaMaisUrgente(sala) {
    if (!sala.problemas.length) return null;

    const alta = sala.problemas.find((p) => p.urgencia === "alta");
    if (alta) return alta;

    const media = sala.problemas.find((p) => p.urgencia === "media");
    if (media) return media;

    return sala.problemas[0];
  }

  // Chamar o técnico por whatsapp com base na sala mais urgente
  function chamarTecnicoGeral() {
    const salaMaisUrgente = salasOrdenadas.find(
      (s) => s.problemas.length > 0
    );

    if (!salaMaisUrgente) return;

    const problema = getProblemaMaisUrgente(salaMaisUrgente);

    const msg = `${salaMaisUrgente.nome} - ${problema.computador}: ${problema.descricao}`;
    const url = `https://wa.me/5511981700028?text=${encodeURIComponent(msg)}`;

    Linking.openURL(url);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Manutenção</Text>

      <Text style={styles.info}>Lista de Prioridades</Text>

      {/* Lista de salas */}
      <FlatList
        data={salasOrdenadas}
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
          <Text style={styles.vazio}>Nenhuma sala cadastrada</Text>
        }
      />

      {/* Botão whatsapp */}
      <TouchableOpacity
        style={styles.botaoWhatsapp}
        onPress={chamarTecnicoGeral}
      >
        <Text style={styles.whatsappTexto}>Chamar técnico</Text>
      </TouchableOpacity>

      {/* Botão cadastrar sala */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push("/novaSala")}
      >
        <Text style={styles.botaoTexto}>Cadastrar Sala</Text>
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
  titulo: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 20,
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
  whatsapp: {
    color: "#25D366",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  botaoWhatsapp: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  whatsappTexto: {
    color: "#25D366",
    fontSize: 16,
    fontWeight: "bold",
  },
  vazio: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
