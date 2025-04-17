push-registry:
	docker build --provenance false --platform linux/amd64  -t registry.heroku.com/matrix-bot-jam/web .
	docker push registry.heroku.com/matrix-bot-jam/web

release:
	heroku container:release web --app matrix-bot-jam