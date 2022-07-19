import { Readable } from "stream";

export class FileStreamHelper {
    public async readData(readable: Readable) {
        let dataArray: any[] =[]
        for await (const data of readable) {
            dataArray.push(data)
        }
        return dataArray
    }
}
