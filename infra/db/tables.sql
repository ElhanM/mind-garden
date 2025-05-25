-- Next auth
CREATE TABLE verification_token
(
    identifier TEXT        NOT NULL,
    expires    TIMESTAMPTZ NOT NULL,
    token      TEXT        NOT NULL,

    PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts
(
    id                  SERIAL,
    "userId"            INTEGER      NOT NULL,
    type                VARCHAR(255) NOT NULL,
    provider            VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token       TEXT,
    access_token        TEXT,
    expires_at          BIGINT,
    id_token            TEXT,
    scope               TEXT,
    session_state       TEXT,
    token_type          TEXT,

    PRIMARY KEY (id)
);

CREATE TABLE sessions
(
    id             SERIAL,
    "userId"       INTEGER      NOT NULL,
    expires        TIMESTAMPTZ  NOT NULL,
    "sessionToken" VARCHAR(255) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE users
(
    id              SERIAL,
    name            VARCHAR(255),
    email           VARCHAR(255),
    "emailVerified" TIMESTAMPTZ,
    image           TEXT,

    PRIMARY KEY (id)
);

ALTER TABLE "accounts" ADD CONSTRAINT "fk_accounts_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sessions" ADD CONSTRAINT "fk_sessions_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Daily check-ins table
CREATE TABLE daily_check_ins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    mood VARCHAR(20) NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'down', 'bad')),
    stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 5),
    journal_entry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(user_id, check_in_date)
);

-- Chat
CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role VARCHAR(9) NOT NULL CHECK (role IN ('user', 'system', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);