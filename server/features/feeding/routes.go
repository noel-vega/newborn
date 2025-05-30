package feeding

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func RegisterRoutes(mux *http.ServeMux, db *pgxpool.Pool) *http.ServeMux {
	h := NewHandler(db)

	mux.HandleFunc("GET /api/feedings", h.NewbornFeedingList)
	mux.HandleFunc("POST /api/feedings", h.NewbornFeedingCreate)
	mux.HandleFunc("DELETE /api/feedings/{id}", h.NewbornFeedingDelete)
	mux.HandleFunc("PATCH /api/feedings/{id}", h.NewbornFeedingUpdate)
	mux.HandleFunc("GET /api/feedings/latest", h.NewbornFeedingLatest)
	return mux
}
