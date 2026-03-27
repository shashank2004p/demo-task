## Express + MongoDB Task API

Implements the Postman collection endpoints:

- **User**
  - `POST /signup`
  - `POST /login`
- **Todo**
  - `POST /add_task`
  - `GET /all_task`
  - `GET /view_single_task/:id`
  - `POST /task_status` (also supports `POST /task_status/:id`)
  - `POST /update_task/:id`
  - `GET /delete_task/:id`
  - `POST /tasks_reorder`

### Setup

1) Install

```bash
npm install
```

2) Create `.env`

Copy `.env.example` to `.env` and set values:

- `MONGODB_URI`
- `JWT_SECRET`

3) Run

```bash
npm run dev
```

Server starts on `http://localhost:5000` by default.

### Auth header

For protected routes use:

- `Authorization: Bearer <token>`

