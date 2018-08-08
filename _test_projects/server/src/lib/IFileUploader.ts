import { Request, Response } from "express";

export interface IFileUploader {
    upload (req: Request , res: Response): object;
    createNativeSessionUri ?(req: Request , res: Response): void;
    saveInitialAssetDoc ?(req: Request , res: Response): void;
    createAssetUuid ?(req: Request , res: Response): void;
}