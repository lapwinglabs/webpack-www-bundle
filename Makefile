development:
	@NODE_PATH=lib PORT=5000 ./node_modules/.bin/node-dev --harmony example/index.js

production:
	@NODE_ENV=production NODE_PATH=lib PORT=5000 node --harmony example/index.js

build:
	@NODE_PATH=lib NODE_ENV=production node --harmony example/build.js --bail

.PHONY: build development production
