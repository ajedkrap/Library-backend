# Library-backend

![](https://img.shields.io/github/stars/ajedkrap/Library-backend) ![](https://img.shields.io/github/forks/ajedkrap/Library-backend) ![](https://img.shields.io/github/tag/ajedkrap/Library-backend) ![](https://img.shields.io/github/release/ajedkrap/Library-backend) ![](https://img.shields.io/github/issues/ajedkrap/Library-backend)

Library-backend is a back-end based 'library' API.

### Prerequisites

What things you need to install the software and how to install them

```
JDK 8 and JRE 8
https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html
```

 ## Build Setup
 
 1. Clone Respository
     `$ https://github.com/banisholih23/bans-library-apps.git`
     
 2. Install Dependencies
 ```bash
 # with npm
 $ npm install <package>
 
 # example :
 $ npm install --save express mysql body-parser
 
 3. Setup your environment variable in `.env` files (create your own)
 
 ```env
 APP_PORT=
 APP_URL=
 APP_TOKEN_KEY=
 
 DB_HOST      = 
 DB_USER      = 
 DB_PASSWORD  = 
 DB_DATABASE  = 
 ```

## Built With

* [Node JS](https://nodejs.org/) - The server-side JavaScript runtime environment.
* [npm](https://www.npmjs.com/) - Package Manager for Javascript
* [Express JS](https://expressjs.com/) - The web application framework 
* [MySQL](https://www.mysql.com/) - The database management system

# API Documentation 

## User Routes

- **GET**  User Endpoint Path:```/user```

## Auth Routes

- **POST** Login Endpoint Path:```/api/user/login```
- **POST** Register Endpoint Path:```/api/user/register```

## Books Routes

- **GET** Books Endpoint Path: ```books/```
- **POST** Books Endpoint Path: ```books/```
- **DELETE** Books Endpoint Path: ```books/:id```

## Loans Routes

- **GET** Loans Endpoint Path: ```loans/```
- **POST** Loans Endpoint Path: ```loans/```
- **PATCH** Loans Endpoint Path: ```loans/```

