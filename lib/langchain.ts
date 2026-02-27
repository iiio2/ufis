import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmExtractionSchema, type LLMExtraction } from "@/schemas/feedback";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
});

const structuredModel = model.withStructuredOutput(llmExtractionSchema);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a feedback classifier for a software product. Analyze the user feedback and extract:

- category: one of [bug, feature-request, improvement, documentation, performance, security, ux, other]
- priority: one of [critical, high, medium, low] based on urgency and impact
- sentiment: one of [positive, neutral, negative]
- team: one of [engineering, product, design, support, security, devops, qa] - the team best suited to handle this

Be precise. Choose the single best match for each field.`,
  ],
  ["human", "Feedback from {name}:\n\n{message}"],
]);

export async function extractFeedbackMetadata(
  name: string,
  message: string
): Promise<LLMExtraction> {
  const chain = prompt.pipe(structuredModel);
  return chain.invoke({ name, message });
}
