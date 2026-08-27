// Em desenvolvimento usa a Azure Function local (Etapa 5).
// No Azure Static Web Apps, o caminho relativo /api já faz o proxy.
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:7071/api" : "/api")
