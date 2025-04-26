"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config"); // remember
const cors_1 = __importDefault(require("cors"));
const cluster_1 = __importDefault(require("cluster"));
const node_os_1 = __importDefault(require("node:os"));
const numCPUs = node_os_1.default.cpus().length;
if (cluster_1.default.isPrimary) {
    console.log(`Master process ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died. Restarting...`);
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 5000;
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get('/', (req, res) => {
        console.log(`Request processed at ${process.pid}`);
        res.send('Express + TypeScript Server');
    });
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}
