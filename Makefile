push-personal:
	cp .clasp.personal.json .clasp.json
	clasp push

push-prod:
	cp .clasp.prod.json .clasp.json
	clasp push
	cp .clasp.personal.json .clasp.json
