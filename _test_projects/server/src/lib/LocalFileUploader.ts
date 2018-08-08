import { IFileUploader } from "./IFileUploader";
enum EnvType { Local, Google }

export class LocalFileUploader implements IFileUploader {
    env: EnvType;

    constructor(Type: EnvType) {
        this.env = Type;
    }

    upload(req: any, res: any) {
        return {}
    }
}