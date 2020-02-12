image-name-split = $(word $2,$(subst :, ,$1))

SHELL=/bin/bash
DOCKERIMAGE_FILE="docker-image.txt"
NAME := $(call image-name-split,$(shell cat $(DOCKERIMAGE_FILE)), 1)
IMAGE=$(shell cat $(DOCKERIMAGE_FILE))

# VOLTO_ADDONS=$(shell ./scripts/pkg_helper.py list)

.DEFAULT_GOAL := help

.PHONY: activate
activate:		## Activate an addon package for development
	set -e; \
		if [[ -z "${pkg}" ]]; then\
			echo "You need to specify package name in make command";\
			echo "Ex: make activate pkg=volto-datablocks";\
		else \
			./scripts/pkg_helper.py --target=${pkg} activate;\
			echo "Running npm install in src/develop/${pkg}";\
			cd "src/addons/$${pkg}";\
			npm install;\
			cd ../..;\
			echo "Cleaning up after npm install";\
			export VOLTO_ADDONS=`./scripts/pkg_helper.py list`;\
			read -ra ADDR <<< "$${VOLTO_ADDONS}"; \
			for pkg in "$${ADDR[@]}"; do \
				echo "removing node_modules/$${pkg}"; \
				rm -rf "./node_modules/$${pkg}";\
			done; \
			echo "Done.";\
		fi

PHONY: clean-addons
clean-addons:
	set -e; \
		echo "Cleaning up after npm install";\
		export VOLTO_ADDONS=`./scripts/pkg_helper.py list`;\
		read -ra ADDR <<< "$${VOLTO_ADDONS}"; \
		for pkg in "$${ADDR[@]}"; do \
			echo "removing node_modules/$${pkg}"; \
			rm -rf "./node_modules/$${pkg}";\
		done; \

.PHONY: activate-all
activate-all:		## Automatically activates all addons from mr.developer.json
	@echo "Activating all addon packages"
	./scripts/pkg_helper.py activate-all

.PHONY: deactivate
deactivate:		## Deactivate an addon package for development
	@if [[ -z "${pkg}" ]]; then\
		echo "You need to specify package name in make command";\
		echo "Ex: make deactivate pkg=volto-datablocks";\
	else \
		exec ./scripts/pkg_helper.py --target=${pkg} deactivate;\
		rm -rf node_modules/${pkg};\
		echo "Deactivated ${pkg}";\
	fi

.PHONY: all
all: clean build		## (Inside container) build a production version of resources
	@echo "Built production files"

.PHONY: clean
clean:
	rm -rf build/

.PHONY: build
build:
	echo "";\
	echo "Make sure that you have the npm cache (Verdaccio) running!";\
	echo "";\
	DEBUG= \
				 NODE_OPTIONS=--max_old_space_size=4096 \
				 RAZZLE_API_PATH=VOLTO_API_PATH \
				 RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH \
				 yarn build;	\
	./entrypoint-prod.sh

.PHONY: start
start:		## (Inside container) starts production mode frontend server
	npm run start:prod

.PHONY: analyze
analyze:		## (Inside container) build production resources and start bundle analyzer HTTP server
	DEBUG= \
				 BUNDLE_ANALYZE=true \
				 NODE_OPTIONS=--max_old_space_size=4096 \
				 RAZZLE_API_PATH=VOLTO_API_PATH \
				 RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH \
				 yarn build

.PHONY: release
release: bump build-image push		## (Host side) release a new version of frontend docker image

.PHONY: bump
bump:
	echo "Bumping version...";
	python ./../scripts/version_bump.py $(DOCKERIMAGE_FILE);

.PHONY: build-image
build-image:
	@echo "Building new docker image: $(IMAGE)";
	docker build . --network=host --build-arg MAX_OLD_SPACE_SIZE=4096 --build-arg NPM_CONFIG_REGISTRY=http://127.0.0.1:4873 -t "$(IMAGE)";
	@echo "Image built."

.PHONY: push
push:
	docker push $(IMAGE)
	docker tag $(IMAGE) $(NAME):latest
	docker push $(NAME):latest

.PHONY: init-submodules
init-submodules:		## Initialize the git submodules
	git submodule update --init --recursive

.PHONY: develop
develop:		## Runs "git pull" in all addons
	./scripts/pkg_helper.py develop

.PHONY: help
help:		## Show this help.
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"

.PHONY: build-production
try-production:		## Build production bundle
	NODE_OPTIONS=--max_old_space_size=4096 \
		BUNDLE_ANALYZE=true \
		RAZZLE_API_PATH=VOLTO_API_PATH \
		RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH \
		yarn build
	./entrypoint-dev.sh
	echo "Now run: node build/server.js"
