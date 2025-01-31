/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START complete-example]
// [START imports]
// [START import-trigger]
const {onCallGenkit} = require("firebase-functions/v2/https");
// [END import-trigger]
// [START import-params]
const {defineSecret} = require("firebase-functions/params");
// [END import-params]

// [START import-genkit]
// Dependencies for Genkit
const {gemini15Flash, googleAI} = require("@genkit-ai/googleai");
const {genkit, z} = require("genkit");
// [END import-genkit]
// [END imports]

// [START define-secret]
// Store the Gemini API key in Cloud Secret Manager
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");
// [END define-secret]

// [START flow]
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

const jokeTeller = ai.defineFlow({
  name: "jokeTeller",
  inputSchema: z.string().nullable(),
  outputSchema: z.string(),
  streamSchema: z.string(),
}, async (jokeType = "knock-knock", response) => {
  const prompt = `Tell me a ${jokeType} joke.`;
  const {stream, response: aiResponse} = ai.generateStream(prompt);

  // Loop over the `stream` async iterable to
  // send new words of the AI response
  // to the client as they're generated
  for await (const chunk of stream) {
    response.sendChunk(chunk.text);
  }

  // Return the full response
  return (await aiResponse).text;
},
);
// [END flow]

// [START trigger]
exports.tellJoke = onCallGenkit({
  // [START bind-secrets]
  // bind the Gemini API key secret parameter  to the function
  secrets: [apiKey],
  // [END bind-secrets]
  // [START auth-policy]
  // protect your endpoint with authPolicy
  authPolicy: (auth) => !!auth?.token.email_verified,
  // [END auth-policy]
},
// pass in the genkit flow
jokeTeller,
);
// [END trigger]
// [END complete-example]
