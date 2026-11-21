export function defineEvent(event: "purchase" | "reward" | "campaign") {
  const eventMap = {
    purchase: { source: "purchase", type: "earn" },
    reward: { source: "reward", type: "redeem" },
    campaign: { source: "campaign", type: "earn" },
  } as const;

  return eventMap[event];
}
