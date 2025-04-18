import type { ChatCompletionInput, ChatCompletionOutput } from "@huggingface/tasks";
import { InferenceOutputError } from "../../lib/InferenceOutputError";
import type { BaseArgs, Options } from "../../types";
import { innerRequest } from "../../utils/request";

/**
 * Use the chat completion endpoint to generate a response to a prompt, using OpenAI message completion API no stream
 */
export async function chatCompletion(
	args: BaseArgs & ChatCompletionInput,
	options?: Options
): Promise<ChatCompletionOutput> {
	const { data: res } = await innerRequest<ChatCompletionOutput>(args, {
		...options,
		task: "text-generation",
		chatCompletion: true,
	});
	const isValidOutput =
		typeof res === "object" &&
		Array.isArray(res?.choices) &&
		typeof res?.created === "number" &&
		typeof res?.id === "string" &&
		typeof res?.model === "string" &&
		/// Together.ai and Nebius do not output a system_fingerprint
		(res.system_fingerprint === undefined ||
			res.system_fingerprint === null ||
			typeof res.system_fingerprint === "string") &&
		typeof res?.usage === "object";

	if (!isValidOutput) {
		throw new InferenceOutputError("Expected ChatCompletionOutput");
	}
	return res;
}
