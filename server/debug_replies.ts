
import { PrismaClient } from "@prisma/client";
import { commentService } from "./src/modules/interview_experience/comments/comments.service";

const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Find a comment that is a parent (has replies)
        // We can look for a comment that is a parent of another comment
        const reply = await prisma.comments.findFirst({
            where: { NOT: { parent_id: null } },
            select: { parent_id: true }
        });

        if (!reply || !reply.parent_id) {
            console.log("No replies found in DB to test with.");
            return;
        }

        const parentId = reply.parent_id;
        console.log(`Testing getReplies for commentId: ${parentId}`);

        // 2. Call getReplies
        const result = await commentService.getReplies(parentId);

        console.log("Result success:", result.success);
        console.log("Pagination:", result.pagination);
        console.log("Data length:", result.data.length);

        if (result.data.length > 0) {
            const firstChild = result.data[0];
            console.log("First child ID:", firstChild.id);
            console.log("First child replies count:", firstChild.replies?.length);
            if (firstChild.replies && firstChild.replies.length > 0) {
                console.log("First child's first reply ID:", firstChild.replies[0].id);
            }
        } else {
            console.log("No data returned.");
        }

        console.log(JSON.stringify(result.data, null, 2));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
