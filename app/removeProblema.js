import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SalasContext } from "../context/SalasContext";

export default function RemoveProblema() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { salas, removerProblema } = useContext(SalasContext);

  const sala = salas.find((s) => s.id === id);

  if (!sala) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Sala não encontrada</Text>
      </View>
    );
  }

  function handleRemover(index) {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja remover este problema?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removerProblema(id, index),
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Remover Problema</Text>

      {sala.problemas.length === 0 ? (
        <Text style={styles.vazio}>Nenhum problema para remover</Text>
      ) : (
        sala.problemas.map((p, index) => (
          <View key={index} style={styles.item}>
            <View>
              <Text style={styles.texto}>{p.computador}</Text>
              <Text style={styles.texto}>{p.descricao}</Text>
              <Text style={styles.urgencia}>{p.urgencia.toUpperCase()}</Text>
            </View>

            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => handleRemover(index)}
            >
              <Text style={styles.botaoTexto}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => router.back()}
      >
        <Text style={styles.botaoTexto}>Voltar</Text>
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
  vazio: {
    color: "#aaa",
  },
  item: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  texto: {
    color: "#fff",
  },
  urgencia: {
    color: "#E1306C",
    fontWeight: "bold",
  },
  botaoRemover: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  botaoVoltar: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
