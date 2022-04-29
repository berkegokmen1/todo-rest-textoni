# REST API for todo lists

## Tech

This project uses a number of open source projects to work properly:

- [Express] - Fast node.js network app framework
- [node.js] - Evented I/O for the backend
- [JWT] - Industry standard RFC 7519 method for representing claims securely between two parties.
- [MongoDB] - NoSQL database to store information.
- [Mongoose] - Elegant mongodb object modeling for node.js.
- [Bcryptjs] - Hashing information securely and rapidly.

And of course this project itself is open source with a [public repository][repo] on GitHub.

### Running server locally

Clone or download the project to your local machine. Specify the arguments in the `.env` file in the root of the project. You can find a sample in `./.env.example` file.

then run the following commands.

```bash
npm install
npm run dev
```

### Documentation

Full documentation can be found [here][docs].

### License

[MIT](https://choosealicense.com/licenses/mit/)

[docs]: ./DOCUMENTATION.md
[repo]: https://github.com/berkegokmen1/todo-rest-textoni
[node.js]: http://nodejs.org
[express]: http://expressjs.com
[jwt]: https://jwt.io
[mongodb]: https://www.mongodb.com
[mongoose]: https://mongoosejs.com
[bcryptjs]: https://www.npmjs.com/package/bcryptjs
