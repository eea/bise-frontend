version: '2.4'
services:
  backend:
    build: ./api/
    ports:
    - "${BACKEND:-8080}:8080"
    environment:
      SITE: "Plone"
    volumes:
      - data:/data

volumes:
  data:
    driver: local
