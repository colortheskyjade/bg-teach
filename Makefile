
.PHONY: dev dev-stop clean docker-dev logs start stop

dd: docker-dev

dev:
	@echo "Starting MongoDB and dev servers..."
	docker-compose up -d mongo
	MONGODB_URI=mongodb://localhost:27017/bg-teach_dev yarn workspace @bg-teach/backend dev &
	yarn workspace @bg-teach/frontend dev &
	@echo "Dev servers started in the background. Check terminal output for details."

dev-stop:
	@echo "Stopping dev servers..."
	@pkill -f "yarn workspace @bg-teach" || echo "No processes found."

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
	rm -rf packages/frontend/node_modules
	rm -rf packages/frontend/.next
	rm -rf packages/frontend/out
	@echo "Clean up complete."
