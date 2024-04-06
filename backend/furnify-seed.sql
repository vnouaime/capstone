INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'testuser@test.com'),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User2',
        'testuser2@test.com');

INSERT INTO carts (username, products, total) 
VALUES
  ('testuser', ARRAY['W00044450', 'BZ234248'], 345.87),
  ('testuser2', ARRAY['DZ494949494', 'L00L48239042'], 654.62);


INSERT INTO orders (username, products, total, shipping_address)
VALUES
        ('testuser', ARRAY['W00044450', 'BZ234248'], 345.87, '41 testing road, Test, TE, 12345'),
        ('testuser', ARRAY['PL12281', 'L008181'], 2311.23, '41 testing road, Test, TE, 12345'),
        ('testuser2', ARRAY['DZ494949494', 'L00L48239042'], 654.62, '101 testing2 road, Test2, MA, 54321');