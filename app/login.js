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

// 🔐 Importa o service
import { login } from "../services/authService";

// 🔹 Componente reutilizável
const Campo = ({ label, erro, children }) => (
  <View style={styles.campoWrapper}>
    <Text style={styles.label}>{label}</Text>
    {children}
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
  </View>
);

export default function Login() {
  const router = useRouter();

  // 🔹 Estados
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  // 🔹 Ref
  const senhaRef = useRef(null);

  // 🔹 Validações
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhaValida = senha.length >= 6;

  function validar() {
    const e = {};

    if (!emailValido) e.email = "E-mail inválido";
    if (!senhaValida) e.senha = "Senha deve ter no mínimo 6 caracteres";

    setErros(e);
    return Object.keys(e).length === 0;
  }

  // 🔹 Submit
  async function handleLogin() {
    if (!validar()) return;

    try {
      setCarregando(true);

      await login(email, senha);

      Alert.alert("Sucesso", "Login realizado!");

      router.replace("/"); // vai pra home
    } catch (err) {
      Alert.alert("Erro", err.message || "Erro ao fazer login");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Login</Text>

        {/* Email */}
        <Campo label="E-mail" erro={erros.email}>
          <TextInput
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
              email &&
                !emailValido && {
                  borderColor: "red",
                  borderWidth: 2,
                },
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
              returnKeyType="done"
              onSubmitEditing={handleLogin}
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

        {/* Botão */}
        <TouchableOpacity
          style={[styles.botao, carregando && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={carregando}
        >
          <Text style={styles.botaoTexto}>
            {carregando ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        {/* Ir para cadastro */}
        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text style={styles.link}>Não tem conta? Criar conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🔹 Estilos
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#0a0a0a",
    flexGrow: 1,
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
