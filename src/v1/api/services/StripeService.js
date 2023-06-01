const { reject } = require('bluebird');
const { User, Add_card, Charge, Driver, sequelize, pickuplocation, droplocation, Trip } = require('../../../data/models/index')
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
const stripe = require('stripe')(STRIPE_SECRET_KEY)

class StripeService {

  async createcustomer(body, firstName, lastName, email, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        var data = await User.findOne({
          user_id: user_id
        })
        if (data) {
          var customer = await stripe.customers.create({
            name: firstName.concat(lastName),
            email: email
          })
        }
        resolve(customer)
      } catch (error) {
        return reject(error)
      }
    })
  }
  async addcard(body, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let { user_stripe_id, card_Name, card_ExpYear, card_ExpMonth, card_Number, card_CVC } = body
        var data = await User.findOne({
          user_id: user_id
        })
        if (data) {
          var card_token = await stripe.tokens.create({
            card:
            {
              name: card_Name,
              number: card_Number,
              exp_year: card_ExpYear,
              exp_month: card_ExpMonth,
              cvc: card_CVC
            }
          })
        }
        var card = await stripe.customers.createSource(user_stripe_id, {
          source: `${card_token.id}`
        })
        console.log("card=========>", card_token.id)
        await Add_card.create({
          card_Name: card_Name,
          card_Number: card_Number,
          card_ExpYear: card_ExpYear,
          card_ExpMonth: card_ExpMonth,
          card_CVC: card_CVC,
          user_stripe_id: user_stripe_id,
          card_id: card.id,
          user_id: user_id,
          source: card_token.id
        })
        resolve({ card: card.id })
      } catch (error) {
        return reject(error)
      }
    })
  }
  async createcharges(body, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let { user_stripe_id, card_id, amount } = body
        var data = await User.findOne({
          user_id: user_id
        })
        if (data) {
          var charge = await stripe.charges.create({
            card: card_id,
            customer: user_stripe_id,
            amount: amount,
            currency: "INR"
          })
        }
        await Charge.create({
          user_id: user_id,
          amount: amount,
          currency: "INR",
          date: new Date(),
          charge_id: charge.id
        })
        resolve(charge)
      } catch (error) {
        return reject(error)
      }
    })
  }
  async retrievecustomer(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let { customer_id } = req.body
        var data = await stripe.customers.retrieve(
          customer_id
        )
        console.log("data===========>", data)
        resolve(data)
      } catch (error) {
        return reject(error)
      }
    })
  }
  async customerlist(req) {
    return new Promise(async (resolve, reject) => {
      try {
        var customer_list = await stripe.customers.list({})
        resolve(customer_list)
      } catch (error) {
        return reject(error)
      }
    })
  }
}
module.exports = new StripeService()