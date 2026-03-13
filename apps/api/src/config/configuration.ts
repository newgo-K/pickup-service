export type SameSiteOption = "lax" | "strict" | "none";

// 환경 변수는 전부 문자열로 들어오기 때문에
// 실제 앱에서 쓰기 좋은 타입으로 바꿔주는 작은 파서들이다.
const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value === "true";
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseList = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

// configuration()은 ConfigModule이 읽는 "정규화된 설정 객체"를 만든다.
// process.env를 코드 전체에서 직접 읽지 않고, 의미 있는 묶음(app/database/redis/session)으로 바꿔 쓴다.
export const configuration = () => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: parseNumber(process.env.PORT, 4000),
    apiPrefix: process.env.API_PREFIX ?? "api",
    corsOrigins: parseList(process.env.API_CORS_ORIGINS),
    swaggerPath: process.env.SWAGGER_PATH ?? "api/docs",
    openApiOutputPath:
      process.env.OPENAPI_OUTPUT_PATH ?? "../../packages/api-client/openapi/openapi.json"
  },
  database: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/pickup_service?schema=public"
  },
  redis: {
    url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379"
  },
  session: {
    secret: process.env.SESSION_SECRET ?? "change-me",
    name: process.env.SESSION_NAME ?? "pickup.sid",
    domain: process.env.SESSION_DOMAIN || undefined,
    secure: parseBoolean(process.env.SESSION_SECURE, false),
    httpOnly: parseBoolean(process.env.SESSION_HTTP_ONLY, true),
    sameSite: (process.env.SESSION_SAME_SITE ?? "lax") as SameSiteOption,
    maxAgeMs: parseNumber(process.env.SESSION_MAX_AGE_MS, 1000 * 60 * 60 * 24 * 14)
  }
});
