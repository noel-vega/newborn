-- +goose Up
-- +goose StatementBegin
ALTER TABLE newborn_feedings
ADD COLUMN feeding_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE newborn_feedings
DROP COLUMN feeding_time
-- +goose StatementEnd
