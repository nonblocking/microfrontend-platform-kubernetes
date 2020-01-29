/*
    Start script that sets the correct config file location (config/$NODE_ENV).
 */

const ENV = process.env.NODE_ENV || 'development';
const CONF = `config/${ENV}`;

console.info('Using Mashroom config: ', CONF);

process.argv = [...process.argv, CONF];

require('./node_modules/@mashroom/mashroom/dist/server');

