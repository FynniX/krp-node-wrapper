export function isLapped(input: string) {
  let regex = /L [0-9]+/i;
  return regex.test(input);
}