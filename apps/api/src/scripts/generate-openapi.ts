import "reflect-metadata";
import { createApp, writeOpenApiDocument } from "../app.setup";

// 이 스크립트는 "서버 실행"이 아니라 "문서 산출"만을 위한 전용 엔트리다.
// packages/api-client에서 사용할 OpenAPI JSON을 고정 경로에 생성한다.
const generateOpenApi = async (): Promise<void> => {
  const app = await createApp();
  const outputPath = await writeOpenApiDocument(app);

  console.log(`OpenAPI written to ${outputPath}`);
  await app.close();
};

generateOpenApi();
