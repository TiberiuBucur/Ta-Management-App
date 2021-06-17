const nub = <T>(arr: T[]): T[] =>
  [...new Set(arr.map(e => JSON.stringify(e)))].map(elem => JSON.parse(elem));

export default nub;
