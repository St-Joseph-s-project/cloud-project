import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const likeReaction = await prisma.reactions.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            reaction: "Like",
        },
    });
    console.log("Seeded reaction:", likeReaction);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
