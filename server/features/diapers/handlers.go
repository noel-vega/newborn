package diapers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/noel-vega/newborn-feeding/internal"
)

type Handler struct {
	DiaperChangesModel DiaperChangesModel
}

func NewHandler(db *pgxpool.Pool) *Handler {
	return &Handler{
		DiaperChangesModel: DiaperChangesModel{DB: db},
	}
}

func (h *Handler) DiapersList(w http.ResponseWriter, r *http.Request) {
	diapers, err := h.DiaperChangesModel.List()
	if err != nil {
		internal.ServerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
	data, err := json.Marshal(diapers)
	if err != nil {
		internal.ServerError(w, err)
		return 
	}
	w.Write(data)
}

func (h *Handler) DiapersLatest(w http.ResponseWriter, r *http.Request) {
	d, err := h.DiaperChangesModel.Latest()
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	data, err := json.Marshal(d)
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func (h *Handler) DiapersCreate(w http.ResponseWriter, r *http.Request) {
	data := &InsertDiaperChange{}
	err := json.NewDecoder(r.Body).Decode(data)
	if err != nil {
		internal.ServerError(w, err)
		return
	}
	err = h.DiaperChangesModel.Insert(data)
	if err != nil {
		internal.ServerError(w, err)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (h *Handler) DiapersDelete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	err = h.DiaperChangesModel.Delete(id)
	if err != nil {
		internal.ServerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DiapersUpdate(w http.ResponseWriter, r *http.Request) {
	u := &UpdateDiaperChange{}

	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	err = json.NewDecoder(r.Body).Decode(u)
	if err != nil {
		internal.ServerError(w, err)
		return
	}

	err = h.DiaperChangesModel.Update(id, u)
	if err != nil {
		internal.ServerError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
}