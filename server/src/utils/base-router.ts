import express from "express";

interface Code {
  [K: string]: string;
}

export abstract class RouterBase {
  protected readonly r;

  constructor() {
    this.r = express.Router();
    this.routes();
  }

  get router() {
    return this.r;
  }

  protected abstract routes(): void;
}
