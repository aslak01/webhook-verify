import { adToMsg } from "./parsers.ts";
import type {
  FetchedFinnAds,
  FilteredAndMassagedFinnAd,
  FinnAdBase,
} from "./types.ts";

export const postToWebhook = async (
  ad: FilteredAndMassagedFinnAd,
  webhookUrl: string,
) => {
  const content = { content: adToMsg(ad) };
  const resp = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });

  console.log("posted", resp);
};

export function findUniqueEntries(arr1: string[], arr2: string[]): string[] {
  const combinedArray = [...arr1, ...arr2];

  const uniqueEntries = combinedArray.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  return uniqueEntries;
}

export function getFinnAdId(ad: FinnAdBase): string {
  return ad.ad_id ? String(ad.ad_id) : String(ad.id);
}

export function compareInputToPrevFetch(
  fetched: FetchedFinnAds,
  prev: FinnAdBase[],
) {
  const { docs } = fetched;
  const fetchedAdIds = docs.map(getFinnAdId);
  const prevAdIds = prev.map(getFinnAdId);

  const diff = findUniqueEntries(prevAdIds, fetchedAdIds);

  return docs.filter((ad) => diff.includes(getFinnAdId(ad)));
}
