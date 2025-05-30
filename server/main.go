package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/noel-vega/newborn-feeding/features/diapers"
	"github.com/noel-vega/newborn-feeding/features/feeding"
)

type Application struct {
	DB *pgxpool.Pool
}

func NewApplication(db *pgxpool.Pool) *Application {
	return &Application{}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	db, err := openDB()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir("static"))

	mux.Handle("GET /assets/", fileServer)

	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = "/"
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		fileServer.ServeHTTP(w, r)
	})

	feeding.RegisterRoutes(mux, db)
	diapers.RegisterRoutes(mux, db)

	err = http.ListenAndServe(":"+port, mux)
	if err != nil {
		panic(err)
	}
}

func openDB() (*pgxpool.Pool, error) {
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("POSTGRES_CONN"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}

	if err := dbpool.Ping(context.Background()); err != nil {
		dbpool.Close()
		return nil, err
	}

	return dbpool, nil
}
