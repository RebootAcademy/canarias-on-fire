const User = require('../models/user.model')
const Company = require('../models/company.model')

const Auth0CreateUser = async (event) => {
  const body = await readBody(event); // Obtén los datos enviados desde el frontend
  const { email, username, password, role } = body;

  const auth0Domain = process.env.AUTH0_DOMAIN;
  const auth0ClientId = process.env.AUTH0_CLIENT_ID;
  const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;

  // 1. Obtener un token para la API de Auth0
  const tokenResponse = await $fetch(`https://${auth0Domain}/oauth/token`, {
    method: 'POST',
    body: {
      client_id: auth0ClientId,
      client_secret: auth0ClientSecret,
      audience: `https://${auth0Domain}/api/v2/`,
      grant_type: 'client_credentials',
    },
  });

  const { access_token } = tokenResponse;

  const auth0Response = await $fetch(`https://${auth0Domain}/api/v2/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: {
      email,
      username,
      password: 'Evente-2024',
      connection: 'Username-Password-Authentication',
      user_metadata: {
        role,
      },
    },
  });

   let newUser

   if (role === 'Company') {
     newUser = new Company({
       email,
       username,
       companyName,
       phone,
       commercialName,
       sector,
       cif,
       companyEmail,
       role,
       auth0Id: auth0Response.user_id, // Guarda el ID de Auth0 si es necesario
     })
   } else {
     newUser = new User({
       email,
       username,
       role,
       auth0Id: auth0Response.user_id, // Guarda el ID de Auth0 si es necesario
     })
   }

   await newUser.save() // Utiliza el método de tu modelo para guardar el usuario

   return auth0Response  // Devuelve los detalles del usuario creado en Auth0
}

module.exports = Auth0CreateUser;