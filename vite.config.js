import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.jsx"),
            name: "React Parallax Button",
            fileName: (format) => `archis-parallax-button.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                },
            },
        },
    },
    plugins: [react()],
    server: {port : 3000}
});
