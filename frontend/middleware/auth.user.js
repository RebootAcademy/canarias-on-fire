const createUserAndAssignRole = async (userData) => {
  const config = useRuntimeConfig()
  const auth0Domain = config.public.auth0Domain

  // Obtener el token de acceso
  let accessToken = config.public.auth0TokenApi
  let accessToken2 = config.public.auth0TokenApi2

  // Obtener todos los roles
  const rolesResponse = await fetch(`https://${auth0Domain}/api/v2/roles`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!rolesResponse.ok) {
    const errorData = await rolesResponse.json()
    throw new Error(`Failed to fetch roles: ${errorData.message}`)
  }

  const roles = await rolesResponse.json()
  const desiredRole = roles.find((role) => role.name === userData.role)

  if (!desiredRole) {
    throw new Error(`Role '${userData.role}' not found`)
  }

  let email = userData.role === 'company' ? userData.companyEmail : userData.email

  // Crear el usuario
  const createUserResponse = await fetch(
    `https://${auth0Domain}/api/v2/users`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken + accessToken2}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: userData.password, // Considera permitir que el usuario establezca su propia contraseña
        connection: 'Username-Password-Authentication',
        user_metadata: {
          role: userData.role,
        },
      }),
    }
  )

  if (!createUserResponse.ok) {
    const errorData = await createUserResponse.json()
    throw new Error(`Failed to create user: ${errorData.message}`)
  }

  const newUser = await createUserResponse.json()

  // Asignar el rol al nuevo usuario
  const assignRoleResponse = await fetch(
    `https://${auth0Domain}/api/v2/users/${newUser.user_id}/roles`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roles: [desiredRole.id], // ID del rol que quieres asignar
      }),
    }
  )

  if (!assignRoleResponse.ok) {
    const errorData = await assignRoleResponse.json()
    throw new Error(`Failed to assign role: ${errorData.message}`)
  }

  return newUser // O cualquier información adicional que necesites
}

export default createUserAndAssignRole