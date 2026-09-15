.DEFAULT_GOAL := help
.PHONY: help build test dev
help: ## Show available targets
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z_-]+:.*## / {printf "  %-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)
build: ## Build the static site and production web image
	docker build --target runtime -t atlas-frontend .
test: ## Type-check the frontend in Docker
	docker build --target test --progress plain .
dev: ## Start both development services
	$(MAKE) -C .. dev
