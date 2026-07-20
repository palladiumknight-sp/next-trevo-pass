export const calculatePoints = (
  amount: number,
  level: "bronze" | "silver" | "gold" | "vip",
  campaignMultiplier = 1,
) => {
  const basePoints = Math.trunc(amount);

  const levelMultipliers = {
    bronze: 1,
    silver: 1.2,
    gold: 1.5,
    vip: 2,
  };

  const multiplier = levelMultipliers[level] ?? 1;

  return Math.trunc(basePoints * multiplier * campaignMultiplier);
};
