const { User, Driver, sequelize, pickuplocation, droplocation, Trip } = require('../../../data/models/index')
const promise = require('bluebird')
const ejs = require('ejs')
const path = require('path')
const helper = require('../../../utills/helper')
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const validator = require('../../../modules/validators/api/index')
const passwordHelper = require('../../../utills/passwordHelper')
const bcrypt = require('bcrypt');

class UserService {
  async signup(firstName, lastName, mobilenumber, email, password, type) {
    return new Promise(async (resolve, reject) => {
      try {
        const hash = await bcrypt.hash(password, 10)
        var data = await User.findAll({
          where: {
            email: email
          }
        })
        if (!data.length > 0) {
          var data = await User.create({
            firstName: firstName,
            lastName: lastName,
            mobilenumber: mobilenumber,
            email: email,
            password: hash,
            type: type
          })
          console.log("data====>", data)
          if (data) {
            resolve(data)
          }
        } else {
          var err = { message: "email is already exit" }
          reject(err)
        }
      } catch (error) {
        return reject(error)
      }
    })

  }
  async login(body, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let { email, password } = body
        var data = await User.findAll({
          where: {
            email: email,
            user_id: user_id
          }
        });
        if (data.length > 0) {
          var pass = bcrypt.compareSync(`${password}`, data[0].password)
          if (pass) {
            return resolve(pass[0])
          } else {
            var err = { message: "enter a valid password" }
            reject(err)
          }
        } else {
          var err = { message: "enter a valid email" }
          reject(err)
        }
      } catch (error) {
        return reject(error)
      }
    })

  }

  async ridenow(req, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let { firstName, email } = req.body
        let { user_id } = req.body.pickuplocation

        var data = await User.findAll({
          where: {
            firstName: firstName,
            email: email,
            user_id: user_id
          }
        })
        var pickup = await pickuplocation.create(req.body.pickuplocation);
        console.log("data=========>", pickup)
        await droplocation.create(req.body.droplocation);
        var pickupSchema = await pickuplocation.findOne({ where: { user_id: user_id } });
        var dropSchema = await droplocation.findOne({ where: { user_id: user_id } });

        const generateTripFare = () => {
          return Math.random() * (1000 - 100) + 100;
        };
        let newTrip = {};
        newTrip = req.body;
        newTrip['tripDate'] = new Date();
        newTrip['user_id'] = `${user_id}`;
        newTrip['pickuplocation_id'] = pickupSchema.getDataValue('pickuplocation_id');
        newTrip['droplocation_id'] = dropSchema.getDataValue('droplocation_id');
        newTrip['tripfare'] = generateTripFare();
        newTrip['farecollected'] = false;
        const createdTrip = await Trip.create(newTrip);
        return resolve(createdTrip)
      } catch (error) {
        return reject(error)
      }
    })

  }
  async goonline(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        var nearestTrip = await this.getnearesttrip(req)
        if (nearestTrip == null) return res.status(400).send({ message: 'No trips available right now.' });
        console.log("nearestTrip================>", nearestTrip);

        // Check if the driver exists or not
        const { user_id } = req.body.driver;
        const driverSchema = await User.findOne({
          attributes: ['firstName', 'lastName', 'email', 'mobilenumber'],
          where: { user_id: user_id }
        });
        if (!driverSchema) return res.status(400).send({ message: 'Driver doesnt exist.' });
        nearestTrip['driver'] = JSON.parse(JSON.stringify(driverSchema, null, 4));

        //Update the driver in the Trip details
        var data = Trip.update({ driver_id: user_id }, { where: { user_id: nearestTrip.user_id } }).then(() => {
          console.log("Driver Details Updated=========>", data);
        });
        var data = {
          user: nearestTrip,
          driver: driverSchema
        }
        return resolve(data)
      } catch (error) {
        return reject(eerror)
      }
    })

  }
  async getnearesttrip(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { trip_id } = req.body.user
        var data = await Trip.findOne({ where: { trip_id: trip_id } })
        console.log("newTrip=============>", data)
        return resolve(data);
      } catch (error) {
        return reject(error)
      }
    });

  }
  async acceptedTrip(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const { driver_id } = req.body.driver;
        const tripDetails = await Trip.findOne({ where: { driver_id: driver_id } });
        if (!tripDetails) {
          var err = { message: "no trips is vailable " }
          reject(err)
        }
        console.log(tripDetails);
        const calculatePickupDistance = () => {
          return Math.random() * (200 - 5) + 5;
        };
        const calculatePickupTime = () => {
          return Math.random() * (240 - 10) + 10;
        };
        tripDetails.setDataValue('tripStatus', 'Driver Accepted');
        tripDetails.setDataValue('pickupdistance', calculatePickupDistance());
        tripDetails.setDataValue('estimatepickuptime', calculatePickupTime());
        await tripDetails.save();
        resolve(tripDetails[0])
      } catch (error) {
        return reject(error)
      }
    })

  }
  async rejectedTrip(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const { driver_id } = req.body
        const trip = await Trip.findOne({ where: { driver_id: driver_id } })
        if (!trip) {
          var err = { message: "No trips assigned to this driver" }
          reject(err)
        }
        trip.setDataValue('tripStatus', 'Driver Rejected')
        await trip.save();
        return resolve(trip)
      } catch (error) {
        return reject(error)
      }
    })

  }
  async startride(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const { driver_id } = req.body;
        const tripDetails = await Trip.findOne({ where: { driver_id: driver_id } });
        if (!tripDetails) {
          var err = { message: "no trips is vailable " }
          reject(err)
        }
        console.log("tripDetails===========>", tripDetails);
        const calculatedropTime = () => {
          return Math.random() * (240 - 10) + 10;
        };
        tripDetails.setDataValue('tripStatus', 'Trip Started');
        tripDetails.setDataValue('estimatedroplocationtime', calculatedropTime());
        await tripDetails.save();
        resolve(tripDetails[0])
      } catch (error) {
        return reject(error)
      }
    })

  }
  async completedtrip(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { driver_id } = req.body;
        var tripDetails = await Trip.findOne({ where: { driver_id: driver_id } })
        if (!tripDetails) {
          var err = { message: "no trip is availabe for this driver" }
          reject(err)
        }
        console.log("tripdetails===========>", tripDetails)

        tripDetails.setDataValue('tripStatus', 'Trip Completed');

        await tripDetails.save();
        return resolve()
      } catch (error) {
        return reject(error)
      }
    })

  }
}
module.exports = new UserService()






















