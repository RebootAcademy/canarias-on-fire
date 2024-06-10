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
- [Company](#company)
- [Event](#event)
- [Category](#category)
- [Location](#location)


### Auth 
| Method | Endpoint               | Descripción                              | Permissions   |
|--------|------------------------|------------------------------------------|---------------|
| POST   | `/api/auth/login`      | Authenticates a user and returns a token | No            |

### User
| Method | Endpoint               | Descripción                              | Permissions   |
|--------|------------------------|------------------------------------------|---------------|
| POST   | `/api/users`           | Creates new user                         | admin         |
| GET    | `/api/users`           | Retrieves all users                      | admin         |
| GET    | `/api/users/:id`       | Retrieves a user by ID                   | admin         |
| PATCH  | `/api/users/:id`       | Updates a user by ID                     | admin         |
| DELETE | `/api/users/:id`       | Deletes a user by ID                     | admin         |

### Event
| Method | Endpoint               | Descripción                              | Permissions              |
|--------|------------------------|------------------------------------------|--------------------------|
| POST   | `/api/events`          | Creates new event                        | admin <br> company       |
| GET    | `/api/events`          | Retrieves all events                     | No                       |
| GET    | `/api/events/:id`      | Retrieves a event by ID                  | No                       |
| PATCH  | `/api/events/:id`      | Updates a event by ID                    | admin <br> company       |
| DELETE | `/api/events/:id`      | Deletes a event by ID                    | admin <br> company       |


### Category
| Method | Endpoint               | Description                              | Permissions              |
|--------|------------------------|------------------------------------------|--------------------------|
| POST   | `/api/categories`      | Creates new category                     | admin                    |
| GET    | `/api/categories`      | Retrieves all categories                 | No                       |
| GET    | `/api/categories/:id`  | Retrieves a category by ID               | No                       |
| PATCH  | `/api/categories/:id`  | Updates a category by ID                 | admin                    |
| DELETE | `/api/categories/:id`  | Deletes a category by ID                 | admin                    |

### Location
| Method | Endpoint               | Description                              | Permissions              |
|--------|------------------------|------------------------------------------|--------------------------|
| POST   | `/api/locations`       | Creates new location                     | admin <br> company       |
| GET    | `/api/locations`       | Retrieves all locations                  |                          |
| GET    | `/api/locations/:id`   | Retrieves a location by ID               |                          |
| PATCH  | `/api/locations/:id`   | Updates a location by ID                 | admin <br> company       |
| DELETE | `/api/locations/:id`   | Deletes a location by ID                 | admin <br> company       |

<!-- ### Company
| Method | Endpoint               | Description                              | Permissions              |
|--------|------------------------|------------------------------------------|--------------------------|
| POST   | `/api/companies`       | Creates new company                      | admin <br>               |
| GET    | `/api/companies`       | Retrieves all companies                  | admin <br>               |
| GET    | `/api/companies/:id`   | Retrieves a company by ID                | admin <br>               |
| PATCH  | `/api/companies/:id`   | Updates a company by ID                  | admin <br>               |
| DELETE | `/api/companies/:id`   | Deletes a company by ID                  | admin <br>               |

#### Company's auxiliar controllers 
| Method | Endpoint               | Description                              | Permissions              |
|--------|------------------------|------------------------------------------|--------------------------|
| PATCH  | `/api/companies/me`    | Updates his/her Company's profile         | company                  | -->

## Contributors
- Juan Antonio León Ojeda
- Alberto Rodríguez García