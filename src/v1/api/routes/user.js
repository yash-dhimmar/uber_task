const express = require('express');
const router = express.Router()
const Multer = require('multer')
const path = require('path')
const GlobalAuthClass = require('../../../modules/middleware/auth');
const UserController = require('../../api/controllers/UserController');
const StripeController = require('../../api/controllers/StripeController')

router.post('/sign-up', UserController.signup)
router.post('/login', UserController.login)
router.post('/ride-now', GlobalAuthClass.authenticate, UserController.ride_now)
router.post('/go-online', GlobalAuthClass.authenticate, UserController.go_online)
router.post('/get-nearest-trip', GlobalAuthClass.authenticate, UserController.get_nearest_trip)
router.post('/accepted-trip', GlobalAuthClass.authenticate, UserController.accepted_Trip)
router.post('/rejected-trip', GlobalAuthClass.authenticate, UserController.rejected_Trip)
router.post('/start-ride', GlobalAuthClass.authenticate, UserController.start_ride)
router.post('/completed-trip', GlobalAuthClass.authenticate, UserController.completed_trip)

// stripe payment 
router.post('/create-customer', GlobalAuthClass.authenticate, StripeController.createcustomer)
router.post('/add-card-details', GlobalAuthClass.authenticate, StripeController.addcard)
router.post('/create-charges', GlobalAuthClass.authenticate, StripeController.createcharges)
router.post('/retrieve-customer', StripeController.retrievecustomer)
router.post('/customer-list', StripeController.customerlist)

// driver- side
router.post('/create-availibility-time', GlobalAuthClass.authenticate, UserController.create_availibility_time)
router.post('/update-availibility-time', GlobalAuthClass.authenticate, UserController.update_availibility_time)
router.post('/dlt-availibility-time', GlobalAuthClass.authenticate, UserController.dlt_availibility_time)
router.post('/driver-weekly-list', GlobalAuthClass.authenticate, UserController.driver_weekly_list)
module.exports = router;
