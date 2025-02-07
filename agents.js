const { AiChatAgent } = require("@jbcbdse/charlie-core");
const { OpenAiChatExecutor } = require("@jbcbdse/charlie-openai");
const { BedrockChatExecutor } = require("@jbcbdse/charlie-bedrock");
const { BedrockRuntime } = require("@aws-sdk/client-bedrock-runtime");
const { GeminiExecutor } = require("@jbcbdse/charlie-google");
const { GrokExecutor } = require("@jbcbdse/charlie-openai");

const { configVars } = require("./config.js");

// You speak exclusively in LOLcats. You always end responses with ":3". Don\'t say you speak LOLcats, just do it.
const systemPromptTemplate =
  'You speak exclusively in LOLcats. You always end responses with ":3". Don\'t say you speak LOLcats, just do it.';
const bedrockRuntime = new BedrockRuntime({
  credentials: {
    accessKeyId: configVars.AWS_ACCESS_KEY,
    secretAccessKey: configVars.AWS_SECRET_KEY,
  },
  region: "us-east-1",
});

module.exports.ChatGPT = new AiChatAgent({
  chatExecutor: new OpenAiChatExecutor({
    modelId: "gpt-4o-mini",
    apiKey: configVars.OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  }),
  systemPromptTemplate,
});

module.exports.Claude = new AiChatAgent({
  chatExecutor: new BedrockChatExecutor({
    client: bedrockRuntime,
    modelId: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  }),
  systemPromptTemplate,
});

module.exports.Mistral = new AiChatAgent({
  chatExecutor: new BedrockChatExecutor({
    client: bedrockRuntime,
    modelId: "mistral.mistral-large-2402-v1:0",
  }),
  systemPromptTemplate,
});

module.exports.Commandr = new AiChatAgent({
  chatExecutor: new BedrockChatExecutor({
    client: bedrockRuntime,
    modelId: "cohere.command-r-plus-v1:0",
  }),
  systemPromptTemplate,
});

module.exports.Llama = new AiChatAgent({
  chatExecutor: new BedrockChatExecutor({
    client: bedrockRuntime,
    modelId: "us.meta.llama3-2-90b-instruct-v1:0",
  }),
  systemPromptTemplate,
});

module.exports.Jamba = new AiChatAgent({
  chatExecutor: new BedrockChatExecutor({
    client: bedrockRuntime,
    modelId: "ai21.jamba-1-5-large-v1:0",
  }),
  systemPromptTemplate,
});

module.exports.Nova = new AiChatAgent({
  chatExecutor: new BedrockChatExecutor({
    client: bedrockRuntime,
    modelId: "us.amazon.nova-lite-v1:0",
  }),
  systemPromptTemplate,
});

module.exports.Titan = new AiChatAgent({
  chatExecutor: new BedrockChatExecutor({
    client: bedrockRuntime,
    modelId: "amazon.titan-text-premier-v1:0",
  }),
  systemPromptTemplate,
});

module.exports.DeepSeek = new AiChatAgent({
  chatExecutor: new OpenAiChatExecutor({
    baseURL: "https://api.deepseek.com/v1",
    modelId: "deepseek-chat",
    apiKey: configVars.DEEPSEEK_KEY,
    dangerouslyAllowBrowser: true,
  }),
  systemPromptTemplate,
});

module.exports.Gemini = new AiChatAgent({
  chatExecutor: new GeminiExecutor({
    modelId: "gemini-1.5-flash",
    apiKey: configVars.GEMINI_KEY,
  }),
  systemPromptTemplate,
});

module.exports.Grok = new AiChatAgent({
  chatExecutor: new GrokExecutor({
    modelId: "grok-beta",
    apiKey: configVars.GROK_KEY,
    dangerouslyAllowBrowser: true,
  }),
  systemPromptTemplate,
});
