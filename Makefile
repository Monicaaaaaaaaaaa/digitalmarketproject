PROJECT_DIR := $(shell pwd)

run:
	@sudo npm run dev

fix-per:
	sudo chown -R $(whoami) .

fix-git:
	sudo chown $(whoami):staff .git/logs/refs/heads/implement-pdf-rendering

typecheck:
	@sudo npx nuxt typecheck
