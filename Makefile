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

config_juggler-frontend_local: ## Validate juggler-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			config

build_juggler-frontend_local: ## Build juggler-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			build

push_juggler-frontend_local: ## Push images juggler-frontend_local
	@echo "Empty job"

pull_juggler-frontend_local: ## Pull images juggler-frontend_local
	@echo "Empty job"

create_juggler-frontend_local: ## Create juggler-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_juggler-frontend_local: ## Drop juggler-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			down

recreate_juggler-frontend_local: drop_juggler-frontend_local create_juggler-frontend_local ## ReCreate juggler-frontend_local

logs_juggler-frontend_local: ## Show logs of juggler-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			logs \
				--follow


---> [ Develop ] ---------------------------------------------------------------------------> : ## *

config_juggler-frontend_develop: ## Validate juggler-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			config

build_juggler-frontend_develop: ## Build juggler-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			build

push_juggler-frontend_develop: ## Push images juggler-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			push

pull_juggler-frontend_develop: ## Pull images juggler-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			pull

create_juggler-frontend_develop: ## Create juggler-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_juggler-frontend_develop: ## Drop juggler-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			down

recreate_juggler-frontend_develop: drop_juggler-frontend_develop create_juggler-frontend_develop ## ReCreate juggler-frontend_develop

logs_juggler-frontend_develop: ## Show logs of juggler-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			logs \
				--follow


---> [ Master ] ---------------------------------------------------------------------------> : ## *

config_juggler-frontend_master: ## Validate juggler-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			config

build_juggler-frontend_master: ## Build juggler-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			build

push_juggler-frontend_master: ## Push images juggler-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			push

pull_juggler-frontend_master: ## Pull images juggler-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			pull

create_juggler-frontend_master: ## Create juggler-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_juggler-frontend_master: ## Drop juggler-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			down

recreate_juggler-frontend_master: drop_juggler-frontend_master create_juggler-frontend_master ## ReCreate juggler-frontend_master

logs_juggler-frontend_master: ## Show logs of juggler-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			logs \
				--follow


---> [ Production ] ---------------------------------------------------------------------------> : ## *

config_juggler-frontend_production: ## Validate juggler-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			config

build_juggler-frontend_production: ## Build juggler-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			build

push_juggler-frontend_production: ## Push images juggler-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			push

pull_juggler-frontend_production: ## Pull images juggler-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			pull

create_juggler-frontend_production: ## Create juggler-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_juggler-frontend_production: ## Drop juggler-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			down

recreate_juggler-frontend_production: drop_juggler-frontend_production create_juggler-frontend_production ## ReCreate juggler-frontend_production

logs_juggler-frontend_production: ## Show logs of juggler-frontend_production
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

