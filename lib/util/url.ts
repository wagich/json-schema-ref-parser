const jsonPointerSlash = /~1/g;
const jsonPointerTilde = /~0/g;

// RegExp patterns to URL-encode special characters in local filesystem paths
const urlEncodePatterns = [
  [/\?/g, "%3F"],
  [/#/g, "%23"],
] as [RegExp, string][];

// RegExp patterns to URL-decode special characters for local filesystem paths
const urlDecodePatterns = [/%23/g, "#", /%24/g, "$", /%26/g, "&", /%2C/g, ",", /%40/g, "@"];

export const parse = (u: string | URL) => new URL(u);

/**
 * Returns resolved target URL relative to a base URL in a manner similar to that of a Web browser resolving an anchor tag HREF.
 *
 * @returns
 */
export function resolve(from: string, to: string) {
  const fromUrl = new URL(from, "resolve://");
  const resolvedUrl = new URL(to, fromUrl);
  const endSpaces = to.match(/(\s*)$/)?.[1] || "";
  if (resolvedUrl.protocol === "resolve:") {
    // `from` is a relative URL.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash + endSpaces;
  }
  return resolvedUrl.toString() + endSpaces;
}

/**
 * Removes the query, if any, from the given path.
 *
 * @param path
 * @returns
 */
export function stripQuery(path: any) {
  const queryIndex = path.indexOf("?");
  if (queryIndex >= 0) {
    path = path.substr(0, queryIndex);
  }
  return path;
}

/**
 * Returns the hash (URL fragment), of the given path.
 * If there is no hash, then the root hash ("#") is returned.
 *
 * @param path
 * @returns
 */
export function getHash(path: undefined | string) {
  if (!path) {
    return "#";
  }
  const hashIndex = path.indexOf("#");
  if (hashIndex >= 0) {
    return path.substring(hashIndex);
  }
  return "#";
}

/**
 * Removes the hash (URL fragment), if any, from the given path.
 *
 * @param path
 * @returns
 */
export function stripHash(path?: string | undefined) {
  if (!path) {
    return "";
  }
  const hashIndex = path.indexOf("#");
  if (hashIndex >= 0) {
    path = path.substring(0, hashIndex);
  }
  return path;
}

/**
 * Converts a $ref pointer to a valid JSON Path.
 *
 * @param pointer
 * @returns
 */
export function safePointerToPath(pointer: any) {
  if (pointer.length <= 1 || pointer[0] !== "#" || pointer[1] !== "/") {
    return [];
  }

  return pointer
    .slice(2)
    .split("/")
    .map((value: any) => {
      return decodeURIComponent(value).replace(jsonPointerSlash, "/").replace(jsonPointerTilde, "~");
    });
}
