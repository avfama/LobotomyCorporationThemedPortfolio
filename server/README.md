# Flask backend for LobotomyCorporationThemedPortfolio

This backend records Alert Log entries and Containment Units to a Supabase (Postgres) database.

Files added:
- `server/app.py` — Flask API
- `server/schema.sql` — SQL schema to create required tables
- `server/requirements.txt` — Python dependencies
- `server/.env.example` — example environment variables

Quick start (local):

```bash
# create venv and install
python -m venv .venv
source .venv/bin/activate
pip install -r server/requirements.txt

# copy env
cp server/.env.example .env
# edit .env and fill SUPABASE_URL and SUPABASE_KEY

# run
FLASK_APP=server/app.py FLASK_ENV=development flask run --host=0.0.0.0 --port=5000
```

Applying the SQL schema:

- Use the Supabase SQL editor and paste the contents of `server/schema.sql`, or use psql connected to your Supabase database:

```bash
psql "postgresql://postgres:<YOUR_DB_PASSWORD>@db.<project>.supabase.co:5432/postgres" -f server/schema.sql
```

Render deployment:
- Create a Web Service connected to this repo.
- Build command: `pip install -r server/requirements.txt`
- Start command: `gunicorn server.app:app`
- Add `SUPABASE_URL` and `SUPABASE_KEY` as environment variables in Render.

Security notes:
- For writes from a backend, prefer using a Supabase **service_role** key. Protect this key in environment variables and never commit it.
- Consider enabling Row Level Security and using Postgres policies for fine-grained control if you expose direct DB access from client-side.

