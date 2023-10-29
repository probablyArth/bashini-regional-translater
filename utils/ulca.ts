import axios from "axios";

export const getInferenceApi = (
  sourceLanguage: string,
  targetLanguage: string
) => {
  return axios.post<{
    pipelineInferenceAPIEndPoint: {
      callbackUrl: string;
      inferenceApiKey: {
        name: string;
        value: string;
      };
    };
    pipelineResponseConfig: {
      config: {
        serviceId: string;
      };
    }[];
  }>(
    "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline",
    {
      pipelineTasks: [
        {
          taskType: "translation",
          config: {
            language: {
              sourceLanguage,
              targetLanguage,
            },
          },
        },
      ],
      pipelineRequestConfig: {
        pipelineId: "64392f96daac500b55c543cd",
      },
    },
    {
      headers: {
        ulcaApiKey: process.env.ULCA_API_KEY,
        userId: process.env.ULCA_USER_ID,
      },
    }
  );
};

export const translate = (
  sourceLanguage: string,
  targetLanguage: string,
  callbackUrl: string,
  auth: { name: string; value: string },
  serviceId: string,
  source: string
) => {
  const headers = {};
  headers[auth.name] = auth.value;

  return axios.post<{ pipelineResponse: { output: { target }[] }[] }>(
    callbackUrl,
    {
      pipelineTasks: [
        {
          taskType: "translation",
          config: {
            language: {
              sourceLanguage,
              targetLanguage,
            },
            serviceId,
          },
        },
      ],
      inputData: {
        input: [
          {
            source,
          },
        ],
      },
    },
    { headers }
  );
};
