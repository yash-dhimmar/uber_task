const { User, Ride, Driver, Driver_availability, sequelize, pickuplocation, droplocation, Trip } = require('../../../data/models/index')
const promise = require('bluebird')
const ejs = require('ejs')
const path = require('path')
const helper = require('../../../utills/helper')
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const validator = require('../../../modules/validators/api/index')
const passwordHelper = require('../../../utills/passwordHelper')
const bcrypt = require('bcrypt');
const { delete_availibility_time } = require('../controllers/UserController')

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
  async login(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        // let { email, password } = body
        var data = await User.findOne({
          where: {
            email: email
          }
        });
        if (data) {
          var pass = bcrypt.compareSync(`${password}`, data.password)
          if (pass) {
            return resolve(data)
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
  async ride_now(req, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let { start_latitude, start_longtitude, start_point, end_latitude, end_longtitude, end_point, start_time, end_time } = req.body

        var data = await User.findOne({
          where: {
            user_id: user_id
          }
        })
        const generateTripFare = () => {
          return Math.random() * (1000 - 100) + 100;
        };
        var newTrip = await Trip.create({
          start_latitude: start_latitude,
          start_longtitude: start_longtitude,
          start_point: start_point,
          end_latitude: end_latitude,
          end_longtitude: end_longtitude,
          end_point: end_point,
          start_time: start_time,
          end_time: end_time,
          user_id: `${user_id}`,
          tripDate: new Date(),
          tripfare: generateTripFare(),
          farecollected: false
        })
        var ride_data = await Ride.findAll({})
        for (let i = 0; i < ride_data.length; i++) {
          // console.log("ride=========>", ride_data[i].start_time)
          // console.log("trip=========>", newTrip.start_time)
          // console.log("ride=========>", ride_data[i].end_time)
          // console.log("trip=========>", newTrip.end_time)
          if (newTrip.start_time === ride_data[i].start_time || newTrip.end_time === ride_data[i].end_time) {
            await Ride.update({ trip_status_type: 1 }, {
              where: {
                start_time: ride_data[i].start_time
              }
            })
          } else if (newTrip.start_time > ride_data[i].start_time && newTrip.end_time < ride_data[i].end_time) {
            await Ride.update({ trip_status_type: 1 }, {
              where: {
                start_time: ride_data[i].start_time
              }
            })
          }
        }
        const [results, metadata] = await sequelize.query("SELECT * FROM rides WHERE trip_status_type IN ('1','2')  ")
        resolve(results)
        console.log("data=============>", results)
        // var data2 = await sequelize.query("SELECT * FROM rides WHERE trip_status_type NOT IN ('1','2') && newTrip.start_time >  ride_data[i].start_time && newTrip.end_time < ride_data[i].end_time ")
        // resolve(data2) 
        // console.log("data2=============>",data2)

      } catch (error) {
        return reject(error)
      }
    })
  }
  async go_online(req, user) {
    return new Promise(async (resolve, reject) => {
      try {
        var nearestTrip = await this.get_nearest_trip(req)
        if (nearestTrip == null) return ({ message: 'No trips available right now.' });
        console.log("nearestTrip================>", nearestTrip);

        // Check if the driver exists or not
        const { user_id } = req.body.driver;
        const driverSchema = await User.findOne({
          attributes: ['firstName', 'lastName', 'email', 'mobilenumber'],
          where: { user_id: user_id }
        });
        if (!driverSchema) return ({ message: 'Driver doesnt exist.' });
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
        return reject(error)
      }
    })
  }
  async get_nearest_trip(req, user_id) {
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
  async accepted_Trip(req, driver_id) {
    return new Promise(async (resolve, reject) => {
      try {
        var data = await User.findOne({
          user_id: driver_id
        })
        if (data) {
          const tripDetails = await Trip.findOne({ where: { driver_id: driver_id } });
          if (!tripDetails) {
            var err = { message: "no trips is vailable " }
            reject(err)
          }
          console.log(tripDetails);
          var data = await Ride.update({
            trip_status_type: '3'
          }, {
            where: {
              driver_id: driver_id
            }
          })
          resolve(tripDetails)
        } else {
          var err = { message: "driver is not available" }
          reject(err)
        }
      } catch (error) {
        return reject(error)
      }
    })
  }
  async rejected_Trip(req, driver_id) {
    return new Promise(async (resolve, reject) => {
      try {
        var data = await User.findOne({
          user_id: driver_id
        })
        if (data) {
          const trip = await Trip.findOne({ where: { driver_id: driver_id } })
          if (!trip) {
            var err = { message: "No trips assigned to this driver" }
            reject(err)
          }
          var data = await Ride.update({
            trip_status_type: '2'
          }, {
            where: {
              driver_id: driver_id
            }
          })
          resolve(trip)
        }
      } catch (error) {
        return reject(error)
      }
    })
  }
  async start_ride(req, driver_id) {
    return new Promise(async (resolve, reject) => {
      try {
        var data = await User.findOne({
          user_id: driver_id
        })
        if (data) {
          const tripDetails = await Trip.findOne({ where: { driver_id: driver_id } });
          if (!tripDetails) {
            var err = { message: "no trips is vailable " }
            reject(err)
          }
          console.log("tripDetails===========>", tripDetails);
          var data = await Ride.update({
            trip_status_type: '4'
          }, {
            where: {
              driver_id: driver_id
            }
          })
          resolve(tripDetails)
        }
      } catch (error) {
        return reject(error)
      }
    })
  }
  async completed_trip(req, driver_id) {
    return new Promise(async (resolve, reject) => {
      try {
        var data = await User.findOne({
          user_id: driver_id
        })
        if (data) {
          var tripDetails = await Trip.findOne({ where: { driver_id: driver_id } })
          if (!tripDetails) {
            var err = { message: "no trip is available for this driver" }
            reject(err)
          }
          var data = await Ride.update({
            trip_status_type: '5'
          }, {
            where: {
              driver_id: driver_id
            }
          })
          return resolve(tripDetails)
        }
      } catch (error) {
        return reject(error)
      }
    })
  }
  async create_availibility_time(body, driver_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let { day, start_time, end_time } = body
        var data = await User.findOne({
          user_id: driver_id
        })
        if (data) {
          var detail = await Driver_availability.create({
            day: day,
            start_time: start_time,
            end_time: end_time,
            driver_id: driver_id
          })
          console.log("driver========>", detail)
          if (detail) {
            await Driver_availability.update({
              flag: "1"
            }, {
              where: {
                driver_id: driver_id
              }
            })
          }
          resolve(detail)
        }
      } catch (error) {
        return reject(error)
      }
    })
  }
  async update_availibility_time(body, driver_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let { driver_availibility_id, start_time, end_time } = body
        var data = await User.findOne({
          user_id: driver_id
        })
        if (data) {
          var update_data = await Driver_availability.update({
            start_time: start_time,
            end_time: end_time
          }, {
            where: {
              driver_availibility_id: driver_availibility_id
            }
          })
          resolve(update_data[0])
        }
      } catch (error) {
        return reject(error)
      }
    })
  }
  async dlt_availibility_time(body, driver_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let { driver_availibility_id } = body
        var data = await Driver_availability.destroy({
          where: { driver_availibility_id: driver_availibility_id }
        })
        if (data) {
          resolve(data[0])
        } else {
          var err = { message: "driver is not their" }
          reject(err)
        }
      } catch (error) {
        return reject(error)
      }
    })
  }
  async driver_weekly_list(body, driver_id) {
    return new Promise(async (resolve, reject) => {
      try {
        var data = await Driver_availability.findAll({
          where: { driver_id: driver_id }
        })
        resolve(data)
      } catch (error) {
        return reject(error)
      }
    })
  }
}
module.exports = new UserService()






















