import { Stack } from "expo-router";
import { SalasProvider } from "../context/SalasContext";

export default function Layout() {
  return (
    <SalasProvider>
      <Stack />
    </SalasProvider>
  );
}