const express = require('express');
const router = express.Router()
const Multer = require('multer')
const path = require('path')

const GlobalAuthClass = require('../../../modules/middleware/auth');
const UserController = require('../../api/controllers/UserController');
const StripeController = require('../../api/controllers/StripeController')


router.post('/sign-up',UserController.signup)

router.post('/login',GlobalAuthClass.authenticate,UserController.login)

router.post('/ride-now',GlobalAuthClass.authenticate,UserController.ridenow)

router.post('/go-online',UserController.goonline)

router.post('/get-nearest-trip',UserController.getnearesttrip)

router.post('/accepted-trip',UserController.acceptedTrip)

router.post('/rejected-trip',UserController.rejectedTrip)

router.post('/start-ride',UserController.startride)

router.post('/completed-trip',UserController.completedtrip)

router.post('/create-customer',GlobalAuthClass.authenticate,StripeController.createcustomer)
router.post('/add-card-details',GlobalAuthClass.authenticate,StripeController.addcard)
router.post('/create-charges',GlobalAuthClass.authenticate,StripeController.createcharges)
router.post('/retrieve-customer',StripeController.retrievecustomer)
router.post('/customer-list',StripeController.customerlist)


module.exports = router;
