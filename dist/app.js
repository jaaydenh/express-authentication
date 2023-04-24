"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const routes_1 = __importDefault(require("./routes"));
const models_1 = __importDefault(require("./models"));
// initalize sequelize with session store
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const store = (0, connect_session_sequelize_1.default)(express_session_1.default.Store);
const app = (0, express_1.default)();
const port = process.env.PORT;
app.disable('x-powered-by');
app.use((0, express_session_1.default)({
    name: 'sessionIdCookie',
    secret: process.env.SESSION_SECRET || '',
    proxy: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 15
    },
    store: new store({
        db: models_1.default,
    }),
}));
// parse incoming requests
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// routes
app.use('/', routes_1.default);
app.use((req, res, next) => {
    res.status(404).send("Resource not found!");
});
// error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
// db.sync({ force: true }).then(() => {
models_1.default.sync().then(() => {
    console.log("Database successfully connected");
})
    .catch((err) => {
    console.log("Error", err);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
