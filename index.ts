/// <reference path="./env.d.ts" />

import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { isLanguageCodeInBound, languages } from "./utils/languages";
import { getInferenceApi, translate } from "./utils/ulca";

config({ path: ".env" });

const { PORT } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

app.post(
  "/scaler/translate",
  validateRequestBody(
    z.object({
      source_language: z.number().int(),
      content: z.string(),
      target_language: z.number().int(),
    })
  ),
  async (req: Request, res: Response) => {
    const { source_language, content, target_language } = req.body;
    [source_language, target_language].forEach((lang) => {
      if (!isLanguageCodeInBound(lang)) {
        return res.json({
          status_code: 400,
          message: "language code out of bounds",
        });
      }
    });
    try {
      const inferenceData = (
        await getInferenceApi(
          languages[source_language],
          languages[target_language]
        )
      ).data;
      const translatedPayload = (
        await translate(
          languages[source_language],
          languages[target_language],
          inferenceData.pipelineInferenceAPIEndPoint.callbackUrl,
          inferenceData.pipelineInferenceAPIEndPoint.inferenceApiKey,
          inferenceData.pipelineResponseConfig[0].config.serviceId,
          content
        )
      ).data;
      return res.json({
        status_code: 200,
        message: "translated successfully",
        translated_content:
          translatedPayload.pipelineResponse[0].output[0].target,
      });
    } catch (e) {
      console.error(e);
      return res.json({
        status_code: 500,
        message: "An error occured while translating the content.",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
