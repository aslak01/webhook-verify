export async function readInputFile(inputFile: string) {
  try {
    const inputFileInfo = await Deno.stat(inputFile);

    if (inputFileInfo.isFile !== true) {
      console.error(
        `The provided "${inputFile}" is not a valid file.`,
      );
      return;
    }

    const inputFileContent = await Deno.readTextFile(inputFile);

    return inputFileContent ? JSON.parse(inputFileContent) : [];
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      console.error("file does not exists");
    }
  }
  return [];
}
