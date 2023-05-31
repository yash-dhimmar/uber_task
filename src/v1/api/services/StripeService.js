const { reject } = require('bluebird');

const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
const stripe = require('stripe')(STRIPE_SECRET_KEY)

class StripeService {

  async createcustomer(req) {
    return new Promise(async (resolve, reject) => {
      try {
        var customer = await stripe.customers.create({
          name: req.body.name,
          email: req.body.email
        })
        resolve(customer)
      } catch (error) {
        return reject(error)
      }
    })
  }
  async addcard(body) {
    return new Promise(async (resolve, reject) => {
      try {
        let { customer_id, card_Name, card_ExpYear, card_ExpMonth, card_Number, card_CVC } = body
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
        var card = await stripe.customers.createSource(customer_id, {
          source: `${card_token.id}`
        })
        resolve({ card: card.id })
      } catch (error) {
        return reject(error)
      }
    })
  }
  async createcharges(body) {
    return new Promise(async (resolve, reject) => {
      try {
        let { customer_id, card_id, amount } = body
        var charges = await stripe.charges.create({
          card: card_id,
          customer: customer_id,
          amount: amount,
          currency: "INR"
        })
        resolve(charges)
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