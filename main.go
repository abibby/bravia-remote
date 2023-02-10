package main

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"path"
	"time"

	"github.com/abibby/bravia-remote/ui"
	"github.com/abibby/fileserver"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

// var ip = "192.168.0.33"
// var psk = "1830"

func proxyAPI(client *http.Client, ip, psk string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, service := path.Split(r.URL.Path)
		req, err := http.NewRequest("POST", fmt.Sprintf("http://%s/sony/%s", ip, service), r.Body)
		if err != nil {
			w.WriteHeader(500)
			fmt.Fprint(w, err)
			return
		}
		defer r.Body.Close()

		req.Header = r.Header.Clone()
		req.Header.Add("X-Auth-PSK", psk)

		resp, err := client.Do(req)
		if err != nil {
			w.WriteHeader(502)
			fmt.Fprint(w, err)
			return
		}

		w.WriteHeader(resp.StatusCode)
		for k, v := range resp.Header {
			for _, header := range v {
				w.Header().Add(k, header)
			}
		}
		_, err = io.Copy(w, resp.Body)
		if err != nil {
			w.WriteHeader(500)
			fmt.Fprint(w, err)
			return
		}
	}
}

func main() {
	godotenv.Load("./.env")

	var ip = os.Getenv("TV_IP")
	var psk = os.Getenv("TV_PSK")

	client := &http.Client{
		Timeout: time.Second * 5,
	}
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	http.HandleFunc("/sony/simple-ip", func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		conn, err := net.Dial("tcp", fmt.Sprintf("%s:20060", ip))
		if err != nil {
			log.Print(err)
			ws.Close()
			return
		}
		defer conn.Close()

		go func() {
			scanner := bufio.NewScanner(conn)
			for scanner.Scan() {
				err = ws.WriteMessage(websocket.TextMessage, scanner.Bytes())
				if err != nil {
					log.Print(err)
					return
				}
			}
		}()
		for {
			_, p, err := ws.ReadMessage()
			if err != nil {
				log.Println(err)
				return
			}

			conn.Write(append(p, '\n'))
		}
	})
	http.Handle("/sony/", proxyAPI(client, ip, psk))
	http.Handle("/", fileserver.WithFallback(ui.Content, "dist", "index.html", nil))

	log.Print("Listening at http://localhost:8087")
	http.ListenAndServe(":8087", nil)
}
