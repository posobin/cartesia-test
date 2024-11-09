import Cartesia from "@cartesia/cartesia-js";

void app();

async function app() {
  const cartesia = new Cartesia({
      apiKey: process.env.CARTESIA_API_KEY,
  });

  // Initialize the WebSocket. Make sure the output format you specify is supported.
  const websocket = cartesia.tts.websocket({
      container: "raw",
      encoding: "pcm_f32le",
      sampleRate: 44100
  });

  try {
      await websocket.connect();
  } catch (error) {
      console.error(`Failed to connect to Cartesia: ${error}`);
  }

  const contextOptions = {
      context_id: "my-context",
      model_id: "sonic-english",
      voice: {
          mode: "id",
          id: "a0e99841-438c-4a64-b679-ae501e7d6091",
      } as const,
  }

  // Initial request on the context uses websocket.send().
  // This response object will aggregate the results of all the inputs sent on the context.
  const response = await websocket.send({
      ...contextOptions,
      transcript: "Hello, world!",
  });

  // Subsequent requests on the same context use websocket.continue().
  await websocket.continue({
      ...contextOptions,
      transcript: " How are you today?",
  });

  for await (const message of response.events('message')) {
      // Raw message.
      console.log("Received message:", message);
  }
}
