package feeding

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/noel-vega/newborn-feeding/internal"
)

type Handler struct {
	DB                  pgxpool.Pool
	NewbornFeedingModel NewbornFeedingModel
}

func NewHandler(db *pgxpool.Pool) *Handler {
	return &Handler{
		NewbornFeedingModel: NewbornFeedingModel{DB: db},
	}
}

func (h *Handler) NewbornFeedingList(w http.ResponseWriter, r *http.Request) {
	config := ListFeedingsConfig{}

	dateStr := r.URL.Query().Get("date")
	timezone := r.URL.Query().Get("timezone")

	if dateStr != "" && timezone != "" {
		utcTime, err := time.Parse(time.RFC3339Nano, dateStr)
		if err != nil {
			internal.ServerError(w, err)
			return
		}

		loc, err := time.LoadLocation(timezone)
		if err != nil {
			internal.ServerError(w, err)
			return
		}
		userLocalTime := utcTime.In(loc)

		date := time.Date(
			userLocalTime.Year(),
			userLocalTime.Month(),
			userLocalTime.Day(),
			userLocalTime.Hour(), userLocalTime.Minute(), userLocalTime.Second(), 0,
			loc) 
		config.Date = &date
	}

	feedings, err := h.NewbornFeedingModel.List(config)
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	data, err := json.Marshal(feedings)
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func (h *Handler) NewbornFeedingCreate(w http.ResponseWriter, r *http.Request) {
	f := &InsertNewbornFeeding{}
	err := json.NewDecoder(r.Body).Decode(f)
	if err != nil {
		internal.ServerError(w, err)
		return
	}
	err = h.NewbornFeedingModel.Insert(f)
	if err != nil {
		internal.ServerError(w, err)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (h *Handler) NewbornFeedingDelete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fmt.Println("invalid id")
		internal.ServerError(w, err)
		return
	}

	err = h.NewbornFeedingModel.Delete(id)
	if err != nil {
		fmt.Println("db error")
		internal.ServerError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) NewbornFeedingUpdate(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fmt.Println("invalid id")
		internal.ServerError(w, err)
		return
	}

	updates := &UpdateNewbornFeeding{}

	err = json.NewDecoder(r.Body).Decode(updates)
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	err = h.NewbornFeedingModel.Update(id, updates)
	if err != nil {
		internal.ServerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *Handler) NewbornFeedingLatest(w http.ResponseWriter, r *http.Request) {
	f, err := h.NewbornFeedingModel.Latest()
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	data, err := json.Marshal(f)
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
