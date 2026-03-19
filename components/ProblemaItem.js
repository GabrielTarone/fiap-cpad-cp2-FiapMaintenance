import { StyleSheet, Text, View } from "react-native";

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
  texto: { color: "#fff" },
  urgencia: {
    marginTop: 5,
    fontWeight: "bold",
  },
});
