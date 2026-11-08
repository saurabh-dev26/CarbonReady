export interface NugenMessage {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

export interface NugenChatCompletionRequest {
  model: string;
  messages: NugenMessage[];
  temperature?: number;
  max_tokens?: number;
  prompt_truncate_len?: number;
  stream?: boolean;
}

export interface NugenChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: NugenMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  confidence_score?: number;
}

export type NugenDeploymentStatus =
  | "READY"
  | "DEPLOYING"
  | "DEPLOYED"
  | "UNDEPLOYING"
  | "FAILED"
  | "UNKNOWN";

export interface NugenAlignedModelSummary {
  model_id: string;
  model_name: string;
  base_model_id: string;
  base_model_name?: string;
  alignment_id: string;
  deployment_status: NugenDeploymentStatus;
  created_at?: string;
}

export interface NugenListAlignedModelsResponse {
  domain_aligned_models?: NugenAlignedModelSummary[];
  models?: NugenAlignedModelSummary[];
}

export interface NugenModelVerificationResult {
  isConfigured: boolean;
  modelId: string | null;
  exists: boolean;
  isAlignedModel: boolean;
  deploymentStatus: NugenDeploymentStatus | null;
  isReadyForInference: boolean;
  statusMessage: string;
  modelName?: string;
}

export type TelemetrySource = "voice" | "text" | "manual_entry" | "demo_preset";

export interface ExtractedShopfloorEntities {
  // Physical measurements — strictly nullable if not reported
  heatsCount?: number | null;
  crudeBilletsProducedMt?: number | null;
  scrapMt?: number | null;
  spongeIronDriMt?: number | null;
  electricityKwh?: number | null;
  cokeConsumedMt?: number | null;
  reheatNaturalGasNm3?: number | null;

  // Metrology & Audit Trail
  languageDetected: "hi" | "mr" | "en";
  transcriptionConfidenceScore?: number | null;
  aiModelConfidenceScore?: number | null;
  confidenceScorePct: number; // normalized display score
  dataCompletenessPct: number; // strictly derived from non-null fields
  missingParameters: string[];
  explanation: string;
  rawTextSpoken: string;
  translatedEnglish: string;
  source: TelemetrySource;
  isDemoData: boolean;
  confirmedByManufacturer?: boolean;
}
