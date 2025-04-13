create extension if not exists "uuid-ossp";

CREATE TYPE status_type AS ENUM ('OPEN', 'ORDERED');

create table carts (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    status status_type
);

create table cart_items (
    id uuid not null default uuid_generate_v4() primary key,
    cart_id uuid not null references carts(id),
    product_id uuid not null,
    count int not null
);


insert into carts (user_id, created_at, updated_at, status) values
(uuid_generate_v4(), now(), now(), 'OPEN');

with usercart as (
    select id from carts LIMIT 1
)
insert into cart_items (cart_id, product_id, count) values
((select id from usercart), uuid_generate_v4(), 2),
((select id from usercart), uuid_generate_v4(), 1),
((select id from usercart), uuid_generate_v4(), 1);



-- create table store {
--     id int not null default uuid_generate_v4() primary key,
--     title text not null,
-- };

-- create table product {
--     id int not null default uuid_generate_v4() primary key,
--     title text not null,
--     store_id int not null references store(id),
-- };

-- create table customer {
--     id int not null default uuid_generate_v4() primary key,
--     first_name text not null,
--     last_name text not null,
--     is_active boolean not null,
-- };

-- create table order {
--     id int not null default uuid_generate_v4() primary key,
--     customer_id int not null references customer(id),
--     created_at timestamp not null,
--     updated_at timestamp not null,
-- };

-- create table personal_info {
--     id int not null primary key,
--     address text not null,
--     city text not null,
--     country text not null,
--     foreign key (id) references customer(id) on delete cascade,
-- };

