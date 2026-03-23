import { Stack } from "expo-router";
import { SalasProvider } from "../context/SalasContext";

export default function Layout() {
  return (
    <SalasProvider>
      <Stack>
        <Stack.Screen
          name="index" 
          options={{ title: "Home" }}
        />
      </Stack>
    </SalasProvider>
  );
}