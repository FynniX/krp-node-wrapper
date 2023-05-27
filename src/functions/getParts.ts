export function getParts(arr: string[]): string[][] {
  const parts: string[][] = [];

  while(arr.length !== 0) {
    while(arr[0] === '')
      arr.splice(0, 1);

    const endIndex = arr.findIndex((value, index) => value === '' && arr[index + 1] !== '');
    parts.push(arr.splice(0, endIndex));
  }

  return parts.filter(part => part.length > 0);
}