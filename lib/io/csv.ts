import { CsvStringifyStream, parseCsv } from "../imports.ts";
import { AFinnAd } from "../types.ts";

export async function readCsv(
  file: string,
) {
  const f = await Deno.readTextFile(file);
  const data = parseCsv(f, { skipFirstRow: true });
  return data;
}

export async function writeToCSV(
  data: Record<string, string | number>[],
  outfile: string,
  useHeaders = true,
) {
  const f = await Deno.open(outfile, {
    write: true,
    create: true,
  });

  const readable = ReadableStream.from(data);

  let opts;

  if (useHeaders) {
    const columns = Object.keys(data[0]);
    opts = { columns };
  }

  await readable.pipeThrough(new CsvStringifyStream(opts))
    .pipeThrough(new TextEncoderStream()).pipeTo(f.writable);
}

export async function writeJson(
  data: AFinnAd[],
  outfile: string,
) {
  await Deno.writeTextFile(outfile, JSON.stringify(data));
}
