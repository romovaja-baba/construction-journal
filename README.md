# Журнал работ — строительный объект

Веб-приложение для учёта выполненных работ на объекте: дата, вид работ, объём, исполнитель, фильтрация по периоду, сортировка, CRUD записей и справочник видов работ.

---

## Стек

| Слой                 | Технологии                     | Зачем                                                                                      |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| **Frontend**         | React 18, TypeScript, Vite     |
| **UI**               | Tailwind CSS                   | Единый внешний вид без тяжёлого UI-kit                                                     |
| **Таблица и данные** | TanStack Table, TanStack Query | Сортировка и состояния загрузки без лишней обвязки                                         |
| **Формы**            | React Hook Form, Zod           | Валидация с минимумом ре-рендеров                                                          |
| **Backend**          | Go, Gin                        | Один бинарник, предсказуемая производительность, простой REST                              |
| **Данные**           | PostgreSQL, GORM               | Надёжное хранение связей «запись ↔ вид работ»; авто-миграции и seed справочника при старте |
| **Продакшен**        | Docker, nginx                  | Статика фронта и прокси `/api` в одном контейнере; воспроизводимый запуск                  |

---

## Быстрый запуск

Нужны [Docker](https://docs.docker.com/get-docker/) и Docker Compose v2.

```bash
cd construction-journal
docker compose up --build
```

После сборки:

| Сервис                            | URL                       |
| --------------------------------- | ------------------------- |
| Приложение (UI + API через nginx) | http://localhost          |
| API напрямую (опционально)        | http://localhost:8080/api |

Остановка:

```bash
docker compose down
```

Удалить данные БД:

```bash
docker compose down -v
```

---

## Локальная разработка

### 1. База данных

```bash
docker compose up -d postgres
```

Поднимется только PostgreSQL: `journal` / `journal`, БД `journal`, порт `5432`.

### 2. Backend

```bash
cd backend
```

Создайте `.env` (или экспортируйте переменные):

```env
DB_HOST=localhost
DB_USER=journal
DB_PASSWORD=journal
DB_NAME=journal
DB_PORT=5432
PORT=8080
```

```bash
go mod tidy
go run ./cmd/api
```

API: http://localhost:8080/api — при первом запуске GORM создаст таблицы и заполнит справочник видов работ.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: http://localhost:5173 — запросы к `/api` проксируются на backend (см. `frontend/vite.config.ts`).

---

## API

| Метод    | Путь                                                       | Описание                                                                                   |
| -------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `GET`    | `/api/work-types`                                          | Список видов работ                                                                         |
| `POST`   | `/api/work-types`                                          | Добавить вид работ                                                                         |
| `GET`    | `/api/entries?date_from=&date_to=&page=&page_size=&order=` | Журнал (фильтр, пагинация, сортировка по дате: `order=asc` \| `desc`, по умолчанию `desc`) |
| `POST`   | `/api/entries`                                             | Создать запись                                                                             |
| `PUT`    | `/api/entries/:id`                                         | Обновить запись                                                                            |
| `DELETE` | `/api/entries/:id`                                         | Удалить запись                                                                             |

---

## Структура проекта

```
construction-journal/
├── backend/
│   ├── cmd/api/              # Точка входа
│   ├── internal/
│   │   ├── app/http/         # Роутер Gin, HTTP-обработчики
│   │   ├── database/         # Подключение, миграции, seed
│   │   ├── dto/, models/
│   │   ├── repository/
│   │   └── service/
│   └── Dockerfile
├── frontend/
│   ├── src/                  # React-приложение
│   ├── nginx.conf            # Прокси /api → backend (в Docker)
│   └── Dockerfile
├── docker-compose.yml        # postgres, backend, frontend
└── README.md
```

---

## Реализованный функционал

- Журнал: дата, вид работ, объём + единица, исполнитель
- Фильтр по диапазону дат, пагинация (25 записей на страницу), сортировка по дате
- Создание, редактирование, удаление с подтверждением
- Справочник видов работ в PostgreSQL (предзаполнен при первом старте)
