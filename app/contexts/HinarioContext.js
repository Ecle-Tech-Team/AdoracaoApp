import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const HinarioContext = createContext();

export function HinarioProvider({ children }) {
  const [hinario, setHinario] = useState("HARPA"); // default

  useEffect(() => {
    carregarHinario();
  }, []);

  const carregarHinario = async () => {
    const salvo = await AsyncStorage.getItem("@hinario");
    if (salvo) setHinario(salvo);
  };

  const trocarHinario = async (novoHinario) => {
    setHinario(novoHinario);
    await AsyncStorage.setItem("@hinario", novoHinario);
  };

  return (
    <HinarioContext.Provider value={{ hinario, trocarHinario }}>
      {children}
    </HinarioContext.Provider>
  );
}
