package feeding

import (
	"context"
	"fmt"
	"log"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type NewbornFeeding struct {
	ID                int       `json:"id"`
	Type              string    `json:"type"`
	UnitOfMeasurement string    `json:"unitOfMeasurement"`
	Amount            int       `json:"amount"`
	FeedingTime       time.Time `json:"feedingTime"`
}

type InsertNewbornFeeding struct {
	Type              string    `json:"type"`
	UnitOfMeasurement string    `json:"unitOfMeasurement"`
	Amount            int       `json:"amount"`
	FeedingTime       time.Time `json:"feedingTime"`
}

type UpdateNewbornFeeding struct {
	Type              *string    `json:"type,omitempty"`
	UnitOfMeasurement *string    `json:"unitOfMeasurement,omitempty"`
	Amount            *int       `json:"amount,omitempty"`
	FeedingTime       *time.Time `json:"feedingTime,omitempty"`
}

type NewbornFeedingModel struct {
	DB *pgxpool.Pool
}

func (m *NewbornFeedingModel) Insert(f *InsertNewbornFeeding) error {
	query := "INSERT INTO newborn_feedings(\"type\", unit, amount, feeding_time) VALUES($1, $2, $3, $4)"
	_, err := m.DB.Exec(context.Background(), query, f.Type, f.UnitOfMeasurement, f.Amount, f.FeedingTime)
	if err != nil {
		return err
	}
	return nil
}

func (m *NewbornFeedingModel) Latest() (*NewbornFeeding, error) {
	f := &NewbornFeeding{}
	query := "SELECT * FROM newborn_feedings ORDER BY feeding_time DESC LIMIT 1"
	row := m.DB.QueryRow(context.Background(), query)

	err := row.Scan(&f.ID, &f.Type, &f.UnitOfMeasurement, &f.Amount, &f.FeedingTime)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return f, nil
}

type ListFeedingsConfig struct {
	Date *time.Time
}

func (m *NewbornFeedingModel) List(config ListFeedingsConfig) ([]NewbornFeeding, error) {

	sb := sq.Select("*").From("newborn_feedings").OrderBy("feeding_time DESC")

	if config.Date != nil {
		start := config.Date.Add(-24 * time.Hour)
		end := config.Date.UTC()
		sb = sb.Where(sq.GtOrEq{"feeding_time": start}).Where(sq.Lt{"feeding_time": end})
	}

	sql, args, err := sb.PlaceholderFormat(sq.Dollar).ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := m.DB.Query(context.Background(), sql, args...)
	if err != nil {
		log.Println("something went wrong", err.Error())
		return nil, err
	}

	defer rows.Close()

	feedings := []NewbornFeeding{}
	for rows.Next() {
		f := NewbornFeeding{}

		err := rows.Scan(&f.ID, &f.Type, &f.UnitOfMeasurement, &f.Amount, &f.FeedingTime)
		if err != nil {
			return nil, err
		}
		feedings = append(feedings, f)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	fmt.Println(feedings)

	return feedings, nil
}

func (m *NewbornFeedingModel) Delete(id int) error {
	query := "DELETE FROM newborn_feedings WHERE ID=$1"
	_, err := m.DB.Exec(context.Background(), query, id)
	if err != nil {
		return err
	}

	return nil
}

func (m *NewbornFeedingModel) Update(id int, updates *UpdateNewbornFeeding) error {
	f := NewbornFeeding{}
	selectByIdQuery := "SELECT * FROM newborn_feedings WHERE ID=$1"
	row := m.DB.QueryRow(context.Background(), selectByIdQuery, id)

	err := row.Scan(&f.ID, &f.Type, &f.UnitOfMeasurement, &f.Amount, &f.FeedingTime)
	if err != nil {
		return err
	}

	if updates.Type != nil {
		f.Type = *updates.Type
	}

	if updates.Amount != nil {
		f.Amount = *updates.Amount
	}

	if updates.UnitOfMeasurement != nil {
		f.UnitOfMeasurement = *updates.UnitOfMeasurement
	}

	if updates.FeedingTime != nil {
		f.FeedingTime = *updates.FeedingTime
	}

	updateQuery := `
		UPDATE newborn_feedings
		SET "type" = $1,
			unit   = $2,
			amount = $3,
			feeding_time = $4
		WHERE ID = $5	
	`
	_, err = m.DB.Exec(context.Background(), updateQuery, f.Type, f.UnitOfMeasurement, f.Amount, f.FeedingTime, f.ID)
	if err != nil {
		return err
	}
	return nil
}
