import { createContext, useState } from "react";

export const SalasContext = createContext();

export function SalasProvider({ children }) {
  const [salas, setSalas] = useState([
    { id: "1", nome: "Lab 101", problemas: [] },
    { id: "2", nome: "Sala 202", problemas: [] },
  ]);

  // Adicionar sala
  function adicionarSala(nome) {
    const novaSala = {
      id: Date.now().toString(),
      nome,
      problemas: [],
    };

    setSalas((prev) => [...prev, novaSala]);

    return novaSala.id;
  }

  // Adicionar problema
  function adicionarProblema(idSala, problema) {
    setSalas((prev) =>
      prev.map((sala) =>
        sala.id === idSala
          ? { ...sala, problemas: [...sala.problemas, problema] }
          : sala,
      ),
    );
  }

  // Remover problema
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

  // Remover sala por escolha (versão antiga)
  function removerSala(idSala) {
    setSalas((prev) => prev.filter((sala) => sala.id !== idSala));
  }

  // Remover sala por nome (versão antiga)
  function removerSalaPorNome(nome) {
    setSalas((prev) => prev.filter((sala) => sala.nome !== nome));
  }

  // Finalizar problema
  // Finalizar problema (remove da lista)
  function finalizarProblema(idSala, computador) {
    setSalas((prev) =>
      prev.map((sala) =>
        sala.id === idSala
          ? {
            ...sala,
            problemas: sala.problemas.filter(
              (p) => p.computador !== computador
            ),
          }
          : sala
      )
    );
  }

  return (
    <SalasContext.Provider
      value={{
        salas,
        adicionarSala,
        adicionarProblema,
        removerSalaPorNome,
        removerSala, // nova versão
        removerProblema, // antiga versão
        finalizarProblema, // nova função
      }}
    >
      {children}
    </SalasContext.Provider>
  );
}
