# Canarias on fire's Back

## Table of Contents
- [Deploy](#deplay) 
- [Technologies Used](#technologies-used)
- [Dependencies](#dependencies)
- [Endpoints](#endpoints)
- [Contributors](#contributors)


## Deploy
- **API URL** - https://

## Technologies Used
- Node.js
- Express
- MongoDB (DB deployed on Atlas)
- Mongoose

## Dependencies
- <b>bcrypt</b>: Used for password hashing.
- <b>cors</b>: Middleware to enable CORS (Cross-Origin Resource Sharing).
- <b>dotenv</b>: Loads environment variables from a .env file.
- <b>express</b>: Web application framework for Node.js.
- <b>jsonwebtoken</b>: Implements access tokens for authentication.
- <b>mongoose</b>: ODM (Object Data Modeling) for MongoDB.
- <b>morgan</b>: HTTP request logger middleware for Node.js.


## Endpoints
- [Auth](#auth)
- [User](#user)
- [Event](#event)
- [Category](#category)
- [Location](#location)
- [Company](#company)


### Auth 
| Method | Endpoint               | Description           | Returns                                              | Permissions |
|--------|------------------------|-----------------------|------------------------------------------------------|-------------|
| POST   | `/api/auth/login`      | Authenticates a user  | { success: Boolean, message: String, result: token } | No          |
| POST   | `/api/auth/register`   | Registers a user      | { success: Boolean, message: String, result: user  } | No          |

### User
| Method | Endpoint               | Description               | Returns                                                | Permissions |
|--------|------------------------|---------------------------|--------------------------------------------------------|-------------|
| POST   | `/api/users`           | Creates new user          | { success: Boolean, message: String, result: newUser } | admin       |
| GET    | `/api/users`           | Retrieves all users       | { success: Boolean, message: String, result: users }   | admin       |
| GET    | `/api/users/:id`       | Retrieves a user by ID    | { success: Boolean, message: String, result: user }    | admin       |
| PATCH  | `/api/users/:id`       | Updates a user by ID      | { success: Boolean, message: String, result: user }    | admin       |
| DELETE | `/api/users/:id`       | Deletes a user by ID      | { success: Boolean, message: String, result: user }    | admin       |

### Event
| Method | Endpoint               | Description               | Returns                                                 | Permissions        |
|--------|------------------------|---------------------------|---------------------------------------------------------|--------------------|
| POST   | `/api/events`          | Creates new event         | { success: Boolean, message: String, result: newEvent } | admin <br> company |
| GET    | `/api/events`          | Retrieves all events      | { success: Boolean, message: String, result: events   } | No                 |
| GET    | `/api/events/:id`      | Retrieves a event by ID   | { success: Boolean, message: String, result: event }    | No                 |
| PATCH  | `/api/events/:id`      | Updates a event by ID     | { success: Boolean, message: String, result: event }    | admin <br> company |
| DELETE | `/api/events/:id`      | Deletes a event by ID     | { success: Boolean, message: String, result: event }    | admin <br> company |


### Category
| Method | Endpoint               | Description                 | Returns                                                    | Permissions |
|--------|------------------------|-----------------------------|------------------------------------------------------------|-------------|
| POST   | `/api/categories`      | Creates new category        | { success: Boolean, message: String, result: newCategory } | admin       |
| GET    | `/api/categories`      | Retrieves all categories    | { success: Boolean, message: String, result: categories }  | No          |
| GET    | `/api/categories/:id`  | Retrieves a category by ID  | { success: Boolean, message: String, result: category }    | No          |
| PATCH  | `/api/categories/:id`  | Updates a category by ID    | { success: Boolean, message: String, result: category }    | admin       |
| DELETE | `/api/categories/:id`  | Deletes a category by ID    | { success: Boolean, message: String, result: category }    | admin       |

### Location
| Method | Endpoint               | Description                  | Returns                                                    | Permissions        |
|--------|------------------------|------------------------------|------------------------------------------------------------|--------------------|
| POST   | `/api/locations`       | Creates new location         | { success: Boolean, message: String, result: newLocation } | admin <br> company |
| GET    | `/api/locations`       | Retrieves all locations      | { success: Boolean, message: String, result: locations }   | No                 |
| GET    | `/api/locations/:id`   | Retrieves a location by ID   | { success: Boolean, message: String, result: location }    | No                 |
| PATCH  | `/api/locations/:id`   | Updates a location by ID     | { success: Boolean, message: String, result: location }    | admin <br> company |
| DELETE | `/api/locations/:id`   | Deletes a location by ID     | { success: Boolean, message: String, result: location }    | admin <br> company |

<!-- ### Company
| Method | Endpoint               | Description                              | Permissions |
|--------|------------------------|------------------------------------------|-------------|
| POST   | `/api/companies`       | Creates new company                      | admin <br>  |
| GET    | `/api/companies`       | Retrieves all companies                  | admin <br>  |
| GET    | `/api/companies/:id`   | Retrieves a company by ID                | admin <br>  |
| PATCH  | `/api/companies/:id`   | Updates a company by ID                  | admin <br>  |
| DELETE | `/api/companies/:id`   | Deletes a company by ID                  | admin <br>  |

#### Company's auxiliar controllers 
| Method | Endpoint               | Description                              | Permissions |
|--------|------------------------|------------------------------------------|-------------|
| PATCH  | `/api/companies/me`    | Updates his/her Company's profile         | company     | -->

## Contributors
- Juan Antonio León Ojeda
- Alberto Rodríguez García