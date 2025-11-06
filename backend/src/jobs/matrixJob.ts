import { format, subDays } from "date-fns";
import { fillArchivedMessages } from "../scripts/fillArchivedMessages.js";
import { processBatchEmbeddings } from "../scripts/generateEmbeddingsBatch.js";

await main();

const ROOMS = [
  {
    id: "!ddsEwXlCWnreEGuqXZ:polkadot.io",
    archiveUrl:
      "https://paritytech.github.io/matrix-archiver/archive/_21ddsEwXlCWnreEGuqXZ_3Apolkadot.io/index.html",
  },
  {
    id: "!wBOJlzaOULZOALhaRh:polkadot.io",
    archiveUrl:
      "https://paritytech.github.io/matrix-archiver/archive/_21wBOJlzaOULZOALhaRh_3Apolkadot.io/index.html",
  },
  {
    id: "!ksYpYHcVftKsUAsdMa:matrix.org",
    archiveUrl:
      "https://paritytech.github.io/matrix-archiver/archive/_21ksYpYHcVftKsUAsdMa_3Amatrix.org/index.html",
  },
];

async function main() {
  console.log("Running matrix message fetch job at", new Date().toISOString());
  try {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const yesterdayStr = format(yesterday, "yyyy-MM-dd");

    await fillArchivedMessages(ROOMS, yesterdayStr, yesterdayStr);
    await processBatchEmbeddings();
    console.log("Message fetch job completed successfully");
  } catch (error) {
    console.error("Error in message fetch job:", error);
  }
}
