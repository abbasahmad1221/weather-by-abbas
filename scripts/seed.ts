import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { makeSlug, slugDatePart } from "../lib/utils";

const prisma = new PrismaClient();

async function main() {
  // ---- Admin account ----
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@weatherbyabbas.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 12 || password === "change-this-password") {
    throw new Error("SEED_ADMIN_PASSWORD must be set to a strong password of at least 12 characters.");
  }
  const name = process.env.SEED_ADMIN_NAME || "Abbas Nabi";

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.create({ data: { email, passwordHash, name } });
    console.log(`✔ Admin account created: ${email} / (password from .env)`);
  } else {
    console.log(`• Admin account already exists: ${email}`);
  }

  // ---- Categories ----
  const categoryDefs = [
    { name: "North Kashmir", region: "North Kashmir" },
    { name: "South Kashmir", region: "South Kashmir" },
    { name: "Central Kashmir", region: "Central Kashmir" },
    { name: "Jammu Division", region: "Jammu" },
    { name: "Severe Weather Alert", region: null as string | null },
    { name: "Snowfall Forecast", region: null as string | null },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryDefs) {
    const slug = makeSlug(c.name);
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: c.name, slug, region: c.region },
    });
    categories[c.name] = cat.id;
  }
  console.log(`✔ ${categoryDefs.length} categories ready`);

  // ---- Optional sample forecasts ----
  if (process.env.SEED_INCLUDE_SAMPLES !== "true") {
    console.log("• Sample forecasts skipped (set SEED_INCLUDE_SAMPLES=true to add demo content).");
    return;
  }

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

  const samples = [
    {
      title: "Jammu & Kashmir Weather Forecast — 13 August 2026",
      summary:
        "Widespread rain and thundershowers expected across the Kashmir Valley through the weekend, with isolated heavy falls likely in North Kashmir. Jammu division to see hot, humid conditions with evening thunderstorms.",
      severity: "watch",
      region: "Jammu & Kashmir",
      category: "North Kashmir",
      advisory:
        "Moderate to heavy rainfall is likely over Kupwara, Baramulla and Bandipora districts between 13–15 August. Residents near hill torrents and nullahs should stay alert for flash flooding.",
      content: `
        <h2>Synoptic Situation</h2>
        <p>A fresh Western Disturbance is interacting with moist southeasterly winds over Jammu & Kashmir, leading to an active spell of rain and thunderstorm activity across the region. Convective instability is expected to peak during the afternoon and evening hours.</p>
        <h2>Kashmir Valley</h2>
        <p>Widespread clouding with periods of rain and isolated thundershowers is expected over Srinagar, Baramulla, Kupwara, Budgam and Ganderbal. North Kashmir districts may see locally heavy falls, particularly over the higher reaches.</p>
        <h2>Jammu Division</h2>
        <p>Hot and humid daytime conditions are expected, giving way to scattered thunderstorm activity during the evening, especially over the Shivalik foothills and Doda-Kishtwar belt.</p>
        <h2>Outlook</h2>
        <p>Rain activity is expected to gradually taper off from 16 August as the Western Disturbance moves further east, with partly cloudy and drier conditions returning to the Valley thereafter.</p>
      `,
      daysAgo: 0,
    },
    {
      title: "South Kashmir Rain Alert — Heavy Showers Expected Over Anantnag, Pulwama, Shopian",
      summary:
        "A localized but intense spell of rainfall is forecast for South Kashmir districts over the next 48 hours, driven by afternoon convection over the Pir Panjal range.",
      severity: "warning",
      region: "South Kashmir",
      category: "South Kashmir",
      advisory:
        "Farmers and orchard owners in Shopian and Pulwama are advised to secure harvest-ready produce ahead of expected heavy showers and gusty winds.",
      content: `
        <h2>Overview</h2>
        <p>Strong daytime heating combined with moisture inflow from the south is generating vigorous convective cells over the Pir Panjal foothills, affecting Anantnag, Pulwama, Shopian and Kulgam districts.</p>
        <h2>Expected Impact</h2>
        <p>Heavy short-duration rainfall accompanied by gusty winds and lightning is likely during the afternoon and evening hours. Isolated hailfall cannot be ruled out over higher elevations.</p>
        <h2>Advisory</h2>
        <p>Orchardists are advised to take precautionary measures for ready-to-harvest apple crops. Travellers along the Mughal Road and Pahalgam approach roads should exercise caution.</p>
      `,
      daysAgo: 3,
    },
    {
      title: "North Kashmir Snowfall Outlook — Early Season Snow Possible Over Higher Reaches",
      summary:
        "A moderate Western Disturbance is expected to bring the season's early snowfall to elevations above 8,500 ft in North Kashmir, including Gulmarg and Sonamarg.",
      severity: "normal",
      region: "North Kashmir",
      category: "Snowfall Forecast",
      advisory: null,
      content: `
        <h2>Forecast Details</h2>
        <p>An incoming Western Disturbance is expected to interact with cold air already in place over the higher reaches of North Kashmir, bringing the possibility of light to moderate snowfall above 8,500 feet.</p>
        <h2>Areas Likely Affected</h2>
        <p>Gulmarg, Sonamarg, Machil and the higher slopes of the Pir Panjal and Karakoram ranges are most likely to receive fresh snow accumulation, while valley floors will see rain.</p>
        <h2>Travel Advisory</h2>
        <p>Commuters on the Srinagar–Leh and Srinagar–Gulmarg routes should check road conditions before travel, as sudden snowfall can affect visibility at higher elevations.</p>
      `,
      daysAgo: 10,
    },
    {
      title: "Severe Thunderstorm Warning — Jammu Division",
      summary:
        "IMD-aligned analysis indicates a high probability of severe thunderstorms with damaging winds over Jammu, Samba, Kathua and Udhampur districts this evening.",
      severity: "alert",
      region: "Jammu",
      category: "Severe Weather Alert",
      advisory:
        "Residents in Jammu, Samba and Kathua districts should avoid open areas, secure loose outdoor objects, and stay away from trees and power lines during the storm window (approx. 4 PM – 8 PM).",
      content: `
        <h2>Situation</h2>
        <p>Strong instability has built up over the plains of Jammu division due to intense daytime heating combined with moisture convergence ahead of an approaching trough. This is favourable for the rapid development of severe thunderstorm cells.</p>
        <h2>Expected Conditions</h2>
        <p>Thunderstorms accompanied by damaging wind gusts (50–70 km/h), frequent lightning and brief intense rainfall are expected over Jammu, Samba, Kathua and Udhampur districts during the evening hours.</p>
        <h2>Safety Advisory</h2>
        <p>Avoid travel during the peak storm window where possible. Fishermen and boat operators on the Chenab and Tawi rivers should return to shore immediately if storm clouds are observed approaching.</p>
      `,
      daysAgo: 18,
    },
  ];

  for (const s of samples) {
    const publishedAt = daysAgo(s.daysAgo);
    const slug = makeSlug(s.title.replace(/—/g, "-"), slugDatePart(publishedAt));
    const exists = await prisma.forecast.findUnique({ where: { slug } });
    if (exists) continue;

    await prisma.forecast.create({
      data: {
        title: s.title,
        slug,
        summary: s.summary,
        content: s.content,
        advisory: s.advisory,
        severity: s.severity,
        region: s.region,
        categoryId: categories[s.category],
        published: true,
        publishedAt,
        isSample: true,
        author: "Abbas Nabi",
      },
    });
  }

  console.log(`✔ Sample forecasts seeded (${samples.length})`);
  console.log("\nDone. Log in at /admin/login with the credentials from your .env file.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
