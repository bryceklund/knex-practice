DROP TYPE IF EXISTS grocery;
CREATE TYPE grocery AS ENUM (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'
);

DROP TABLE IF EXISTS shopping_list;
CREATE TABLE shopping_list (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    date_added TIMESTAMP DEFAULT now(),
    checked BOOLEAN DEFAULT false,
    category grocery NOT NULL
);