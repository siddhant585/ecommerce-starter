/* create orders table */
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(64),
    total_cents INT NOT NULL CHECK (total_cents > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_session_token ON orders (session_token);