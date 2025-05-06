import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import cookieParser from 'cookie-parser';
import { socketConfiguration } from './sockets/socketConfig.js'
import { Log, Usuario, Rol, Departamento, Localidad, Ubicacion, Comisaria, UnidadRegional, TipoDelito, Submodalidad, Modalidad, TipoArma, Autor, Movilidad, Especializacion, Denuncia, ObjetoIA } from './models/index.model.js';
import routes from './routes/index.routes.js';
import cors from 'cors';
import http from 'http'
import https from 'https';
import fs from 'fs';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

const allowedOrigins = ['https://srv555183.hstgr.cloud', 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json({ limit: '25mb' }));
app.use('/api', routes);
import startCleanWorkingJob from './cron/cleanWorking.js';

startCleanWorkingJob();

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync({});
    })
    .then(() => {       
        let server;
        let io;

        if (process.env.NODE_ENV === 'production') {
            const options = {
                key: fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/privkey.pem'),
                cert: fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/fullchain.pem')
            };
            server = https.createServer(options, app);
            io = new Server(server, {
                cors: {
                    origin: allowedOrigins,
                    methods: ['GET', 'POST', 'PUT', 'DELETE','UPDATE','PATCH'],
                    credentials: true,
                },
            });
        } else {
            server = http.createServer(app);
            io = new Server(server, {
                cors: {
                    origin: allowedOrigins,
                    methods: ['GET', 'POST', 'PUT', 'DELETE','UPDATE','PATCH'],
                    credentials: true,
                },
            });
        }

        socketConfiguration(io)

        server.listen(PORT, () => {
            console.log(`Server on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });



