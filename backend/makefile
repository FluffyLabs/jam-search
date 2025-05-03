.PHONY: push-registry
push-registry:
	docker build --provenance false --platform linux/amd64  -t registry.heroku.com/matrix-bot-jam/web .
	docker push registry.heroku.com/matrix-bot-jam/web

.PHONY: release
release:
	heroku container:release web --app matrix-bot-jam

.PHONY: dev
dev:
	@npm run dev

.PHONY: install i
install i:
	@npm install

.PHONY: lint
lint:
	@npm run lint

.PHONY: migrate
migrate:
	@npm run db:migrate


