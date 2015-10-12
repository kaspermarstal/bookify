test:
	docker-compose --file ./test/docker-compose.yml up -d
	./node_modules/.bin/mocha --compilers js:babel/register --timeout 10000 --reporter spec
	docker-compose --file ./test/docker-compose.yml stop
.PHONY: test