import { FinnAd } from "./types.ts";

const unwantedList = [
  "bialetti",
  "integrert",
  "automatisk",
  "kapsel",
  "nespresso",
  "nescafe",
  "aeropress",
];

export function removeUnwantedAds(ad: FinnAd): boolean {
  return ad.heading.split(" ").every((str: string) =>
    unwantedList.includes(str) === false
  ) && ad.trade_type === "Til salgs";
}
