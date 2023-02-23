  import type { FinnAd } from "./types.ts";

export const postToWebhook = async (ad: FinnAd, webhookUrl: string) => {
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
};

const adToMsg = (ad: FinnAd) => {
  return "**" + ad.heading + "** i " + ad.location + ": *" + ad.price.amount +
    "* \n" + ad.ad_link;
};
