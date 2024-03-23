"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./mongo/connect"));
const logger_1 = require("./logger");
const routes_1 = require("./routes/");
const tasks_1 = require("./utils/tasks");
// Initial config
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 10000;
//Apply all middleware here***
//Block except allowedOrigins
const allowedOrigins = [];
const isOriginAllowed = (origin) => allowedOrigins.includes(origin);
const customOrigin = (origin, callback) => {
    if (!origin || isOriginAllowed(origin)) {
        callback(null, true);
    }
    else {
        callback(new Error('Not allowed by CORS'));
    }
};
app.use((0, cors_1.default)({
    origin: customOrigin
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, helmet_1.default)());
//Configure rate limiting max 50 request per 15min
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 50,
});
app.use(limiter);
// Handle the number of proxies between server and client
// This is not necessary if your are running the server locally or
// if the server is being hosted without proxies
// app.set('trust proxy', 3);
// Apply authentication middleware to all routes except '/api/v1/register'
// app.use((req: Request, res: Response, next: NextFunction) => {
//     authenticate(req, res, next);
// });
app.use('/api/v1/tasks/notify', routes_1.notifyTaskRoute);
app.use('/api/v1/tasks/articles', routes_1.articlesTaskRoute);
async function startServer() {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('Invalid MongoDB URL');
        }
        await (0, connect_1.default)(process.env.MONGODB_URL);
        app.listen(port, () => console.log(`Server started on port ${port}`));
    }
    catch (error) {
        logger_1.logger.error(error);
    }
}
;
// Handle server shutdown
async function handleShutdown() {
    await (0, tasks_1.closeRedis)();
    console.log('Server shutting down...');
}
startServer();
process.on('exit', handleShutdown);
