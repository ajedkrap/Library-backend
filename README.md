<h1 align="center">ExpressJS - Simple Loan Library with RESTfull API</h1>

Library-backend is a back-end based 'library' API.

<p align="center">![](https://img.shields.io/github/watchers/ajedkrap/library-backend?style=social) ![](https://img.shields.io/github/last-commit/:user/:repo) </p>


## Built With

[![Node.js](https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square)]
* [Node JS](https://nodejs.org/) - The server-side JavaScript runtime environment.
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)]
* [Express JS](https://expressjs.com/) - The web application framework 

## Build Setup
 
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name library, 
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](#end-points)

## Set up .env file
Open .env.example file and create new .env file on your favorite code editor, and copy paste this code below :
```
APP_PORT= 8080
APP_URL= http://localhost:8080/
APP_TOKEN_KEY= *anyrandomstring*

DB_HOST= localhost
DB_USER= root
DB_PASS= root
DB_NAME= library
```


## End Points 
# Auth Routes

- **POST** Login Endpoint Path:```/auth/login```
##### **Output**
  * ```{ "id": XX, "username": "respects",  "email": "respects@admin.com",  "roles": "admin", "token": *token* }```
  
- **POST** SignUp Endpoint Path:```/auth/signup```
##### **Output**
  * ```{ "username": "respects", "email": "respects@admin.com", "roles": "admin"  } ```

# Books Routes

- **GET** Get All Books Endpoint Path: ```books?search&sort&page&limit``` (Token needed)
 
- **GET** Get Books by Genre Endpoint Path: ```books/:genre``` (Token needed)
 
- **POST** Create Books Endpoint Path: ```books/``` (Token needed, Admin Permit)
 ##### **Output**
  * ```{ "id": XX, "title" : "Good Omens", "description" : "The book is a comedy about the birth of the son of Satan and the coming of the End Times. There are attempts by the angel Aziraphale and the demon Crowley to sabotage the coming of the end times, having grown accustomed to their comfortable surroundings in England.", "image": "cover/BOOKS_1591752123767.jpg", "genre": ["fantasy", "comedy", "horror" ],"author": [ "neil gaiman", "terry pratchett" ] , "status": 'Available', "release_date": "1990-05-10, 00:00:00"  }```
  
- **PATCH** Update Books Endpoint Path: ```books/:id``` (Token needed, Admin Permit)
 ##### **Output**
* ```{ "id": XX, "title" : "Good Omens", "description" : "The book is a comedy about the birth of the son of Satan and the coming of the End Times. There are attempts by the angel Aziraphale and the demon Crowley to sabotage the coming of the end times, having grown accustomed to their comfortable surroundings in England.", "image": "cover/BOOKS_1591752123767.jpg", "genre": ["fantasy", "comedy", "horror" ],"author": [ "neil gaiman", "terry pratchett" ] , "status": 'Available', "release_date": "1990-05-10, 00:00:00"  }```

- **DELETE** Books Endpoint Path: ```books/:id``` (Token needed, Admin Permit)

# Genre Routes

- **GET** Get All Genres Endpoint Path: ```genre/``` (Token needed)

- **POST** Create Genre Endpoint Path: ```genre/``` (Token needed, Admin Permit)
 ##### **Output**
 * ```{"id":XX, "genre": "action", "created_at": "2020-06-10T01:22:03.000Z", "updated_at": "2020-06-10T01:22:03.000Z", "deleted_at": null}```

- **PATCH** Update Genre Endpoint Path: ```genre/:id``` (Token needed, Admin Permit)
##### **Output**
 * ```{"id":XX, "genre": "action", "created_at": "2020-06-10T01:22:03.000Z", "updated_at": "2020-06-12T01:22:03.000Z", "deleted_at": null}```
 
- **DELETE** Delete Genre Endpoint Path: ```genre/:id``` (Token needed, Admin Permit)

# Loans Routes

- **GET** Get Loaned Book Endpoint Path: ```loans/book``` (Token needed, Admin Permit)

- **GET** Get Loan By User Endpoint Path: ```loans/user/:id``` (Token needed)

- **GET** Get Loan By Id Endpoint Path: ```loans/:id``` (Token needed)

- **GET** Get Loan List Path: ```loans/``` (Token needed)

- **POST** Loans Endpoint Path: ```loans/``` (Token needed, User Permit)
##### **Output**
 *``` { "id": 35, "user_id": 44, "username": "userlupa", "book": [  "One Piece",  "Naruto"  ], "loan_date": "2020-08-03", "due_date": "2020-08-05", "status": "On Loan" }```
 
- **PATCH** Loans Endpoint Path: ```loans/:id``` (Token needed, User Permit)
*```{ "id": 35, "user_id": 44, "username": "userlupa", "loan_date": "2020-08-02T18:39:51.000Z","due_date": "2020-08-04T17:00:00.000Z", "return_date": "2020-08-02T18:44:50.000Z", "status_id": 3 }```

