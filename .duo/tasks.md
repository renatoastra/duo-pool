# Tarefas: `polls.vote` feature

**Plano:** `.duo/plan.md`
**Tipo:** improvement (feature gap fill — único slot reservado pra demo ao vivo)
**Total:** 8 tarefas
**Breakdown:** 2 test + 6 impl + 0 config + 0 refactor + 0 doc

> Sequência travada à 5-Layer Data Flow (ADR-001): L3 query → L4 contract → L5 procedure/router → Frontend api → Frontend UI.
> Os testes `polls.castVote.test.ts` e `VoteScreen.vote.test.tsx` já existem runtime-skipped (TDD asset). Os de contrato e router têm assertion *negativa* que será flipada antes da impl.

---

## L3 — Query (Backend domain unit)

- [ ] T001 [impl] Implementar `castVote(db, { pollId, pollOptionId, voterCookie })` em `packages/database/src/query/polls.ts` → tentar `INSERT`, capturar Postgres `23505` (unique_violation) e devolver `{ status: "alreadyVoted" }`; sucesso devolve `{ status: "ok" }`. Re-throw outros erros. → `packages/database/src/query/polls.ts`
  - Verificação: `bun --filter @duopool/database test src/query/polls.castVote.test.ts` (era runtime-skipped → deve PASSAR — cobre AC-B1..B4)
  - Referência: `hasVoted()` no mesmo arquivo (gold-standard L3 query)
  - Restrição (ADR-003): NÃO adicionar pre-check `SELECT` — a constraint `UNIQUE (voter_cookie, poll_id)` é a fonte da verdade.

## L4 — Contract

- [ ] T002 [test] Flipar a assertion negativa em `packages/contracts/src/polls.test.ts` → afirmar que `pollsContract.vote` existe e tem `input: { slug, pollOptionId, voterCookie }` e `output: discriminatedUnion("status", [{ok}, {alreadyVoted}])` → `packages/contracts/src/polls.test.ts`
  - Verificação: `bun --filter @duopool/contracts test` (deve FALHAR — RED, `vote` ainda não existe — cobre AC-B5)

- [ ] T003 [impl] Adicionar `pollsContract.vote` com `oc.route({ method: "POST", path: "/polls/:slug/vote" })`, input zod (`{ slug, pollOptionId, voterCookie }`) e output `z.discriminatedUnion("status", [...])` → `packages/contracts/src/polls.ts`
  - Verificação: `bun --filter @duopool/contracts test` (deve PASSAR — GREEN)
  - Referência: `pollsContract.list/get/results/hasVoted` no mesmo arquivo
  - Restrição: usar `selectPollOptionSchema` / drizzle-zod onde aplicável (NEVER DO: zod schemas à mão pra entidade).

## L5 — Procedure + Router

- [ ] T004 [test] Flipar a assertion negativa em `packages/api/src/router.test.ts` → `expect(router.polls.vote).toBeDefined()` → `packages/api/src/router.test.ts`
  - Verificação: `bun --filter @duopool/api test src/router.test.ts` (deve FALHAR — RED, vote ainda não wireado — cobre AC-B6)

- [ ] T005 [impl] Criar `voteProc`: resolver slug→pollId via `getPollBySlug`; lançar `ORPCError("NOT_FOUND")` se slug ausente; delegar a `castVote` da L3 → `packages/api/src/modules/polls/procedures/vote.ts` (NOVO)
  - Verificação: `bun turbo type-check` (compila sem erro — cobre AC-B7 transitivamente)
  - Referência: `packages/api/src/modules/polls/procedures/has-voted.ts` (gold-standard L5 com lookup por slug)

- [ ] T006 [impl] Exportar `voteProc` no barrel e wirear `vote: voteProc` sob `polls` no router → `packages/api/src/modules/polls/procedures/index.ts` + `packages/api/src/router.ts`
  - Verificação: `bun --filter @duopool/api test src/router.test.ts` (deve PASSAR — GREEN)
  - Referência: como `hasVoted: hasVotedProc` está exportado/wireado nos mesmos arquivos.

## Frontend — api hook

- [ ] T007 [impl] Substituir o `mutationFn` stub de `useVote()` por `orpc.polls.vote(input)`; manter `onSuccess` invalidando `["polls","results", slug]` e `["polls","hasVoted", slug]`; remover o export `VOTE_NOT_IMPLEMENTED_MESSAGE` → `apps/web/modules/polls/api.ts`
  - Verificação: `cd apps/web && bun test modules/polls/components/__tests__/VoteScreen.vote.test.tsx` (casos 1-2 — antes runtime-skipped, agora ativos e PASSAM — cobre AC-F1, AC-F2)
  - Referência: `useHasVoted` no mesmo arquivo (gold-standard frontend api).
  - Restrição: invalidação fica em `api.ts`, NUNCA no componente (Frontend Rules).

## Frontend — UI VoteScreen

- [ ] T008 [impl] Diferenciar branches do resultado: `result.status === "ok"` → `router.push(\`/poll/${slug}/result\`)`; `result.status === "alreadyVoted"` → renderizar mensagem inline com `data-message-kind="already-voted"` e texto "Voto já registrado", sem navegar. Após qualquer commit (sucesso ou alreadyVoted), travar a `<HoldButton>` row em `disabled` → `apps/web/modules/polls/components/VoteScreen.tsx`
  - Verificação: `cd apps/web && bun test modules/polls/components/__tests__/VoteScreen.vote.test.tsx` (casos 3-5 PASSAM — cobre AC-F3, AC-F4, AC-F5)
  - Restrição: NÃO chamar `orpc` direto — ir pelo hook `useVote()`.

---

## Invariantes (rodar após cada layer; gate final do projeto)

- `bun turbo type-check`
- `bun --filter @duopool/database test`
- `bun --filter @duopool/contracts test`
- `bun --filter @duopool/api test`
- `cd apps/web && bun test`
- **Gate final (AC-Q1):** `bun verify` exit 0 — `VoteScreen.test.tsx` (demo-pending, mock-based) deve continuar passando (AC-Q2).
