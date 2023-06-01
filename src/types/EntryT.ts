export type EntryT = {
  raceNumber: number;
  name: string;
  kart: EntryKartT;
  guid: string;
  extra: string;
};

export type EntryKartT = {
  name: string;
  shortName: string;
  categories: string[];
}