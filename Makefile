GC=go

all:
	$(GC) build -o bin/bravia-remote

dev:
	$(GC) run -tags dev main.go