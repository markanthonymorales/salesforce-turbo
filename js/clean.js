export function cleanUrl(dirtyUrl) {
  let decoded = dirtyUrl;
  let prev;
  do {
    prev = decoded;
    decoded = decodeURIComponent(prev);
  } while (decoded !== prev);
  return decoded;
}

export function cleanQuery(query) {
    return encodeURIComponent(query.trim());
}