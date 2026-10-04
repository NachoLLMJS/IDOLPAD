import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function tsxFiles(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory() ? tsxFiles(path) : path.endsWith(".tsx") ? [path] : [];
  });
}

describe("user-facing copy", () => {
  it("does not end visible text or UI message strings with full stops", () => {
    const files = [...tsxFiles(join(process.cwd(), "src", "app")), ...tsxFiles(join(process.cwd(), "src", "components"))];
    const violations = files.flatMap((file) => {
      const source = readFileSync(file, "utf8");
      const jsxText = [...source.matchAll(/>([^<>{}\n]+\.)<\//g)].map((match) => `${file}: ${match[1]}`);
      const messageText = [...source.matchAll(/"([^"\n]+\.)"/g)]
        .map((match) => match[1])
        .filter((text) => /\s/.test(text) && !text.includes("http") && !text.includes(".tsx"))
        .map((text) => `${file}: ${text}`);
      return [...jsxText, ...messageText];
    });
    expect(violations).toEqual([]);
  });
});
