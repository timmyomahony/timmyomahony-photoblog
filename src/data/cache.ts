import fs from "fs";
import path from "path";

import type { Photo } from "@/types/photo";

/**
 * Simple File Cache
 *
 * This is the only way I can manage to cache our image data so that it's not
 * read from S3 every time . We write a json file to disk with all our data
 * in it
 */

export const readFromCache = async (key: string): Promise<any | undefined> => {
  const cacheDir = path.join(process.cwd(), '.cache');
  const cachePath = path.join(cacheDir, `${key}.json`);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir)
  }
  return new Promise((resolve, reject) => {
    fs.readFile(cachePath, { encoding: "utf-8" }, (err, data) => {
      if (!err) {
        console.log(`Cache hit [${cachePath}]:`);
        const json = JSON.parse(data);
        resolve(json);
      } else {
        console.log(`Cache miss [${cachePath}]`);
        reject();
      }
    });
  });
};

export const writeToCache = async (
  data: any,
  key: string
): Promise<boolean> => {
  const cacheDir = path.join(process.cwd(), '.cache');
  const cachePath = path.join(cacheDir, `${key}.json`);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir)
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(cachePath, JSON.stringify(data), (err) => {
      if (!err) {
        console.log(`Cache write [${cachePath}]`);
        resolve(true);
      } else {
        console.log(`Cache error writing [${cachePath}]`);
        reject(false);
      }
    });
  });
};
