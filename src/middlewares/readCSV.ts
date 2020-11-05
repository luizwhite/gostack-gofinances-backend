import { Request, Response, NextFunction } from 'express';
import csvParser from 'csv-parse';
import fs from 'fs';
import path from 'path';

export default function readCSV(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const csvFilePath = path.resolve(req.file.destination, req.file.filename);

  const readCSVStream = fs.createReadStream(csvFilePath);

  const parseStream = csvParser({
    from_line: 2,
    ltrim: true,
    rtrim: true,
    delimiter: ',',
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: string[][] = [];

  parseCSV.on('data', (line) => {
    lines.push(line);
  });

  parseCSV.on('end', () => {
    req.fileParsed = {
      lines,
    };
    next();
  });
}
