/** Shape of a single Ganpati pandal record as parsed from the CSV source. */
export type GanpatiPandal = {
  name: string;
  latitude: string;
  longitude: string;
  location: string;
  nearby_station: string;
  gmap_link: string;
  image_url: string;
  is_famous: boolean;
};

/** A persisted favourite pandal entry stored in Redux + localStorage. */
export interface FavouritePandal {
  name: string;
  lat: number;
  lng: number;
}
