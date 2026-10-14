import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (f === "node_modules" || f === ".next") return [];
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

for (const file of walk("src").filter((f) => /\.(tsx?|jsx?)$/.test(f))) {
  const text = readFileSync(file, "utf8");

  text.split("\n").forEach((line, i) => {
    for (let c = 0; c < line.length; c++) {
      const code = line.charCodeAt(c);

      // Lone surrogate — half of an emoji pair
      const high = code >= 0xd800 && code <= 0xdbff;
      const low = code >= 0xdc00 && code <= 0xdfff;
      const nextLow =
        line.charCodeAt(c + 1) >= 0xdc00 && line.charCodeAt(c + 1) <= 0xdfff;
      const prevHigh =
        line.charCodeAt(c - 1) >= 0xd800 && line.charCodeAt(c - 1) <= 0xdbff;

      if ((high && !nextLow) || (low && !prevHigh)) {
        console.log(
          `LONE SURROGATE  ${file}:${i + 1}:${c}  ${line.trim().slice(0, 70)}`,
        );
      }

      // Invisible characters that break bundlers
      if (
        [0x200b, 0x200e, 0x200f, 0xfeff, 0x00a0, 0x2028, 0x2029].includes(code)
      ) {
        console.log(
          `INVISIBLE U+${code.toString(16).toUpperCase()}  ${file}:${i + 1}:${c}  ${line.trim().slice(0, 70)}`,
        );
      }
    }
  });
}
console.log("done");
