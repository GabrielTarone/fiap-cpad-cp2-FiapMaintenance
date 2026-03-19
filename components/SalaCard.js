import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SalaCard({ sala, onPress }) {
  function corUrgencia() {
    if (sala.problemas.some((p) => p.urgencia === "alta")) return "#ff4d4d";
    if (sala.problemas.some((p) => p.urgencia === "media")) return "#ffaa00";
    if (sala.problemas.some((p) => p.urgencia === "baixa")) return "#2ecc71";
    return "#333";
  }

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: corUrgencia() }]}
      onPress={onPress}
    >
      <Text style={styles.nome}>{sala.nome}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 6,
  },
  nome: {
    color: "#fff",
    fontSize: 16,
  },
});
