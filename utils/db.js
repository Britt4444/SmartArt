import prisma from 'utils/prisma';
import initStripe from 'stripe';
const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

//naming here on user vs customer vs customers is confusing
const createUser = async(cust) => {
  const user = await prisma.customer.findUnique({
    where: {
      email: cust.email,
    },
  });
  if (!user) {
    try {
      const customer = await stripe.customers.create({
        email: cust.email,
      });
      //console.log(customer);
      await prisma.customer.create({
        data: {
          email: cust.email,
          subId: cust.sub,
          firstName: cust.first_name,
          lastName: cust.last_name,
          stripeId: customer.id,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      await prisma.$disconnect();
    }
  }
};


const addToCartApi = async (userId, productId, quantity) => {

  // Check if the user has an active cart
  const userCart = await prisma.cart.findFirst({
    where: {
      customerId: userId,

    },
  });

  if (!userCart) {
    // If the user doesn't have an active cart, create one
    const newCart = await prisma.cart.create({
      data: {
        customerId: userId,

      },
    });

    // Use the newly created cart's ID as cartId
    const cartId = newCart.id;

    // Create a cart item using cartId
    await prisma.cartItem.create({
      data: {
        cartId: cartId,
        productId: productId,
        qty: quantity,
      },
    });

  } else {
    // If the user has an active cart, use its ID as cartId
    const cartId = userCart.id;

    // Check if the item is already in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });

    if (existingCartItem) {
      // If the item exists, update the quantity
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          qty: existingCartItem.qty + quantity,
        },
      });
    } else {
      // If the item doesn't exist, create a new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cartId,
          productId: productId,
          qty: quantity,
        },
      });
    }
  }
}
const deteteFromCartApi = async (userId, productId) => {

  // Check if the user has an active cart
  const userCart = await prisma.cart.findFirst({
    where: {
      customerId: userId,
    },
  });

  if (!userCart) {
    // If the user doesn't have an active cart, respond with an error
    return res.status(404).json({ error: 'User cart not found' });
  }
  const cartId = userCart.id;
  // Check if the item is in the user's cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cartId,
      productId: productId,
    },
  });
 
  if (existingCartItem) {

    if (existingCartItem.qty === 1) {
      // If the item exists, delete it
      await prisma.cartItem.delete({
        where: {
          id: existingCartItem.id,
        },
      });
    } else {
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          qty: existingCartItem.qty - 1
        }
      });
    }

  } else {
    // If the item doesn't exist in the cart, respond with an error
    return res.status(404).json({ error: 'Item not found in the cart' });
  }
  
}

const updateCartApi = async (userId, productId, quantity) => {
  // Check if the user has an active cart
  const userCart = await prisma.cart.findFirst({
    where: {
      customerId: userId,
    },
  });

  if (userCart) {
    const cartId = userCart.id;

    // Check if the item is in the user's cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });

    if (existingCartItem) {
      // If the item exists, update the quantity
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          qty: quantity,
        },
      });

    } else {
      // If the item doesn't exist in the cart, respond with an error
      res.status(404).json({ error: 'Item not found in the cart' });
    }
  } else {
    // If the user doesn't have an active cart, respond with an error
    res.status(404).json({ error: 'User does not have an active cart' });
  }
}


const applyDiscount = async (product_id, product_price) => {
  const discount = await prisma.discount.findFirst({
    where: {
      productId: product_id,
    },
  });

  await prisma.$disconnect();
  
  // Check if discount exists,
  if (discount) {

    const today = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    const discountValid = today >= startDate && today <= endDate;

    // Calculate discounted price by percentage off
    const discountedPrice = product_price - (product_price * (discount.discount / 100))

    // If discount is within valid date range, return discounted price
    if (discountValid) {
      return discountedPrice;
    } else {
      return product_price;
    }

  } else {
    return product_price;
  }
};

export { createUser, addToCartApi, deteteFromCartApi, updateCartApi, applyDiscount };