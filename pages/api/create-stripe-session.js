const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function CreateStripeSession(req, res) {
  const { item } = req.body;

  const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://rapepoesia.com.br';

  const transformedItem = {
    price_data: {
      currency: 'brl',
      product_data: {
        images: [item.image],
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    description: item.description,
    quantity: item.quantity,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [transformedItem],
    mode: 'payment',
    success_url: redirectURL + '?status=success_stripe&camarote=' + item.name.split(' ')[1],
    cancel_url: redirectURL + '?status=cancel&camarote=' + item.name.split(' ')[1],
    metadata: {
      images: item.image,
    },
  });

  res.json({ id: session.id });
}

export default CreateStripeSession;