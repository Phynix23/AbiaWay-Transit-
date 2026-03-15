/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_MAP_TILE_URL: string
  readonly VITE_ENABLE_MOCKS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}