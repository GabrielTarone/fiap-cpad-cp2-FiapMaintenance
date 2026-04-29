import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SalasContext = createContext();

const STORAGE_KEY = "@salas";

export function SalasProvider({ children }) {
  const [salas, setSalas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 🔹 CARREGAR ao iniciar
  useEffect(() => {
    carregarSalas();
  }, []);

  async function carregarSalas() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        setSalas(JSON.parse(data));
      } else {
        // dados iniciais (primeira execução)
        const salasIniciais = [
          { id: "1", nome: "Lab 101", problemas: [] },
          { id: "2", nome: "Sala 202", problemas: [] },
        ];

        setSalas(salasIniciais);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(salasIniciais));
      }
    } catch (error) {
      console.log("Erro ao carregar salas:", error);
    } finally {
      setCarregando(false);
    }
  }

  // 🔹 SALVAR automaticamente quando mudar
  useEffect(() => {
    if (!carregando) {
      salvarSalas();
    }
  }, [salas]);

  async function salvarSalas() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(salas));
    } catch (error) {
      console.log("Erro ao salvar salas:", error);
    }
  }

  // 🔹 Funções existentes (mantidas)

  function adicionarSala(nome) {
    const novaSala = {
      id: Date.now().toString(),
      nome,
      problemas: [],
    };

    setSalas((prev) => [...prev, novaSala]);

    return novaSala.id;
  }

  function adicionarProblema(idSala, problema) {
    setSalas((prev) =>
      prev.map((sala) =>
        sala.id === idSala
          ? { ...sala, problemas: [...sala.problemas, problema] }
          : sala,
      ),
    );
  }

  function removerProblema(idSala, indexProblema) {
    setSalas((prev) =>
      prev.map((sala) =>
        sala.id === idSala
          ? {
              ...sala,
              problemas: sala.problemas.filter(
                (_, index) => index !== indexProblema,
              ),
            }
          : sala,
      ),
    );
  }

  function removerSala(idSala) {
    setSalas((prev) => prev.filter((sala) => sala.id !== idSala));
  }

  function finalizarProblema(idSala, computador) {
    setSalas((prev) =>
      prev.map((sala) =>
        sala.id === idSala
          ? {
              ...sala,
              problemas: sala.problemas.filter(
                (p) => p.computador !== computador,
              ),
            }
          : sala,
      ),
    );
  }

  // 🔹 Loading global (IMPORTANTE)
  if (carregando) {
    return null; // evita render antes de carregar
  }

  return (
    <SalasContext.Provider
      value={{
        salas,
        adicionarSala,
        adicionarProblema,
        removerSala,
        removerProblema,
        finalizarProblema,
      }}
    >
      {children}
    </SalasContext.Provider>
  );
}
