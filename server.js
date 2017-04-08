require('dotenv').config()
const keySecret = process.env.SECRET_KEY
const stripe = require('stripe')(keySecret)
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const koaBody = require('koa-body')()
const cors = require('koa-cors')
app.use(cors())
app.use(koaBody)

router.post('/charge', async (ctx) => {
  const {body} = ctx.request
  let customer
  if (!body.customerId) {
    customer = await stripe.customers.create({
      email: body.stripeEmail,
      source: body.stripeToken
    })
  } else {
    customer = {
      id: body.customerId
    }
  }

  const chargeResult = await stripe.charges.create({
    amount: body.amount,
    description: 'bounty land',
    currency: 'czk',
    customer: customer.id
  })
  const response = {
    chargeResult
  }
  if (!body.customerId) {
    response.customer = customer
  }

  ctx.body = JSON.stringify(response)
})

app.use(router.routes())

app.listen(process.env.PORT, () => {
  console.log('listening on port', process.env.PORT)
})
