import express, { Express, Request, Response } from 'express';
import 'dotenv/config'; // remember
import cors from 'cors';
import cluster from 'cluster';
import os from 'node:os';

const numCPUs = os.cpus().length;


if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    const app: Express = express();
    const port = process.env.PORT || 5000;

    app.use(cors());
    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
		console.log(`Request processed at ${process.pid}`);
        res.send('Express + TypeScript Server');
    });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });

}
