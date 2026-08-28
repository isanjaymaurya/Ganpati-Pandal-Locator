/** Shape of a single Ganpati pandal record as parsed from the CSV source. */
export type GanpatiPandal = {
  name: string;
  latitude: string;
  longitude: string;
  location: string;
  gmap_link: string;
  image_url: string;
  is_famous: string;
};

/** @deprecated Use `GanpatiPandal` instead. */
export type IGanpatiPandal = GanpatiPandal;
