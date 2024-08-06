const handleCheckoutSessionCompleted = async (session) => {
  console.log('Checkout session completed:', session.id)
  // Implementa la lógica para manejar la sesión completada
}

const handleCustomerSubscriptionCreated = async (subscription) => {
  console.log('Subscription created:', subscription.id)
  // Implementa la lógica para manejar la suscripción creada
}

// Añade más manejadores según sea necesario

module.exports = {
  'checkout.session.completed': handleCheckoutSessionCompleted,
  'customer.subscription.created': handleCustomerSubscriptionCreated,
  // Añade más manejadores aquí
}
