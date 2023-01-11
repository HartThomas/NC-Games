# NC-Games by Thomas Hart

An API for the back end of a Northcoders board game site, where users can post reviews and comments and vote on them.

It uses a PSQL database and is built with Express and hosted on Cyclic using ElephantSQL.

The hosted version can be found here https://vast-pink-oyster-ring.cyclic.app/api

## installation

```
$ git clone https://github.com/HartThomas/NC-Games
$ cd NC-Games
$ npm install pg, express
```

## setup

You will need to create two .env files, one for development and one for test. <br />
In these files write 'PGDATABASE=<database-name>' just add '-test' on the end of the test file.

## testing

```
$ npm install supertest -D
$ npm install husky, jest
$ npm t
```

## usage

```
$ npm run setup-dbs
$ npm run seed
```
