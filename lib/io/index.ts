import { FilteredAndMassagedFinnAd, FinnAd, isFinnAd } from "../types.ts";

import { readInputFile } from "./fs.ts";
import { readCsv, writeToCSV } from "./csv.ts";
import {
  compareInputToPrevFetch,
  findUniqueEntries,
  getFinnAdId,
} from "../functions.ts";
import { emptyDir } from "../imports.ts";
import { adToMsg, saleAdParser } from "../parsers.ts";
import { removeUnwantedAds } from "../filters.ts";

export * from "./fs.ts";
export * from "./csv.ts";

type FileReferences = {
  inputFile: string;
  inputFilePath: string;
  prevFetchFile: string;
  prevFetchFilePath: string;
  outputFile: string;
};

export async function processAds(
  files: FileReferences,
  webhookPath: string,
): Promise<number> {
  const {
    inputFile,
    inputFilePath,
    prevFetchFile,
    prevFetchFilePath,
    outputFile,
  } = files;
  const fetchedData = await readInputFile(inputFile);
  const prevFetchData = await readInputFile(prevFetchFile);

  const newAds = compareInputToPrevFetch(fetchedData, prevFetchData);

  if (!newAds || !newAds.length || newAds.length < 1) {
    console.log("No new ads");
    await emptyDir(inputFilePath);
    console.log("cleared most recent fetch");
    await emptyDir(prevFetchFilePath);
    await Deno.writeTextFile(prevFetchFile, fetchedData.docs);
    console.log("Wrote found entries to previous fetch file");
    return 0;
  }

  await emptyDir(prevFetchFilePath);
  await Deno.writeTextFile(prevFetchFile, JSON.stringify(fetchedData.docs));

  const existingData = await readCsv(outputFile);
  const existingDataIds = existingData.map((ad) => ad.id ? ad.id : "");
  const newAdIds = newAds.map(getFinnAdId);

  const diff = findUniqueEntries(existingDataIds, newAdIds);

  if (!diff || diff.length === 0) {
    console.log("no new ads");
    return 0;
  }

  const reallyNewAds = newAds.filter((ad) => diff.includes(getFinnAdId(ad)));

  // cast input to type
  const verifiedNewAds: FinnAd[] = reallyNewAds.filter(isFinnAd).map((
    obj: FinnAd,
  ) => obj);

  const processedFileData = verifiedNewAds.filter(removeUnwantedAds).map(
    saleAdParser,
  );

  if (!processedFileData || processedFileData.length < 1) {
    console.log("No new ads after filtering");
    return 0;
  }

  // console.log(processedFileData);

  await writeToCSV(processedFileData, outputFile);

  if (webhookPath !== "no") {
    for (const ad of processedFileData) {
      await postToWebhook(ad, webhookPath);
    }
  }
  return fetchedData.length;
}

export async function initCSVfromJson(
  inputFile: string,
  outputFile: string,
): Promise<number> {
  const fetchedData = await readInputFile(inputFile);

  const processedFileData = fetchedData.ads.filter(removeUnwantedAds).map(
    saleAdParser,
  );

  await writeToCSV(processedFileData, outputFile, true);

  return fetchedData.ads.length;
}

export async function postToWebhook(
  ad: FilteredAndMassagedFinnAd,
  webhookUrl: string,
) {
  if (webhookUrl === "console") {
    console.log(adToMsg(ad));
    return;
  }
  const content = { content: adToMsg(ad) };
  const resp = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  console.log(resp);
  return resp;
}
