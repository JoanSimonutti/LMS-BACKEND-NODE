# Helpers
IS_DARWIN := $(filter Darwin,$(shell uname -s))

define set_env
	sed $(if $(IS_DARWIN),-i "",-i) -e "s/^#*\($(1)=\).*/$(if $(2),,#)\1$(2)/" .env
endef

EXEC := docker compose exec node

# Phony targets
.PHONY: default up down shell deps run test debug

default: up

up:
	DOCKER_BUILDKIT=1 docker compose up -d --build

down:
	docker compose down

shell:
	$(EXEC) zsh

deps:
	$(EXEC) npm ci

run:
	$(EXEC) npm run dev

test:
	$(EXEC) npm run test

debug:
	$(EXEC) npm run debug
