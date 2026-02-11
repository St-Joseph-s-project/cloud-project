import { prisma } from "./src/lib/prisma.ts";

async function main() {
  const reactions = [
    { id: 1, reaction: "Like" },
    { id: 2, reaction: "Love" },
    { id: 3, reaction: "Clap" },
    { id: 4, reaction: "Support" },
  ];

  for (const r of reactions) {
    const reaction = await prisma.reactions.upsert({
      where: { id: r.id },
      update: { reaction: r.reaction },
      create: {
        id: r.id,
        reaction: r.reaction,
      },
    });
    console.log("Seeded reaction:", reaction);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
