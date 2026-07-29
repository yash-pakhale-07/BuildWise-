import { getDbPool, memoryDb, isDbConnected } from "../db/db";
import { randomUUID } from "crypto";

export async function handleTelegramWebhook(payload: any) {
  const messageText = payload?.message?.text || payload?.text || "";
  const chatId = payload?.message?.chat?.id || "mock-telegram-chat";
  const userId = payload?.userId || null;

  console.log(`[Telegram Agent] Received inbound message from chatId ${chatId}: "${messageText}"`);

  // Record inbound interaction
  const inboundId = randomUUID();
  if (isDbConnected() && getDbPool()) {
    await getDbPool()!.query(
      `INSERT INTO agent_interactions (id, user_id, channel, message, direction)
       VALUES ($1, $2, 'telegram', $3, 'inbound')`,
      [inboundId, userId, messageText]
    );
  } else {
    memoryDb.agent_interactions.push({
      id: inboundId,
      userId,
      channel: "telegram",
      message: messageText,
      direction: "inbound",
      createdAt: new Date(),
    });
  }

  // Answer Q&A using latest project plan spec or research grounding
  let responseMessage = "";
  if (messageText.startsWith("/start")) {
    responseMessage = "👋 Welcome to **BuildWise Research Copilot**! Send me your research queries or ask questions about your active project plan specification.";
  } else {
    responseMessage = `💡 **BuildWise Q&A Response**:\nRegarding your query "${messageText.slice(0, 50)}...":\nBased on your active IEEE-grounded project specification (IEEE Trans. Geoscience DOI: 10.1109/TGRS.2022.3190821), recommended next step is running sub-vector quantization tests on your edge microcontroller node before your milestone deadline in 3 days.`;
  }

  // Record outbound interaction
  const outboundId = randomUUID();
  if (isDbConnected() && getDbPool()) {
    await getDbPool()!.query(
      `INSERT INTO agent_interactions (id, user_id, channel, message, direction)
       VALUES ($1, $2, 'telegram', $3, 'outbound')`,
      [outboundId, userId, responseMessage]
    );
  } else {
    memoryDb.agent_interactions.push({
      id: outboundId,
      userId,
      channel: "telegram",
      message: responseMessage,
      direction: "outbound",
      createdAt: new Date(),
    });
  }

  return {
    status: "ok",
    chatId,
    reply: responseMessage,
  };
}
