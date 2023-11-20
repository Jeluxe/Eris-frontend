import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: true,
		proxy: {
			"^/api": {
				target: 'http://localhost:4000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			}
		},
		hmr: {
			protocol: "ws",
			host: "localhost"
		}
	},
	plugins: [react()]
});
