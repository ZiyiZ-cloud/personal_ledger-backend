
INSERT INTO users(username, password, first_name, last_name, email)
VALUES ('testuser',
        'test',
        'Test',
        'User',
        'joel@joelburton.com'
        ),
        ('first',
        'first',
        'last',
        'first',
        'first@joelburton.com'
        );

INSERT INTO expenses (
    id,
    amount ,
    category,
    detail,
    date, 
    username)
VALUES (1, 20.53, 'Education', 'books', '01-01-2022', 'testuser'),
       (2, 1900.00, 'Rent', 'apartment', '06-02-2021', 'testuser'),
       (3, 1900.00, 'Rent', 'apartment', '06-02-2021', 'first'),
       (4, 1900.00, 'Rent', 'apartment', '06-02-2021', 'first'),
       (5, 1900.00, 'Rent', 'apartment', '06-02-2021', 'first');
