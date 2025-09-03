BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

.PHONY: status update feature push pr ship hotfix rollback env doctor deploy preview

status:
	git remote -v
	git branch -vv
	git status -sb

update:
	git checkout main
	git pull --ff-only

feature:
ifndef NAME
	$(error Usage: make feature NAME=branch-name)
endif
	git switch -c feat/$(NAME)

push:
	git push -u origin $(BRANCH)

pr:
	git checkout main
	git pull --ff-only
	git merge --no-ff $(BRANCH)
	git push origin main

ship: update
	git push origin main

hotfix:
ifndef NAME
	$(error Usage: make hotfix NAME=fix-name)
endif
	git checkout -b hotfix/$(NAME) main

rollback:
ifndef SHA
	$(error Usage: make rollback SHA=commit-sha)
endif
	git revert $(SHA)
	git push origin main

env:
	grep -E 'SUPABASE|NEXT_PUBLIC|ADMIN_SECRET' .env* 2>/dev/null || echo "no env files"

doctor:
	@echo "== Remotes =="; git remote -v
	@echo "== Branch =="; git branch -vv
	@echo "== Status =="; git status -sb
	@echo "== Vercel link =="; npx -y vercel link --confirm >/dev/null || true
	@echo "== Env keys =="; grep -E 'SUPABASE|NEXT_PUBLIC' .env* 2>/dev/null || echo "no local env files"

deploy:
	@echo "Deploying branch '$(BRANCH)' to PRODUCTION via Vercel..."
	npx -y vercel --prod --yes

preview:
	@echo "Deploying branch '$(BRANCH)' to PREVIEW via Vercel..."
	npx -y vercel --yes
