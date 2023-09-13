# BigLab 2 - Class: 2022 AW1

## Team name: Le Braciole

Team members:
* s303480 TABARE' VITTORIO
* s303462 SCIARA LORENZO 
* s305902 RUBERTO LUCA
* s295491 SIRAGUSA PIERGIUSEPPE

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://polito-wa1-aw1-2022.github.io/materials/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://polito-wa1-aw1-2022.github.io/materials/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once you cloned this repository, please write the group name and names of the members of the group in the above section.

In the `client` directory, do **NOT** create a new folder for the project, i.e., `client` should directly contain the `public` and `src` folders and the `package.json` files coming from BigLab1.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but please double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.
Remember that `npm install` should be executed inside the `client` and `server` folders (not in the `BigLab2` root directory).

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## Registered Users

Here you can find a list of the users already registered inside the provided database. This information will be used during the fourth week, when you will have to deal with authentication.
If you decide to add additional users, please remember to add them to this table (with **plain-text password**)!

| email | password | name |
|-------|----------|------|
| john.doe@polito.it | password | John |
| mario.rossi@polito.it | password | Mario |
| testuser@polito.it | password | Test |


## List of APIs offered by the server

Provide a short description of the API you designed, with the required parameters. Please follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [A (small) sample request, with body (if any)]
* [A (small) sample response, with body (if any)]
* [Error responses, if any]

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __List Films__

URL: `/api/films`

Method: GET

Description: Get all the films that the user saw.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a film.
```
[{
     { id: 1,
     title: 'Taxi Driver', 
     favorite: 1, 
     watchdate: dayjs('2022-03-10'), 
     rating: 5 },

},   { id: 2, 
    title: 'Forrest Gump', 
    favorite: 0, 
    watchdate: dayjs('2022-04-17'), 
    rating: 4 },
...
]
```

### __Get a Film (By Code)__

URL: `/api/films/:id`

Method: GET

Description: Get the film identified by the code `id`.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong code), or `500 Internal Server Error` (generic error).

Response body: An object, describing a single course.
```
{
     { id: 1,
     title: 'Taxi Driver', 
     favorite: 1, 
     watchdate: dayjs('2022-03-10'), 
     rating: 5 
}

```

### __Get Films that fulfill a given filter(By Filter)__

URL: `/api/films/filter/:filter`

Method: GET

Description: Get the films that fulfill a given filter `filter`.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong code), or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a film.
```
[{
     { id: 1,
     title: 'Taxi Driver', 
     favorite: 1, 
     watchdate: dayjs('2022-03-10'), 
     rating: 5 },

},   { id: 2, 
    title: 'Forrest Gump', 
    favorite: false, 
    watchdate: dayjs('2022-04-17'), 
    rating: 5 },
...
]

```

### __Add a New Film__

URL: `/api/films`

Method: POST

Description: Add a new film to the list of the films.

Request body: An object representing a film (Content-Type: `application/json`).
```
{    title: 'Taxi Driver', 
     favorite: 1, 
     watchdate: dayjs('2022-03-10'), 
     rating: 5,
}
```

Response: `201 Created` (success) or `503 Service Unavailable` (generic error, e.g., when trying to insert an already existent film). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### __Update a Film

URL: `/api/films/:id`

Method: PUT

Description: Update entirely an existing film, identified by its id.

Request body: An object representing the entire film (Content-Type: `application/json`).
```
{    title: 'Taxi Driver', 
     favorite: 1, 
     watchdate: dayjs('2022-03-10'), 
     rating: 5,

}
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### __Mark a Film as favorite/unfavorite

URL: `/api/films/:id/favorite`

Method: PUT

Description: Mark favorite/unfavorite an existing film, identified by its id.

Request body: An object representing the entire film (Content-Type: `application/json`).
```
{   favorite: 1  }
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### __Delete a Film__

URL: `/api/films/:id`

Method: DELETE

Description: Delete an existing film, identified by its id.

Request body: _None_

Response: `204 No Content` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

### __LogIn__

URL: `/api/sessions`

Method: POST

Description: Send username and password for the logIn.

Request body: An object representing a user (Content-Type: `application/json`).
```
{    user: 'testuser@polito.it', 
     password: 'password', 
}
```

Response: `200 OK` (success) or `401 Wrong username and/or password` or `503 Service Unavailable` (generic error).

Response body: An object, describing the user.
```
{    id: 1
     username: 'testuser@polito.it', 
     name: 'test', 
}
```

### __LogOut__

URL: `/api/sessions/current`

Method: DELETE

Description: logOut.

Request body: _None_

Response: `200 OK` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

### __List Users__

URL: `/api/sessions/current`

Method: GET

Description: Get all the user.

Request body: _None_

Response: `200 OK` (success) or `401 Unauthenticated user!` (Unauthenticated user) or `500 Internal Server Error` (generic error).

Response body: An object, describing the user.
```
{    id: 1
     username: 'testuser@polito.it', 
     name: 'test', 
}
```