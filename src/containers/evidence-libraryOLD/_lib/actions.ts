"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
// import { db } from "~/containers/evidence-library/db/index";
// import {
//   evidences,
//   type Evidence,
// } from "~/containers/evidence-library/db/schema";
// import { takeFirstOrThrow } from "~/containers/evidence-library/db/utils";
// import { count, eq, inArray } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import { getErrorMessage } from "~/lib/handle-error";

import { generateRandomEvidence } from "./utils";
import type { CreateEvidenceSchema, UpdateEvidenceSchema } from "./validations";

export async function seedEvidences(input: { count: number }) {
  const count = input.count ?? 100;

  try {
    const allEvidences: any = [];

    for (let i = 0; i < count; i++) {
      allEvidences.push(generateRandomEvidence());
    }

    // await db.delete(evidences);

    console.log("📝 Inserting Evidences", allEvidences.length);

    // await db.insert(evidences).values(allEvidences).onConflictDoNothing();
  } catch (err) {
    console.error(err);
  }
}

export async function createEvidence(input: CreateEvidenceSchema) {
  noStore();
  const maxEvidenceLimit = 15;

  try {
    const evidenceCount = await db
      .select()
      .from(evidences)
      .then((result: any) => result.length);

    if (evidenceCount >= maxEvidenceLimit) {
      throw new Error(
        `Task limit reached. You cannot have more than ${maxEvidenceLimit} tasks. If you want to create a new task, please delete a previous task first.`
      );
    }

    await db.transaction(async (tx: any) => {
      const newEvidence = await tx
        .insert(evidences)
        .values({
          code: `EVIDENCE-${customAlphabet("0123456789", 4)()}`,
          name: input.name,
          status: input.status,
          linkedControls: input.linkedControls,
          renewalDate: input.renewalDate,
        })
        .returning({
          id: evidences.id,
        });

      // Uncomment this block if you want to delete the oldest task to keep the total number of tasks constant
      // await tx.delete(tasks).where(
      //   eq(
      //     tasks.id,
      //     (
      //       await tx
      //         .select({
      //           id: tasks.id,
      //         })
      //         .from(tasks)
      //         .limit(1)
      //         .where(not(eq(tasks.id, newTask.id)))
      //         .orderBy(asc(tasks.createdAt))
      //         .then(takeFirstOrThrow)
      //     ).id
      //   )
      // );
    });

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    let errorMessage = "An error occurred while creating the task.";

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
}

export async function updateEvidence(
  input: UpdateEvidenceSchema & { id: string }
) {
  noStore();
  try {
    await db
      .update(evidences)
      .set({
        name: input.name,
        // linkedControls: input.linkedControls,
        status: input.status,
        renewalDate: input.renewalDate,
      })
      .where(eq(evidences.id, input.id));

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateEvidences(input: {
  ids: string[];
  name: Evidence["name"];
  description: Evidence["description"];
  implementationGuide: Evidence["implementationGuide"];
  owner?: Evidence["owner"];
  status?: Evidence["status"];
}) {
  noStore();
  try {
    await db
      .update(evidences)
      .set({
        name: input.name,
        description: input.description,
        status: input.status,
        implementationGuide: input.implementationGuide,
      })
      .where(inArray(evidences.id, input.ids));

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteEvidence(input: { id: string }) {
  try {
    await db.transaction(async (tx: any) => {
      await tx.delete(evidences).where(eq(evidences.id, input.id));

      // Create a new task for the deleted one
      // await tx.insert(tasks).values(generateRandomTask())
    });

    revalidatePath("/");
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteEvidences(input: { ids: string[] }) {
  try {
    // Count the current number of tasks
    const evidenceCountResult = await db
      .select({
        count: count(),
      })
      .from(evidences)
      .then(takeFirstOrThrow);

    const evidenceCount = evidenceCountResult.count;

    // Calculate the remaining tasks after deletion
    const remainingEvidences = evidenceCount - input.ids.length;

    // Prevent deletion if resulting number of tasks is below the threshold
    if (remainingEvidences < 5) {
      throw new Error(
        `Cannot delete the evidences. You must have at least 5 evidences in the database after deletion.`
      );
    }

    // Proceed with deletion if the condition is satisfied
    await db.transaction(async (tx: any) => {
      await tx.delete(evidences).where(inArray(evidences.id, input.ids));
    });

    // Revalidate path after deletion
    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    // Handle errors
    let errorMessage = "An error occurred while deleting the evidences.";

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      data: null,
      error: errorMessage,
    };
  }
}

export async function getChunkedEvidences(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000;

    const totalEvidences = await db
      .select({
        count: count(),
      })
      .from(evidences)
      .then(takeFirstOrThrow);

    const totalChunks = Math.ceil(totalEvidences.count / chunkSize);

    let chunkedEvidences;

    for (let i = 0; i < totalChunks; i++) {
      chunkedEvidences = await db
        .select()
        .from(evidences)
        .limit(chunkSize)
        .offset(i * chunkSize)
        .then((evidences: any) =>
          evidences.map((evidence: any) => ({
            ...evidence,
            createdAt: evidence.createdAt.toString(),
            updatedAt: evidence.updatedAt?.toString(),
          }))
        );
    }

    return {
      data: chunkedEvidences,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
