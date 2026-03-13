import Joi from "joi";

// 이 스키마는 앱 시작 전에 환경 변수 모양을 검사한다.
// 예를 들어 DATABASE_URL이 빠졌거나 PORT 형식이 이상하면, 서버를 띄우기 전에 바로 실패시킨다.
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().port().default(4000),
  API_PREFIX: Joi.string().default("api"),
  API_CORS_ORIGINS: Joi.string().allow("").default("http://localhost:3000,http://localhost:3001"),
  SWAGGER_PATH: Joi.string().default("api/docs"),
  OPENAPI_OUTPUT_PATH: Joi.string().default("../../packages/api-client/openapi/openapi.json"),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ["postgres", "postgresql"] })
    .default("postgresql://postgres:postgres@127.0.0.1:5432/pickup_service?schema=public"),
  REDIS_URL: Joi.string().uri({ scheme: ["redis"] }).default("redis://127.0.0.1:6379"),
  SESSION_SECRET: Joi.string().min(8).default("change-me"),
  SESSION_NAME: Joi.string().default("pickup.sid"),
  SESSION_DOMAIN: Joi.string().allow("").optional(),
  SESSION_SECURE: Joi.boolean().default(false),
  SESSION_HTTP_ONLY: Joi.boolean().default(true),
  SESSION_SAME_SITE: Joi.string().valid("lax", "strict", "none").default("lax"),
  SESSION_MAX_AGE_MS: Joi.number().integer().positive().default(1000 * 60 * 60 * 24 * 14)
});
