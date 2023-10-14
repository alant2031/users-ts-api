# users-ts-api

Node API + Typescript + MongoDB + Mocha Tests

## Instalação

1. Renomeie o arquivo _.env.ex_ para _.env_
2. Instale as bibliotecas com `yarn` ou `npm install`
3. Execute docker-compose bara subir container do mongo: `docker-compose up -d`
4. Execute `yarn start:dev` para iniciar a API
5. Execute `yarn test` para rodar os testes da API

## Rotas e Métodos HTTP

Utilize a rota /users

1. **POST /users** Request Body:</br>

```
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "test@gm.com",
  "password": "abc123",
}

```

2. **GET /users** Response Body:</br>

```
[
  {
    "id": "64fcd43c9ac0ef7759405e1c",
    "firstName": "John",
    "lastName": "Smith",
    "email": "test@gm.com",
    "password": "abc123",
  }
]
```

3. **PATCH /users/id** Request Body:</br>

```
{
  "lastName": "Doe",
}
```

4. **DELETE /users/id** Response Body:</br>

```
{}

```
