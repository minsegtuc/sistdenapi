import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import cookieParser from 'cookie-parser';
import { Log, Usuario, Rol, Departamento, Localidad, Ubicacion, Comisaria, UnidadRegional, TipoDelito, Submodalidad, Modalidad, TipoArma, Autor, Movilidad, Especializacion, Denuncia } from './models/index.model.js';
import routes from './routes/index.routes.js';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

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

// const options = {
//     key: fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/srv555183.hstgr.cloud/fullchain.pem')
// }

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        // https.createServer(options, app).listen(PORT, () => {
        //     console.log(`Server on port ${PORT}`);
        // });
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });



