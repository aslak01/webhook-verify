import { FilteredAndMassagedFinnAd, FinnAd, isFinnAd } from "../types.ts";

import { readInputFile } from "./fs.ts";
import { writeToCSV } from "./csv.ts";
import { compareInputToPrevFetch } from "../functions.ts";
import { emptyDir } from "../imports.ts";
import { adToMsg, saleAdParser as adFilter } from "../parsers.ts";
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
  }

  await emptyDir(prevFetchFilePath);
  await Deno.writeTextFile(prevFetchFilePath, fetchedData.docs);

  // cast input to type
  const verifiedNewAds: FinnAd[] = newAds.filter(isFinnAd).map((obj: FinnAd) =>
    obj
  );

  const processedFileData = verifiedNewAds.filter(removeUnwantedAds).map(
    adFilter,
  );

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
    adFilter,
  );

  await writeToCSV(processedFileData, outputFile, true);

  return fetchedData.ads.length;
}

export async function postToWebhook(
  ad: FilteredAndMassagedFinnAd,
  webhookUrl: string,
) {
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
