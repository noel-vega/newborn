-- +goose Up
-- +goose StatementBegin
CREATE TABLE diaper_changes (
    id SERIAL PRIMARY KEY,
    "type" VARCHAR(255) NOT NULL,
    notes VARCHAR(255) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE diaper_changes
-- +goose StatementEnd
