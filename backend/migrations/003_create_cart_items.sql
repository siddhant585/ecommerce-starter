CREATE TABLE cart_items ( 
    session_token VARCHAR(64),
    product_id INT,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (session_token) REFERENCES sessions(token) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (session_token, product_id)
);