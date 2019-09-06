import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routes from './routes';
import helmet from 'helmet';
import cors from 'cors';

var app = express();

// Setup Request logging
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

app.use(
  logger(logFormat, {
    skip: function(_req, res) {
      if (process.env.NODE_ENV === 'test') {
        return true;
      }

      return res.statusCode < 400;
    },
    stream: process.stderr,
  }),
);

app.use(
  logger(logFormat, {
    skip: function(_req, res) {
      if (process.env.NODE_ENV === 'test') {
        return true;
      }

      return res.statusCode >= 400;
    },
    stream: process.stdout,
  }),
);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// mount all routes on /api path
app.use('/api/v1', routes);

// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function(
  err: any,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
