import { ResizeMode, Video } from "expo-av";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ProblemaItem({ problema }) {
  function corUrgencia() {
    if (problema.urgencia === "alta") return "#ff4d4d";
    if (problema.urgencia === "media") return "#ffaa00";
    return "#2ecc71";
  }

  return (
    <View style={[styles.item, { borderLeftColor: corUrgencia() }]}>
      <Text style={styles.texto}>{problema.computador}</Text>

      <Text style={styles.texto}>{problema.descricao}</Text>

      {problema.midiaUri && problema.midiaTipo === "image" && (
        <Image
          source={{ uri: problema.midiaUri }}
          style={styles.imagemProblema}
        />
      )}

      {problema.midiaUri && problema.midiaTipo === "video" && (
        <Video
          source={{ uri: problema.midiaUri }}
          style={styles.videoProblema}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
        />
      )}

      <Text style={[styles.urgencia, { color: corUrgencia() }]}>
        {problema.urgencia.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  texto: {
    color: "#fff",
  },
  urgencia: {
    marginTop: 5,
    fontWeight: "bold",
  },
  imagemProblema: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  videoProblema: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#000",
  },
});
