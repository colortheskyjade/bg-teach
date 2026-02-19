
.PHONY: dev

dev:
	@echo "Starting backend and frontend dev servers..."
	yarn workspace @bg-teach/backend dev &
	yarn workspace @bg-teach/frontend dev &
	@echo "Dev servers started in the background. Check terminal output for details."
