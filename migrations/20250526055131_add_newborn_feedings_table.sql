-- +goose Up
-- +goose StatementBegin
CREATE TABLE newborn_feedings (
  id SERIAL PRIMARY KEY,
  "type" VARCHAR(255) NOT NULL,
  unit VARCHAR(255) NOT NULL,
  amount INT NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE newborn_feedings
-- +goose StatementEnd
