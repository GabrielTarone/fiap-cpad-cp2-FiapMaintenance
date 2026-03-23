// Aba para adicionar sala

import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SalasContext } from "../context/SalasContext";

export default function NovaSala() {
  const [nome, setNome] = useState("");
  const router = useRouter();
  const { adicionarSala } = useContext(SalasContext);

  function adicionarSalaHandler() {
    if (!nome.trim()) return;


    //Antes 

    /*const id = adicionarSala(nome);

    router.replace({
      pathname: "/reportar",
      params: { id },
    });*/


    //Depois
    
    const id = adicionarSala(nome);

    Alert.alert(
      "Sucesso",
      "Cadastro salvo com sucesso!",
      [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/reportar",
              params: {id},
            }),
        },
      ]
    );



  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova Sala</Text>

      <TextInput
        style={styles.input}
        placeholder="Número da sala"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.botao} onPress={adicionarSalaHandler}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
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
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  botao: {
    backgroundColor: "#E1306C",
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
