import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SalasContext } from "../context/SalasContext";

export default function Reportar() {
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);
  const [tempoGravacao, setTempoGravacao] = useState(0);
  const timerRef = useRef(null);
  const [gravando, setGravando] = useState(false);

  const [, requestCameraPermission] = useCameraPermissions();
  const [, requestMicrophonePermission] = useMicrophonePermissions();

  const [descricao, setDescricao] = useState("");
  const [computador, setComputador] = useState("");
  const [midiaUri, setMidiaUri] = useState(null);
  const [midiaTipo, setMidiaTipo] = useState(null);
  const [urgencia, setUrgencia] = useState("alta");
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { adicionarProblema } = useContext(SalasContext);

  function abrirOpcoesMidia() {
    Alert.alert("Adicionar mídia", "Escolha uma opção", [
      {
        text: "Tirar foto",
        onPress: abrirCamera,
      },
      {
        text: "Gravar vídeo",
        onPress: abrirCamera,
      },
      {
        text: "Escolher da galeria",
        onPress: selecionarMidia,
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  }

  /* Seleção de mídia*/
  async function selecionarMidia() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!resultado.canceled) {
      const arquivo = resultado.assets[0];

      setMidiaUri(arquivo.uri);
      setMidiaTipo(arquivo.type?.includes("video") ? "video" : "image");
    }
  }

  /* Abrir Câmera */
  async function abrirCamera() {
    const cam = await requestCameraPermission();
    const mic = await requestMicrophonePermission();

    if (!cam.granted) {
      Alert.alert("Permissão de câmera necessária");
      return;
    }

    if (!mic.granted) {
      Alert.alert("Permissão de microfone necessária para gravar vídeo");
      return;
    }

    setCameraVisible(true);
  }

  /* Tirar foto */
  async function tirarFotoReal() {
    if (!cameraRef.current) return;

    const foto = await cameraRef.current.takePictureAsync();

    setMidiaUri(foto.uri);
    setMidiaTipo("image");

    setCameraVisible(false);
  }

  /* Iniciar gravação */
  async function iniciarGravacao() {
    if (!cameraRef.current || gravando) return;

    try {
      setGravando(true);
      setTempoGravacao(0);

      timerRef.current = setInterval(() => {
        setTempoGravacao((tempo) => tempo + 1);
      }, 1000);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 10,
      });

      if (video?.uri) {
        setMidiaUri(video.uri);
        setMidiaTipo("video");
      }

      setCameraVisible(false);
    } catch {
      Alert.alert(
        "Erro ao gravar vídeo",
        "Tente gravar por pelo menos 2 segundos.",
      );
    } finally {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTempoGravacao(0);
      setGravando(false);
    }
  }

  /* Parar gravação */
  function pararGravacao() {
    if (!cameraRef.current || !gravando) return;

    cameraRef.current.stopRecording();
  }

  function adicionarProblemaHandler() {
    if (!descricao.trim() || !computador.trim()) return;

    const novoProblema = {
      computador,
      descricao,
      urgencia,
      midiaUri,
      midiaTipo,
      status: "pendente",
      data: new Date().toISOString(),
    };

    adicionarProblema(id, novoProblema);

    // Limpar campos
    setDescricao("");
    setComputador("");
    setMidiaUri(null);
    setMidiaTipo(null);
    router.back();
  }

  if (cameraVisible) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView style={{ flex: 1 }} ref={cameraRef} mode="video" />

        <View
          style={{
            position: "absolute",
            bottom: 40,
            width: "100%",
            alignItems: "center",
          }}
        >
          {!gravando ? (
            <>
              <TouchableOpacity onPress={tirarFotoReal}>
                <Text style={{ color: "white", fontSize: 18 }}>📸 Foto</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={iniciarGravacao}>
                <Text style={{ color: "red", fontSize: 18 }}>🔴 Gravar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={pararGravacao}>
              <Text style={{ color: "yellow", fontSize: 18 }}>
                ⏹ Parar - {tempoGravacao}s
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Problema</Text>

      {/* Campo computador */}
      <TextInput
        style={styles.input}
        placeholder="Número do computador (ex: PC-12)"
        placeholderTextColor="#aaa"
        value={computador}
        onChangeText={setComputador}
      />

      {/* Campo descrição */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descreva o problema"
        placeholderTextColor="#aaa"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      {/* Botão anexar */}
      <TouchableOpacity style={styles.botaoAnexo} onPress={abrirOpcoesMidia}>
        <Text style={styles.botaoTexto}>Adicionar mídia</Text>
      </TouchableOpacity>

      {midiaUri && midiaTipo === "video" ? (
        <Text style={styles.anexoTexto}>Vídeo gravado com sucesso</Text>
      ) : midiaUri ? (
        <Image source={{ uri: midiaUri }} style={styles.previewImagem} />
      ) : null}

      {/* Urgência */}
      <Text style={styles.label}>Urgência:</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.opcao, urgencia === "alta" && styles.selecionadoAlta]}
          onPress={() => setUrgencia("alta")}
        >
          <Text style={styles.texto}>Alta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.opcao,
            urgencia === "media" && styles.selecionadoMedia,
          ]}
          onPress={() => setUrgencia("media")}
        >
          <Text style={styles.texto}>Média</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.opcao,
            urgencia === "baixa" && styles.selecionadoBaixa,
          ]}
          onPress={() => setUrgencia("baixa")}
        >
          <Text style={styles.texto}>Baixa</Text>
        </TouchableOpacity>
      </View>

      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={adicionarProblemaHandler}>
        <Text style={styles.botaoTexto}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0a0a0a" },
  titulo: { color: "#fff", fontSize: 22, marginBottom: 20 },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  label: {
    color: "#fff",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  opcao: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selecionadoAlta: {
    backgroundColor: "#ff4d4d",
  },
  selecionadoMedia: {
    backgroundColor: "#ffaa00",
  },
  selecionadoBaixa: {
    backgroundColor: "#2ecc71",
  },
  texto: {
    color: "#fff",
  },
  botao: {
    backgroundColor: "#E1306C",
    padding: 15,
    borderRadius: 10,
  },
  botaoTexto: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  botaoAnexo: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  previewImagem: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 20,
  },
  previewVideo: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  anexoTexto: {
    color: "#2ecc71",
    marginBottom: 20,
    fontWeight: "bold",
  },
});
