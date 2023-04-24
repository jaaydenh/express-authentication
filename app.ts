import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';

import routes from './routes';
import db from "./models";

// initalize sequelize with session store
const store = SequelizeStore(session.Store);

const app = express();
const port = process.env.PORT;
app.disable('x-powered-by')

app.use(
  session({
    name: 'sessionIdCookie',
    secret: process.env.SESSION_SECRET || '',
    proxy: true, // set to true when behind a proxy, must be set to false when not behind a proxy to avoiding spoofing X-Forwarded-Proto header
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // false for testing; Should be set to true when testing behind an ssl proxy when receiving header X-Forwarded-Proto: https
      maxAge: 1000 * 60 * 15
    },
    store: new store({
      db: db,
    }),
  })
);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).send("Resource not found!")
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
