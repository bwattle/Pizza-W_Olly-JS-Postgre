CREATE TABLE "OrderItems" (
  "id" SERIAL PRIMARY KEY,
  "order_id" int,
  "ingredients" varchar,
  "quantity" int
);

CREATE TABLE "Orders" (
  "id" SERIAL PRIMARY KEY,
  "ready_by" timestamp,
  "delivery" boolean,
  "address" varchar,
  "postcode" varchar,
  "cash" boolean,
  "name" varchar,
  "credit_card" varchar,
  "ccv" varchar
);

ALTER TABLE "OrderItems" ADD FOREIGN KEY ("order_id") REFERENCES "Orders" ("id");
