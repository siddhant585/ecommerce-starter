/*create sessions table*/
CREATE TABLE sessions ( 
    token VARCHAR(64) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

/* index for expires_at */
CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);
