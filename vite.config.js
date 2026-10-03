import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Os testes fixam o fuso de Brasília para que datas locais deem o mesmo resultado
    // em qualquer máquina (inclusive no GitHub Actions, que roda em UTC).
    setupFiles: ["./src/test-setup.js"],
  },
});
