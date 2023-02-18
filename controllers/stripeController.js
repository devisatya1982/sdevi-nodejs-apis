import Stripe from "stripe";


const createStripePayment = async (req, res) => {
  try {
    const { token, amount } = req.body;

   

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount,
    //   currency: 'usd',
    //   payment_method: 'pm_card_visa',
    // });

    const paymentIntent =  await stripe.charges.create({
      source: token.id,
      amount,
      currency: "usd",
    });

    let responseToUI = {
      amount_debited : paymentIntent.amount,
      shipping_address : paymentIntent.billing_details.address,
      email: paymentIntent.billing_details.email,
      name:paymentIntent.billing_details.name,
      phone:paymentIntent.billing_details.phone,
      status:paymentIntent.status,
      id:paymentIntent.id
    }
    


     console.log(`Response from stripe ${responseToUI}`)

    res.status(200).json({ message: paymentIntent });
  } catch (err) {
    res.status(500).send("Error " + err);
  }
};

export default {
  createStripePayment,
};
