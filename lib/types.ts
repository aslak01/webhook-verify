export type FinnAdImage = {
  url: string;
  path: string;
  height?: number;
  width?: number;
  aspect_ratio?: number;
};

export type FinnCoords = {
  lat: number;
  lon: number;
};

export type FinnLabel = {
  id: string;
  text: string;
  type: string;
};

export type FinnPrice = {
  amount: number;
  currency_code: string;
};

export type FinnAdBase = {
  type: string;
  id: string;
  main_search_key: string;
  heading: string;
  location: string;
  image?: FinnAdImage;
  flags: string[];
  timestamp: number;
  coordinates: FinnCoords;
  ad_type: number;
  labels: FinnLabel[];
  canonical_url?: string;
  extras: string[];
  ad_id: number;
};

export type SaleAdNotJobAd = {
  price: FinnPrice;
  image_urls?: string[];
  trade_type: string;
  distance: number;
};

export type FinnAd = FinnAdBase & SaleAdNotJobAd;

export type JobAdNotSaleAd = {
  job_title: string;
  published: number;
  deadline?: number;
  company_name?: string;
  logo?: FinnAdImage;
  no_of_positions?: number;
};

export type FinnJobAd = FinnAdBase & JobAdNotSaleAd;

export type FetchedFinnJobAds = { docs: FinnJobAd[] };

export type FetchedFinnAds = { docs: FinnAdBase[] };

export type AFinnAd = FinnAd | FinnJobAd;

export type FilteredFinnAd = Pick<
  FinnAd,
  "heading" | "location" | "timestamp" | "trade_type"
>;

export type MassagedFinnAd = {
  price: number;
  coords: string;
  id: string;
  url: string;
  img: string;
  date: string;
};

export type FilteredAndMassagedFinnAd =
  & FilteredFinnAd
  & MassagedFinnAd;

export type FilteredFinnJobAd = Pick<
  FinnJobAd,
  | "id"
  | "ad_id"
  | "heading"
  | "job_title"
  | "company_name"
  | "location"
  | "published"
  | "deadline"
  | "no_of_positions"
  | "logo"
  | "image"
>;

export type MassagedFinnJobAd = {
  id: string;
  img: string;
  url: string;
};

export type MassagedAndFilteredFinnJobAd =
  & Pick<
    FilteredFinnJobAd,
    | "job_title"
    | "heading"
    | "company_name"
    | "location"
    | "published"
    | "deadline"
    | "no_of_positions"
  >
  & MassagedFinnJobAd;

export function isFilteredAndMassagedFinnAd<
  T extends FilteredAndMassagedFinnAd,
>(
  obj: T,
): T {
  if (
    typeof obj.heading === "string" &&
    typeof obj.location === "string" &&
    typeof obj.date === "string" &&
    typeof obj.price === "number" &&
    typeof obj.coords === "string" &&
    typeof obj.id === "string" &&
    typeof obj.url === "string" &&
    typeof obj.img === "string"
  ) {
    return obj;
  } else {
    throw new Error("Object is not of FilteredAndMassagedFinnAd type");
  }
}

export function isFinnAd<T extends FinnAd>(obj: unknown): obj is T {
  return (
    typeof obj === "object" && obj !== null &&
    (("id" in obj && typeof obj.id === "string") ||
      ("ad_id" in obj && typeof obj.ad_id === "number")) &&
    "heading" in obj && typeof obj.heading === "string" &&
    "location" in obj && typeof obj.location === "string" &&
    "timestamp" in obj && typeof obj.timestamp === "number" &&
    "trade_type" in obj && typeof obj.trade_type === "string" &&
    "image" in obj && typeof obj.image === "object" &&
    "price" in obj && typeof obj.price === "object"
  );
}
