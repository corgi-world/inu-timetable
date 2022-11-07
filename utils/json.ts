import fs from 'fs';
import path from 'path';

export function read<T>(fileName: string) {
  const folderPath = path.join(process.cwd(), '/public/json');
  const fileData = fs.readFileSync(`${folderPath}/${fileName}.json`, 'utf-8');

  return JSON.parse(fileData) as T;
}
