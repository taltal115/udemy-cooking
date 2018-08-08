import { LocalFileUploader } from "./LocalFileUploader";
import { GoogleFileUploader } from "./GoogleFileUploader";
import { IFileUploader } from "./IFileUploader";
enum EnvType { Local, Google }


export class FileUploaderFactory {
    static getFileUploader (env: EnvType): IFileUploader {
        switch (env) {
            case EnvType.Google:
                return new GoogleFileUploader(EnvType.Google);
            case EnvType.Local:
                return new LocalFileUploader(EnvType.Local);
        }
    }
}