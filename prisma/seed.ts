// Fills the database with the content of the architectural file (and the
// clearly flagged demo entries). Safe to run several times: records are
// upserted by their unique keys.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { gallery } from "../src/content/galerie";
import { comparisons, news, stages, viewpoints } from "../src/content/chantier";

const prisma = new PrismaClient();

async function main() {
  // Media: every picture of the gallery (all the file's renders and plans).
  for (const [i, g] of gallery.entries()) {
    const data = {
      alt: g.alt,
      caption: g.caption ?? null,
      width: g.width,
      height: g.height,
      kind: g.kind,
      espace: g.espace,
      dateLabel: g.dateLabel,
      source: g.source,
      order: i,
    };
    await prisma.media.upsert({ where: { src: g.src }, update: data, create: { src: g.src, ...data } });
  }
  const mediaId = async (src: string) => (await prisma.media.findUniqueOrThrow({ where: { src } })).id;

  for (const [i, s] of stages.entries()) {
    const data = {
      title: s.title,
      description: s.description,
      status: s.status,
      dateLabel: s.dateLabel ?? null,
      highlights: (s.highlights ?? []).join("\n"),
      order: i,
      state: "PUBLISHED",
      source: s.source,
    };
    const stage = await prisma.stage.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
    for (const [k, m] of s.media.entries()) {
      await prisma.media.update({ where: { src: m.src }, data: { stageId: stage.id, order: k } });
    }
  }

  for (const c of comparisons) {
    const data = {
      title: c.title,
      beforeId: await mediaId(c.before.src),
      beforeLabel: c.before.label,
      beforeDate: c.before.date ?? null,
      afterId: await mediaId(c.after.src),
      afterLabel: c.after.label,
      afterDate: c.after.date ?? null,
      featured: true,
      state: "PUBLISHED",
      source: c.source,
    };
    await prisma.comparison.upsert({ where: { slug: c.slug }, update: data, create: { slug: c.slug, ...data } });
  }

  for (const [i, v] of viewpoints.entries()) {
    const data = { title: v.title, espace: v.espace, renderId: await mediaId(v.render.src), order: i };
    await prisma.viewpoint.upsert({ where: { slug: v.slug }, update: data, create: { slug: v.slug, ...data } });
  }

  for (const n of news) {
    const media = await Promise.all((n.media ?? []).map(async (m) => ({ id: await mediaId(m.src) })));
    const data = {
      title: n.title,
      excerpt: n.excerpt,
      category: n.category,
      dateLabel: n.dateLabel,
      body: n.body.join("\n\n"),
      coverId: await mediaId(n.image.src),
      state: "PUBLISHED",
      source: n.source,
    };
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: { ...data, media: { set: media } },
      create: { slug: n.slug, ...data, media: { connect: media } },
    });
  }

  // First administrator, only when no account exists yet.
  if ((await prisma.user.count()) === 0) {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env");
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL.toLowerCase(),
        name: ADMIN_NAME || "Administrateur",
        passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
        role: "ADMIN",
      },
    });
    console.log(`Compte administrateur créé : ${ADMIN_EMAIL}`);
  }

  const counts = await Promise.all([prisma.media.count(), prisma.stage.count(), prisma.news.count(), prisma.comparison.count(), prisma.viewpoint.count()]);
  console.log(`Médias ${counts[0]}, étapes ${counts[1]}, actualités ${counts[2]}, comparaisons ${counts[3]}, points de vue ${counts[4]}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
