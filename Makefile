.DEFAULT_GOAL = help

BASE_MANIFEST=compose/docker-compose.yml
LOCAL_MANIFEST=compose/docker-compose.local.yml
DEVELOP_MANIFEST=compose/docker-compose.develop.yml
MASTER_MANIFEST=compose/docker-compose.master.yml
PRODUCTION_MANIFEST=compose/docker-compose.production.yml

ENV_DEPLOY=.env
include ${ENV_DEPLOY}
export

export DOCKER_BUILDKIT=true
export COMPOSE_DOCKER_CLI_BUILD=true


---> [ LocalHost ] ------------------------------------------------------------------------> : ## *

config_juggler-front_local: ## Validate juggler-front_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			config

build_juggler-front_local: ## Build juggler-front_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			build

push_juggler-front_local: ## Push images juggler-front_local
	@echo "Empty job"

pull_juggler-front_local: ## Pull images juggler-front_local
	@echo "Empty job"

create_juggler-front_local: ## Create juggler-front_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_juggler-front_local: ## Drop juggler-front_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			down

recreate_juggler-front_local: drop_juggler-front_local create_juggler-front_local ## ReCreate juggler-front_local

logs_juggler-front_local: ## Show logs of juggler-front_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			logs \
				--follow


---> [ Develop ] ---------------------------------------------------------------------------> : ## *

config_juggler-front_develop: ## Validate juggler-front_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			config

build_juggler-front_develop: ## Build juggler-front_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			build

push_juggler-front_develop: ## Push images juggler-front_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			push

pull_juggler-front_develop: ## Pull images juggler-front_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			pull

create_juggler-front_develop: ## Create juggler-front_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_juggler-front_develop: ## Drop juggler-front_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			down

recreate_juggler-front_develop: drop_juggler-front_develop create_juggler-front_develop ## ReCreate juggler-front_develop

logs_juggler-front_develop: ## Show logs of juggler-front_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			logs \
				--follow


---> [ Master ] ---------------------------------------------------------------------------> : ## *

config_juggler-front_master: ## Validate juggler-front_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			config

build_juggler-front_master: ## Build juggler-front_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			build

push_juggler-front_master: ## Push images juggler-front_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			push

pull_juggler-front_master: ## Pull images juggler-front_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			pull

create_juggler-front_master: ## Create juggler-front_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_juggler-front_master: ## Drop juggler-front_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			down

recreate_juggler-front_master: drop_juggler-front_master create_juggler-front_master ## ReCreate juggler-front_master

logs_juggler-front_master: ## Show logs of juggler-front_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			logs \
				--follow


---> [ Production ] ---------------------------------------------------------------------------> : ## *

config_juggler-front_production: ## Validate juggler-front_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			config

build_juggler-front_production: ## Build juggler-front_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			build

push_juggler-front_production: ## Push images juggler-front_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			push

pull_juggler-front_production: ## Pull images juggler-front_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			pull

create_juggler-front_production: ## Create juggler-front_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_juggler-front_production: ## Drop juggler-front_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			down

recreate_juggler-front_production: drop_juggler-front_production create_juggler-front_production ## ReCreate juggler-front_production

logs_juggler-front_production: ## Show logs of juggler-front_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			logs \
				--follow


---> [ System ] ---------------------------------------------------------------------------> : ## *

clean: ## Clean directory
	@find . ! -name . -and \
			! -name .. -and \
			! -name compose -and \
			! -name ".env" -and \
			! -name "Makefile" -and \
			! -name "docker-compose.yml" \
			! -name "docker-compose.*.yml" \
      			-delete

prune_system: ## Prune docker system
	@docker system prune --force

help: ## Show help
	@awk 	'BEGIN {FS = ":.*?## "} \
			/^[a-z A-Z0-9\[\]\<\>_-]+:.*?## / \
			{printf "  \033[36m%-35s\033[0m %s\n", $$1, $$2}' \
				$(MAKEFILE_LIST)

