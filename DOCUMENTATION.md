# **TODO REST API DOCUMENTATION**

# Table of Contents

- [User Routes](#user-routes)
  - [Register](#register)
  - [Login](#login)
  - [Get Profile](#get-profile)
  - [Logout](#logout)
  - [Logout All](#logout-all)
- [Todo Routes](#todo-routes)
  - [Create](#create)
  - [Get Todos](#get-todos)
  - [Get Todo by ID](#get-todo-by-id)
  - [Update Todo](#update-todo)
  - [Delete Todo](#delete-todo)

## **User-Routes**

> #### **Register**

- URL: &nbsp; `/auth/register`
- Method: &nbsp; `PUT`
- URL Params: &nbsp; `none`
- Success Response:
  - Code: `201`
  - Content: `{ "_id": "[id]", "accessToken": "[JWT TOKEN]" }`
- Error Response 1:
  - Code: `409`
  - Content: `{ "error": "Username already exists." }`
- Error Response 2:
  - Code: `406`
  - Content: `{ "error": Username and password must be specified." }`
- Error Response 3:
  - Code: `400`
- Sample call:

```js
axios.put('http://localhost:4000/auth/register', {
  username: 'berke',
  password: 'pass',
});
```

> #### **Login**

- URL: &nbsp; `/auth/login`
- Method: &nbsp; `POST`
- URL Params: &nbsp; `none`
- Success Response:
  - Code: `200`
  - Content: `{ "accessToken": "[JWT TOKEN]" }`
- Error Response 1:
  - Code: `403`
  - Content: `{ "error": "User not found." }`
- Error Response 2:
  - Code: `403`
  - Content: `{ "error": "Invalid credentials." }`
- Error Response 3:
  - Code: `406`
  - Content: `{ "error": Username and password must be specified." }`
- Sample call:

```js
axios.post('http://localhost:4000/auth/login', {
  username: 'berke',
  password: 'pass',
});
```

> #### **Get Profile**

- URL: &nbsp; `/auth/me`
- Method: &nbsp; `POST`
- URL Params: &nbsp; `none`
- Query Params: &nbsp; `?expand_todo=[true/1]`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `200`
  - Content: `{ "username": "berkegokmen1", "createdAt": "XXX", todolist: [] }`
- Sample call:

```js
axios.get(
  'http://localhost:3000/auth/me?expand_todo=1',
  {},
  {
    headers: { Authorization: `Bearer [TOKEN]` },
  }
);
```

> #### **Logout**

- URL: &nbsp; `/auth/logout`
- Method: &nbsp; `POST`
- URL Params: &nbsp; `none`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `200`
  - Content: `{ "message": "Logout successful" }`
- Error Response 1:
  - Code: `401`
  - Content: `{ "error": "jwt expired" }`
- Error Response 2:
  - Code: `400`
  - Content: `{ "error": "Invalid format for the token." }`
- Sample call:

```js
axios.post(
  'http://localhost:3000/auth/logout',
  {},
  {
    headers: { Authorization: `Bearer [TOKEN]` },
  }
);
```

> #### **Logout All**

- URL: &nbsp; `/auth/logoutall`
- Method: &nbsp; `POST`
- URL Params: &nbsp; `none`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `200`
  - Content: `{ "message": "Logout from all successful" }`
- Error Response 1:
  - Code: `401`
  - Content: `{ "error": "jwt expired" }`
- Sample call:

```js
axios.post(
  'http://localhost:3000/auth/logoutall',
  {},
  {
    headers: { Authorization: `Bearer [TOKEN]` },
  }
);
```

## **Todo-Routes**

> #### **Create**

- URL: &nbsp; `/todo/me`
- Method: &nbsp; `PUT`
- URL Params: &nbsp; `none`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `201`
  - Content: `{ "_id": "[id]" }`
- Error Response 1:
  - Code: `400`
  - Content: `{ "error": "Title must be specified." }`
- Sample call:

```js
axios.put('http://localhost:4000/todo/me', {
  title: 'create rest api documantation',
  description: ':)',
});
```

> #### **Get Todos**

- URL: &nbsp; `/todo/me`
- Method: &nbsp; `GET`
- URL Params: &nbsp; `none`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `200`
  - Content: `{ "todos" : [] }`
- Sample call:

```js
axios.get('http://localhost:4000/todo/me');
```

> #### **Get Todo by ID**

- URL: &nbsp; `/todo/:id`
- Method: &nbsp; `GET`
- URL Params: &nbsp; `id`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `200`
  - Content: `{ "_id": "[id]", "title": "create documentation", "description": "for textoni-todo-rest" }`
- Sample call:

```js
axios.get('http://localhost:4000/todo/me');
```

> #### **Search**

- URL: &nbsp; `/todo/me/search`
- Method: &nbsp; `PUT`
- URL Params: &nbsp; `none`
- Query Params: &nbsp; `?q=[QUERY STRING]`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `200`
  - Content: `{ "todos": [] }`
- Error Response 1:
  - Code: `400`
  - Content: `{ "error": "Please provide a query string." }`
- Error Response 2:
  - Code: `400`
  - Content: `{ "error": "Query string cannot be longer than 16 characters." }`
- Sample call:

```js
axios.get('http://localhost:4000/todo/me/search?q=rest');
```

> #### **Update Todo**

- URL: &nbsp; `/todo/:id`
- Method: &nbsp; `POST`
- URL Params: &nbsp; `id`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `200`
  - Content: `{ "message": "Todo updated" }`
- Error Response 1:
  - Code: `400`
  - Content: `{ "error": "New title or description must be specified." }`
- Error Response 2:
  - Code: `404`
  - Content: `{ "error": "Todo not found." }`
- Sample call:

```js
axios.post('http://localhost:4000/todo/626bf65c90cdc47981018724', {
  title: 'new title',
  description: 'new desc',
});
```

> #### **Delete Todo**

- URL: &nbsp; `/todo/:id`
- Method: &nbsp; `POST`
- URL Params: &nbsp; `id`
- Headers: `Authorization: "Bearer [TOKEN]"`
- Success Response:
  - Code: `200`
  - Content: `{ "message": "Todo removed." }`
- Error Response 1:
  - Code: `404`
  - Content: `{ "error": "Todo not found." }`
- Sample call:

```js
axios.delete('http://localhost:4000/todo/626bf65c90cdc47981018724');
```
