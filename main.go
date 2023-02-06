package main

import (
	"fmt"
	"log"
	"net"
)

func main() {
	conn, err := net.Dial("tcp", "192.168.0.40:20060")
	if err != nil {
		log.Fatal(err)
	}
	err = sendCommand(conn, "*CPOWR0000000000000001")
	if err != nil {
		log.Fatal(err)
	}
}

func sendCommand(conn net.Conn, command string) error {
	l, err := conn.Write([]byte(command))
	if err != nil {
		return err
	}
	spew.Dump(l)
	if l != 24 {
		return fmt.Errorf("Didn't write 24 bytes")
	}
	return nil
}
