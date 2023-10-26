import dotenv from 'dotenv';
import {app} from './app';
import mongoose, {ConnectOptions} from 'mongoose';


process.on('uncaughtException', (err: Error) => {
    console.log('UNCAUGHT EXCEPTION 💩💩💩 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: 'config.env'});
const {DATABASE, DATABASE_PASSWORD, PORT} = process.env;
if(!DATABASE_PASSWORD || !DATABASE) {
    console.log('Dont find database info')
    process.exit()
}

const DB = DATABASE && DATABASE_PASSWORD && DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions).then(con => {
    console.log('DB connection successfully');
});

const port = PORT || 5000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
    console.log('UNHANDLED REJECTION 💩💩💩 Shutting down...')
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});