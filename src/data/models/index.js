const env = require('dotenv');
env.config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const mongoose = require("mongoose");
const basename = path.basename(__filename);
const db = {};

if(process.env.DB_CONNECTION =='mongodb'){
    const url = "mongodb://"+process.env.DB_HOST+":"+process.env.DB_PORT+"/"+process.env.DB_DATABASE
    mongoose.Promise = global.Promise;
    db.mongoose = mongoose;
    db.conn = mongoose.connection;
    db.url = url;
    fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(mongoose);
        db[model.collection.modelName] = model;
        console.log('model ======>',model)
    });
}else{
    let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        multipleStatements: true,
        dialect: "postgres",
        autoreconnect: true,
        dialectOptions: {
            connectTimeout: 60000
        },
        pool: {
            max: 1000,
            min: 0,
            acquire: 60000,
            idle: 10000,
        },
    });
    fs.readdirSync(__dirname)
        .filter(file => {
            return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
        })
        .forEach(file => {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
            // console.log(db[modelName]);
        }
    });
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
}
module.exports = db;