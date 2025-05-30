package diapers

import (
	"context"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DiaperChange struct {
	ID int `json:"id"`
	Type string `json:"type"`
	Notes string `json:"notes"`
	ChangedAt time.Time `json:"changedAt"`
}

type InsertDiaperChange struct {
	Type string `json:"type"`
	Notes string `json:"notes"`
	ChangedAt time.Time `json:"changedAt"`
}

type UpdateDiaperChange struct {
	Type *string `json:"type,omitempty"`
	Notes *string `json:"notes,omitempty"`
	ChangedAt *time.Time `json:"changedAt,omitempty"`
}

type DiaperChangesModel struct {
	DB *pgxpool.Pool
}

func (m *DiaperChangesModel) List() ([]DiaperChange, error) {
	diaperChanges := []DiaperChange{}

	query := "SELECT * FROM diaper_changes ORDER BY changed_at DESC"
	rows, err := m.DB.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		d := DiaperChange{}
		err := rows.Scan(&d.ID, &d.Type, &d.Notes, &d.ChangedAt)
		if err != nil {
			return nil, err
		}
		diaperChanges = append(diaperChanges, d)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return diaperChanges, nil
}

func (m *DiaperChangesModel) GetById(id int) (*DiaperChange, error) {
	d := &DiaperChange{}

	query := `SELECT * FROM diaper_changes WHERE id=$1`
	row := m.DB.QueryRow(context.Background(), query, id)
	err := row.Scan(&d.ID, &d.Type, &d.Notes, &d.ChangedAt)
	if err != nil {
		return nil, err
	}

	return d, nil
}

func (m *DiaperChangesModel) Latest() (*DiaperChange, error) {
	d := &DiaperChange{}

	query := "SELECT * FROM diaper_changes ORDER BY changed_at DESC LIMIT 1"
	row := m.DB.QueryRow(context.Background(), query)
	err := row.Scan(&d.ID, &d.Type, &d.Notes, &d.ChangedAt)
	if err != nil {
		return nil, err
	}

	return d, nil
}

func (m *DiaperChangesModel) Insert(d *InsertDiaperChange) error {
	query := `
		INSERT INTO diaper_changes("type", notes, changed_at) 
		VALUES($1, $2, $3)`
	_, err := m.DB.Exec(context.Background(), query, d.Type, d.Notes, d.ChangedAt)
	if err != nil {
		return err 
	}
	return nil
}

func (m *DiaperChangesModel) Delete(id int) error {
	query := `DELETE FROM diaper_changes WHERE id=$1`
	_, err := m.DB.Exec(context.Background(), query, id)
	if err != nil {
		return err
	}
	return nil
}

func (m *DiaperChangesModel) Update(id int, u *UpdateDiaperChange) error {
	sb := sq.Update("diaper_changes").Where(sq.Eq{"id": id})

	if u.Type != nil {
		sb = sb.Set("type", *u.Type)
	}

	if u.Notes != nil {
		sb = sb.Set("notes", *u.Notes)
	}

	if u.ChangedAt != nil {
		sb = sb.Set("changed_at", *u.ChangedAt)
	}

	query, args, err := sb.PlaceholderFormat(sq.Dollar).ToSql()
	if err != nil {
		return err
	}

	_, err = m.DB.Exec(context.Background(), query, args...)
	if err != nil {
		return err
	}
	return nil
}