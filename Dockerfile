FROM node:16 as ui

COPY ui/package.json ui/package-lock.json ./
RUN npm ci

COPY ui/ ./
RUN npm run build

FROM golang:1.19 as go-build

WORKDIR /go/src/github.com/abibby/comicbox-3

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=ui /dist ui/dist

RUN GOOS=linux GOARCH=amd64 go install

# Now copy it into our base image.
FROM ubuntu

RUN apt-get update && apt-get install -y ca-certificates
RUN update-ca-certificates

COPY --from=go-build /go/bin/bravia-remote /bravia-reote

CMD ["/bravia-reote"]