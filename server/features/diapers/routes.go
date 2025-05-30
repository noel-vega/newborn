package diapers

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func RegisterRoutes(mux *http.ServeMux, db *pgxpool.Pool) {
	h := NewHandler(db)

	mux.HandleFunc("GET /api/diapers", h.DiapersList)
	mux.HandleFunc("POST /api/diapers", h.DiapersCreate)
	mux.HandleFunc("GET /api/diapers/latest", h.DiapersLatest)
	mux.HandleFunc("DELETE /api/diapers/{id}", h.DiapersDelete)
	mux.HandleFunc("PATCH /api/diapers/{id}", h.DiapersUpdate)
}