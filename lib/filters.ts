import { FinnAd } from "./types.ts";

const unwantedList = [
  "bialetti",
  "integrert",
  "automatisk",
  "kapsel",
  "kapsler",
  "pod",
  "nespresso",
  "nescafe",
  "aeropress",
  "moka",
  "tyrkisk",
];

function noneIncluded(arr1: string[], arr2: string[]): boolean {
  return arr1.every((str1) =>
    !arr2.some((str2) => str2.includes(str1)) && !arr2.includes(str1)
  );
}

function stripDiacritics(str: string): string {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function removeUnwantedAds(ad: FinnAd): boolean {
  const desc = ad.heading.replace('"', "");
  const descArr = desc.split(" ").map((s) => s.toLowerCase()).map(
    stripDiacritics,
  );
  const verdict = noneIncluded(unwantedList, descArr) &&
    ad.trade_type === "Til salgs";
  return verdict;
}
