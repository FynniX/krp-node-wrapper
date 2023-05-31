const partsVariants = [
  'EVENT',
  'ENTRY',
  'ENTRYREMOVE',
  'SESSION',
  'SESSIONSTATUS',
  'WEATHER',
  'SESSIONENTRY',
  'DRIVERSTATUS',
  'BESTLAP',
  'LASTLAP',
  'PENALTY',
  'LAP',
  'SPLIT',
  'SPEED',
  'CLASSIFICATION',
  'CHALLENGEDATA',
  'TRACKDATA',
  'TRACKSEGMENT',
  'TRACKPOSITION',
  'CONTACT',
  'END',
]

export function getParts(arr: string[]): string[][] {
  const parts: string[][] = [];

  while(arr.length > 0) {
    const nextPartIndex = arr.findIndex((value, index) => partsVariants.indexOf(value) !== -1 && index > 0);
    const deleteAmount = nextPartIndex === -1 ? arr.length - 1 : nextPartIndex - 1;
    parts.push(arr.splice(0, deleteAmount));
    arr.splice(0, 1);
  }

  return parts.filter(part => part.length > 0);
}