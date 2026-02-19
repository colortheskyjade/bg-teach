
.PHONY: dev clean

dev:
	@echo "Starting backend and frontend dev servers..."
	yarn workspace @bg-teach/backend dev &
	yarn workspace @bg-teach/frontend dev &
	@echo "Dev servers started in the background. Check terminal output for details."

clean:
	@echo "Cleaning generated files and directories..."
	rm -rf node_modules
	rm -rf packages/frontend/node_modules
	rm -rf packages/frontend/.next
	rm -rf packages/frontend/out
	@echo "Clean up complete."
