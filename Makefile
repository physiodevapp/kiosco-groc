push-personal:
	cp .clasp.personal.json .clasp.json
	clasp push

push-prod:
	cp .clasp.prod.json .clasp.json
	clasp push
	cp .clasp.personal.json .clasp.json

deploy-personal:
	cp .clasp.personal.json .clasp.json
	clasp deploy --description "$(or $(DESC),deploy personal)"

deploy-prod:
	cp .clasp.prod.json .clasp.json
	clasp deploy --description "$(or $(DESC),deploy prod)"
	cp .clasp.personal.json .clasp.json
