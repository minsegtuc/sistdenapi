import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import cookieParser from 'cookie-parser';
import { Log, Usuario, Rol, Departamento, Localidad, Ubicacion, Comisaria, UnidadRegional, TipoDelito, Submodalidad, Modalidad, TipoArma, Autor, Movilidad, Especializacion, Denuncia } from './models/index.model.js';
import routes from './routes/index.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'OPTIONS','DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
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
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });



