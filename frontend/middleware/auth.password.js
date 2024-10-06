const changeUserPassword = async (userEmail, newPassword) => {
  const config = useRuntimeConfig()
  const auth0Domain = config.public.auth0Domain

  // Obtener el token de acceso
  const accessToken = config.public.auth0TokenApi

  // Obtener todos los usuarios
  const getAllUsersResponse = await fetch(
    `https://${auth0Domain}/api/v2/users`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!getAllUsersResponse.ok) {
    const errorData = await getAllUsersResponse.json()
    throw new Error(`Failed to fetch users: ${errorData.message}`)
  }

  const users = await getAllUsersResponse.json()
  const user = users.find((user) => user.email === userEmail)

  if (!user) {
    throw new Error(`User with email ${userEmail} not found`)
  }

  const response = await fetch(
    `https://${auth0Domain}/api/v2/users/${user.user_id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newPassword,
        connection: 'Username-Password-Authentication', // Asegúrate de que esta conexión esté habilitada
      }),
    }
  )

  // Manejo de respuesta
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to change password: ${errorData.message}`)
  }

  console.log('Password changed successfully')
  return await response.json()
}

export default changeUserPassword
