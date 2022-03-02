import express from 'express';
import { Router, Request, Response } from 'express';
import "reflect-metadata";
import { createConnection } from 'typeorm';
import  { Record } from "./database/entity/Record"

// rest of the code remains same
const app = express();
const PORT = 8081;

const prefixRouter = Router();

app.use('/expressjs', prefixRouter);

prefixRouter.get('/', (req, res) => res.send({
    "message": 'Express + TypeScript Server'
}));

prefixRouter.get('/testOrm', async  (req: Request, res: Response) => {
    const conn = await createConnection()
    const newRecord = new Record()
    newRecord.email = "Timber";
    newRecord.firstname = "Saw";
    await conn.manager.save(newRecord)
    res.send({
      message: 'created'
    })
})
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});