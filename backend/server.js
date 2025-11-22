// server.js
require('dotenv').config();
const app = require('./src/app');
const { sequelize, connectMongo } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectMongo();

        await sequelize.authenticate();
        console.log('MySQL Conectado');

        await sequelize.sync({ force: false });
        console.log('Tablas Sincronizadas');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();