import { app, everyMinuteCron } from "./app"
import 'dotenv/config'
const PORT = 8081;


app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    //cronProcess.start()
    everyMinuteCron.start()
    //everyMinuteWorkHoursCron.start()
});
