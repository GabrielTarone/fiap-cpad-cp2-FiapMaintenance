// Aba de remover salas

import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SalasContext } from "../context/SalasContext";

export default function RemoverSala() {
  const router = useRouter();

  // versão antiga
  //const [nome, setNome] = useState("");

  // context
  const { salas, removerSala /*removerSalaPorNome*/ } =
    useContext(SalasContext);

  // versão nova
  function confirmarRemocao(id, nomeSala) {
    Alert.alert("Remover Sala", `Deseja remover a sala ${nomeSala}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => removerSala(id),
      },
    ]);
  }

  // versão antiga
  /*
  function removerSalaHandler() {
    if (!nome.trim()) return;

    removerSalaPorNome(nome);
    router.replace("/");
  }
  */

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Remover Sala</Text>

      {/* versão nova */}
      <Text style={styles.subtitulo}>Selecione a sala para remover:</Text>

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>

            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => confirmarRemocao(item.id, item.nome)}
            >
              <Text style={styles.botaoTexto}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma sala cadastrada</Text>
        }
      />

      {/* versão antiga */}
      {/*
      <Text style={styles.subtitulo}>
        Remover digitando o nome:
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome da sala"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={removerSalaHandler}
      >
        <Text style={styles.botaoTexto}>
          Remover por nome
        </Text>
      </TouchableOpacity>
      */}

      {/* Botão voltar */}
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
  subtitulo: {
    color: "#888",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  nome: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  botaoRemover: {
    backgroundColor: "#E1306C",
    padding: 10,
    borderRadius: 8,
  },
  botao: {
    backgroundColor: "#E1306C",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
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
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  vazio: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
