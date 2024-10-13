import type { inferProcedureInput } from "@trpc/server";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter, type AppRouter } from "~/server/api/routers/_app";
import { expect, test } from "vitest";

test("example router", async () => {
	const ctx = await createInnerTRPCContext({ session: null });
	const caller = appRouter.createCaller(ctx);

	type Input = inferProcedureInput<AppRouter["example"]["hello"]>;
	const input: Input = {
		text: "test",
	};

	const example = await caller.example.hello(input);

	expect(example).toMatchObject({ greeting: "Hello test" });
});
