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

-- Daily check-ins table
CREATE TABLE daily_check_ins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    mood VARCHAR(20) NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'down', 'bad')),
    stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 5),
    journal_entry TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(user_id, check_in_date)
);