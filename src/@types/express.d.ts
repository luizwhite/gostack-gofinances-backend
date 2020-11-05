declare namespace Express {
  export interface Request {
    fileParsed: {
      lines: string[][];
    };
  }
}
