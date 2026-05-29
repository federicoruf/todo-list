# todo-list

## Backend

### Requirements

- Node.js
- MongoDB
- Docker

### Installation

```bash
npm install
```

Initialize the database
```bash
npm run db:init
```

### Running

```bash
npm start
```

### Endpoints

| Method | Endpoint | Description | Curl |
| --- | --- | --- | --- |
| GET | /health | Health check |
| GET | /duties | Get all duties | 
| GET | /duties/:id | Get a duty by id |
| POST | /duties | Create a new duty |
| PUT | /duties/:id | Update a duty by id |
| DELETE | /duties/:id | Delete a duty by id |

#### curl examples

##### Health check
```bash
curl http://localhost:3001/health
```

##### Crear
```bash
curl -s -X POST http://localhost:3001/duties \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Tarea de prueba\"}"
```

##### Listar (ver el id)
```bash
curl -s http://localhost:3001/duties
```

##### Actualizar (pega el id)
```bash
curl -s -X PUT http://localhost:3001/duties/PEGA_AQUI_EL_ID \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Tarea actualizada\"}"
```

##### Borrar
```bash
curl -s -X DELETE http://localhost:3001/duties/PEGA_AQUI_EL_ID -w "\nHTTP %{http_code}\n"
```

### Database

Access to the container: 
```bash
docker exec -it todo-list-db psql -U todo -d todo_list
```

Then inside psql:
```bash
\dt                    -- list tables
```

```bash
SELECT * FROM duties;  -- see rows
```
```bash
\q                     -- quit
```

## Frontend

### Requirements

- Node.js
- NPM
- Yarn

### Installation

```bash
yarn install
```

### Running

```bash
yarn start
```     