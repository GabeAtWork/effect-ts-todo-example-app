# Effect-ts example todo app

Main tools:
* Backend: ExpressJS, slonik
* Frontend: React

## First-time install

* Install the dependencies with the `yarn` command
* Create a postgres database
* Copy `packages/backend/.env.sample` into `packages/backend/.env` and set your local postgres connection info
* Run `yarn w backend db-migrate`

## Running the app

* Start the server with `yarn w backend dev`
* Start the frontend with `yarn w frontend dev`

## Roadmap

What needs to be implemented for the app to be complete

- [x] Basic backend (1 repo, escape hatch controllers)
- [x] Basic frontend (read-only)
- [ ] Backend: use Effect-TS/express
- [ ] Advanced backend: sharing a transaction between repositories
