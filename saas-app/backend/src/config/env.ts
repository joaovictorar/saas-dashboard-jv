import "dotenv/config";

// process.env.X tem tipo `string | undefined`. Validar aqui, uma vez,
// deixa o resto do código trabalhar com `string` e falha cedo se faltar
// alguma variável no .env ou no Render.
function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const JWT_SECRET = requireEnv("JWT_SECRET");
export const MONGO_URI = requireEnv("MONGO_URI");
export const PORT = Number(process.env.PORT) || 3000;
