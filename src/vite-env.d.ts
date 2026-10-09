/// <reference types="vite/client" />

// Variables d'environnement exposées au navigateur par Vite
interface ImportMetaEnv {
  /** URL de base du back, sans slash final (ex. https://mael-llado.com) */
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
