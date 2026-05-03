import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Chaves padrão (centralizadas)
const KEYS = {
  USUARIOS: "@usuarios",
  USUARIO_LOGADO: "@usuario_logado",
};

// 🔹 Função interna para buscar usuários
async function getUsuarios() {
  const data = await AsyncStorage.getItem(KEYS.USUARIOS);
  return data ? JSON.parse(data) : [];
}

// 🔹 Função interna para salvar usuários
async function salvarUsuarios(usuarios) {
  await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
}

// 🔹 CADASTRAR USUÁRIO
export async function cadastrar(nome, email, senha) {
  const usuarios = await getUsuarios();
  const emailNormalizado = email.trim().toLowerCase();
  const senhaNormalizada = senha.trim();

  // Verifica duplicidade
  const usuarioExiste = usuarios.find(
    (u) => u.email?.trim().toLowerCase() === emailNormalizado,
  );

  if (usuarioExiste) {
    throw new Error("E-mail já cadastrado");
  }

  const novoUsuario = {
    id: Date.now().toString(),
    nome: nome.trim(),
    email: emailNormalizado,
    senha: senhaNormalizada,
  };

  const novosUsuarios = [...usuarios, novoUsuario];

  await salvarUsuarios(novosUsuarios);
  await AsyncStorage.setItem(KEYS.USUARIO_LOGADO, JSON.stringify(novoUsuario));

  return novoUsuario;
}

// 🔹 LOGIN
export async function login(email, senha) {
  const usuarios = await getUsuarios();
  const emailNormalizado = email.trim().toLowerCase();
  const senhaNormalizada = senha.trim();

  const usuario = usuarios.find(
    (u) =>
      u.email?.trim().toLowerCase() === emailNormalizado &&
      u.senha === senhaNormalizada,
  );

  if (!usuario) {
    throw new Error("E-mail ou senha inválidos");
  }

  // Salva sessão
  await AsyncStorage.setItem(KEYS.USUARIO_LOGADO, JSON.stringify(usuario));

  return usuario;
}

// 🔹 LOGOUT
export async function logout() {
  await AsyncStorage.removeItem(KEYS.USUARIO_LOGADO);
}

// 🔹 USUÁRIO LOGADO
export async function getUsuarioLogado() {
  const data = await AsyncStorage.getItem(KEYS.USUARIO_LOGADO);
  return data ? JSON.parse(data) : null;
}
