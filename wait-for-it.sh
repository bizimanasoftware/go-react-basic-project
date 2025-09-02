backend:
  build: ./backend
  ports:
    - "8000:8000"
  volumes:
    - ./backend:/app
  environment:
    - DATABASE_URL=${DATABASE_URL}
    - JWT_SECRET=${JWT_SECRET}
  depends_on:
    - db
  command: ["/wait-for-it.sh", "db:5432", "--", "./flashhire-app"]
