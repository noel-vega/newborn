package main

import (
	"log"
	"net/http"
)

func (app *Application) ServerError(w http.ResponseWriter, err error) {
	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	log.Println(err.Error())
}
