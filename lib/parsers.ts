import type { FinnJobAd, MassagedAndFilteredFinnJobAd } from "./types.ts";

import { getFinnAdId } from "./functions.ts";

export const jobAdParser = (ad: FinnJobAd): MassagedAndFilteredFinnJobAd => {
  const {
    id,
    ad_id,
    heading,
    job_title,
    company_name,
    location,
    published,
    deadline,
    no_of_positions,
    logo,
    image,
  } = ad;

  const parsedId = String(ad_id) || String(id);
  const url = "https://www.finn.no/job/fulltime/ad.html?finnkode=" + parsedId;
  const img1 = logo?.url || "";
  const img2 = image?.url || "";

  const img = img1 || img2 || "";

  console.log(parsedId, heading, company_name, job_title);

  return {
    id: parsedId,
    heading,
    job_title,
    company_name,
    location,
    no_of_positions,
    published,
    deadline,
    url,
    img,
  };
};

import type { FilteredAndMassagedFinnAd, FinnAd } from "./types.ts";

export const saleAdParser = (ad: FinnAd): FilteredAndMassagedFinnAd => {
  const {
    heading,
    location,
    coordinates,
    price,
    timestamp,
    image,
    trade_type,
  } = ad;

  const id = getFinnAdId(ad);
  const nokPrice = price.amount;
  const joinedCoordinates = coordinates.lat + "," + coordinates.lon;
  const url = "https://www.finn.no/bap/forsale/ad.html?finnkode=" + id;
  const img = image?.url || "";
  const date = timestampToDatestring(timestamp);

  return {
    id,
    heading,
    location,
    trade_type,
    date,
    timestamp,
    price: nokPrice,
    coords: joinedCoordinates,
    url,
    img,
  };
};

export function adToMsg(ad: FilteredAndMassagedFinnAd) {
  return "**" + ad.heading + "** i " + ad.location + ": *" + ad.price +
    "* \n" + ad.url;
}

export function timestampToDatestring(dt: number) {
  const date = new Date(dt);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  };
  return date.toLocaleDateString("no-NO", options);
}
