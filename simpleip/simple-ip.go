package simpleip

import (
	"fmt"
	"log"
	"net"
	"sync/atomic"

	"github.com/pkg/errors"
)

type SimpleIP struct {
	conn          net.Conn
	handlerBuffer int
	handlers      map[string][]chan string
	listening     atomic.Bool
}

func Open(address string) (*SimpleIP, error) {
	conn, err := net.Dial("tcp", address)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to open simple ip connection")
	}
	s := &SimpleIP{
		handlerBuffer: 10,
		conn:          conn,
		handlers:      map[string][]chan string{},
		listening:     atomic.Bool{},
	}

	go s.listen()

	return s, nil
}

func (s *SimpleIP) Close() error {
	err := s.conn.Close()
	if err != nil {
		return errors.Wrapf(err, "failed to close simple ip connection")
	}
	s.listening.Store(false)
	return nil
}

func (s *SimpleIP) listen() {
	if s.listening.Swap(true) {
		return
	}

	b := make([]byte, 24)

	for s.listening.Load() {
		err := s.readEvent(b)
		if err != nil {
			log.Print(err)
			continue
		}

		key := b[2:7]

		handlers, ok := s.handlers[string(key)]
		if !ok {
			continue
		}

		for _, h := range handlers {
			result := string(b[7:])
			go func(h chan string, result string) {
				h <- result
			}(h, result)
		}
	}
}

func (s *SimpleIP) On(name string) chan string {
	c := make(chan string, s.handlerBuffer)

	h, ok := s.handlers[name]
	if !ok {
		h = []chan string{c}
	} else {
		h = append(h, c)
	}
	s.handlers[name] = h

	return c
}

func (s *SimpleIP) Off(name string, handler chan string) {
	handlers, ok := s.handlers[name]
	if !ok {
		return
	}
	newHandlers := make([]chan string, 0, len(handlers))
	for _, h := range handlers {
		if h != handler {
			newHandlers = append(newHandlers, h)
		}
	}
	if len(newHandlers) == len(handlers) {
		return
	}
	s.handlers[name] = newHandlers
}

func (s *SimpleIP) SendCommand(command string) (string, error) {
	if len(command) != 24 || command[:2] != "*S" || command[23] != '\n' {
		return "", fmt.Errorf("invalid command %s", command)
	}
	name := "A" + command[3:7]
	events := s.On(name)

	l, err := s.conn.Write([]byte(command))
	if err != nil {
		return "", err
	}

	if l != 24 {
		return "", fmt.Errorf("wrote %d bytes expected 24", l)
	}

	answer := <-events
	s.Off(name, events)

	if answer[0] == 'F' {
		return "", fmt.Errorf("failed to run command")
	}

	return string(answer), nil
}

func (s *SimpleIP) readEvent(b []byte) error {
	l, err := s.conn.Read(b)
	if err != nil {
		return err
	}
	if l != 24 {
		return fmt.Errorf("read %d bytes expected 24 bytes", l)
	}
	return nil
}
