
.PHONY: dev dev-stop clean docker-dev logs start stop

dd: docker-dev

dev:
	@echo "Starting MongoDB and dev server..."
	docker-compose up -d mongo
	MONGODB_URI=mongodb://localhost:27017/bg-teach_dev npm run dev

dev-stop:
	@echo "Stopping dev servers..."
	@pkill -f "next dev" || echo "No processes found."

docker-dev:
	@echo "Starting Dockerized backend, frontend, and MongoDB..."
	docker-compose up --build -d

logs:
	docker-compose logs -f

start:
	docker-compose start

stop:
	docker-compose stop

clean:
	@echo "Cleaning generated files and directories..."
	rm -rf node_modules
	rm -rf .next
	rm -rf out
	@echo "Clean up complete."
