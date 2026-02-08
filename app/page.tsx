"use client";

import { Conversation, PromptInput } from "../components/ai-elements";
import { Canvas } from "../components/ai-elements";

export default function Page() {
  return (
    <Conversation endpoint="/api/chat" className="flex flex-col">
      {(messages) => (
        <>
          <Canvas className="flex grow" nodes={parseMessagesToNodes(messages)} />
          <PromptInput />
        </>
      )}
    </Conversation>
  );
}

// Example parser converting messages to canvas nodes
function parseMessagesToNodes(messages) {
  return messages.map((msg, i) => ({
    id: `${i}`,
    type: "default",
    position: { x: 10, y: i * 100 },
    data: { label: msg.content },
  }));
}
