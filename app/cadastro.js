import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

// 👉 IMPORTANTE: esse service você vai criar depois
import { cadastrar } from "../services/authService";

// 🔹 Componente reutilizável (mantido)
const Campo = ({ label, erro, children }) => (
  <View style={styles.campoWrapper}>
    <Text style={styles.label}>{label}</Text>
    {children}
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
  </View>
);

export default function Cadastro() {
  const router = useRouter();

  // 🔹 Estados
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  // 🔹 Refs para navegação entre inputs
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const confirmarRef = useRef(null);

  // 🔹 Validações em tempo real
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhaValida = senha.length >= 6;
  const senhaConfere = senha === confirmarSenha && confirmarSenha !== "";

  // 🔹 Função de validação completa
  function validar() {
    const e = {};

    if (!nome.trim()) e.nome = "Nome obrigatório";

    if (!emailValido) e.email = "E-mail inválido";

    if (!senhaValida) e.senha = "Senha deve ter no mínimo 6 caracteres";

    if (!senhaConfere) e.confirmarSenha = "As senhas não coincidem";

    setErros(e);
    return Object.keys(e).length === 0;
  }

  // 🔹 Submit
  async function handleSubmit() {
    if (!validar()) return;

    try {
      setCarregando(true);

      await cadastrar(nome, email, senha);

      Alert.alert("Sucesso", "Conta criada com sucesso!");

      router.replace("/login"); // volta para login
    } catch (err) {
      Alert.alert("Erro", err.message || "Erro ao cadastrar usuário");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Criar Conta</Text>

        {/* Nome */}
        <Campo label="Nome completo" erro={erros.nome}>
          <TextInput
            placeholder="Ex: João Silva"
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            style={[
              styles.input,
              erros.nome && styles.inputErro,
              nome && { borderColor: "green", borderWidth: 2 },
            ]}
          />
        </Campo>

        {/* Email */}
        <Campo label="E-mail" erro={erros.email}>
          <TextInput
            ref={emailRef}
            placeholder="email@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => senhaRef.current.focus()}
            style={[
              styles.input,
              erros.email && styles.inputErro,
              emailValido && { borderColor: "green", borderWidth: 2 },
              email && !emailValido && { borderColor: "red", borderWidth: 2 },
            ]}
          />
        </Campo>

        {/* Senha */}
        <Campo label="Senha" erro={erros.senha}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              ref={senhaRef}
              placeholder="******"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!senhaVisivel}
              returnKeyType="next"
              onSubmitEditing={() => confirmarRef.current.focus()}
              style={[
                styles.input,
                { flex: 1 },
                erros.senha && styles.inputErro,
                senhaValida && { borderColor: "green", borderWidth: 2 },
                senha &&
                  !senhaValida && {
                    borderColor: "red",
                    borderWidth: 2,
                  },
              ]}
            />
            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
              <Text style={styles.olho}>{senhaVisivel ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
        </Campo>

        {/* Confirmar senha */}
        <Campo label="Confirmar senha" erro={erros.confirmarSenha}>
          <TextInput
            ref={confirmarRef}
            placeholder="******"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!senhaVisivel}
            returnKeyType="done"
            style={[
              styles.input,
              erros.confirmarSenha && styles.inputErro,
              senhaConfere && {
                borderColor: "green",
                borderWidth: 2,
              },
              confirmarSenha &&
                !senhaConfere && {
                  borderColor: "red",
                  borderWidth: 2,
                },
            ]}
          />
        </Campo>

        {/* Botão */}
        <TouchableOpacity
          style={[styles.botao, carregando && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>
            {carregando ? "Criando..." : "Criar conta"}
          </Text>
        </TouchableOpacity>

        {/* Link para login */}
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Já tem conta? Fazer login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🔹 Estilos
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  campoWrapper: { marginBottom: 16 },
  label: { color: "#ccc", marginBottom: 6 },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
  },
  inputErro: { borderColor: "red", borderWidth: 1 },
  erro: { color: "red", fontSize: 12, marginTop: 4 },
  botao: {
    backgroundColor: "#E1306C",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  olho: {
    padding: 14,
    fontSize: 18,
  },
  link: {
    color: "#E1306C",
    textAlign: "center",
    marginTop: 15,
  },
});
