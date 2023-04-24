import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import routes from './routes';
// import type { ErrorRequestHandler } from 'express';
import db from "./models";

const app = express();
const port = process.env.PORT;
app.disable('x-powered-by')

const oneHour = 1000 * 60 * 60;
app.use(session({
    name: 'sessionIdCookie',
    secret: process.env.SESSION_SECRET || '',
    proxy: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: oneHour
    }
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);

// db.sync({ force: true }).then(() => {
db.sync().then(() => {
  console.log("Database successfully connected");
})
.catch((err) => {
  console.log("Error", err);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
