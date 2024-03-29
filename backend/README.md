## Backend

The backend for TypeBout is written in Typescript and uses:

- Express
- Node
- [Prisma](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
- PostgreSQL
- [Socket-io](https://socket.io/)

Authentication is handled using JWT.

## Development

### Docker

To build the docker container:

```bash
$ docker build .
```

To run the docker image:

```bash
$ docker compose --env-file .env up -d
```

After this you can run the development server locally using:

```bash
$ npm run dev
```

### Testing

Tests are implemented using Jest.

To run the tests:

```bash
$ npm run test
```

Update tests:

```bash
$ npm run test:update
```

### Migrations

Migrations are handled by Prisma with PostgreSQL as the underlying database. To perform a migration simply update the schema and run:

```bash
$ npm run prisma:mg
```

You might be prompted by Prisma to run additional commands. They are necessary to run in order for the migration to work.
