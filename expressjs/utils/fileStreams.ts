import { Readable } from "stream";

export interface IFileStreamHelper {
    readData(readable: Readable): Promise<any[]>
}

export class FileStreamHelper implements IFileStreamHelper {
    public async readData(readable: Readable) {
        let dataArray: any[] =[]
        for await (const data of readable) {
            dataArray.push(data)
        }
        return dataArray
    }
}
