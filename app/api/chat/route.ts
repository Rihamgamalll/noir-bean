import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { fail, currentSession } from "@/lib/http";
import { uuid } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  message: z.string().min(1).max(800),
  sessionId: z.string().min(4).max(100),
});

const isArabic = (value: string) => /[\u0600-\u06ff]/.test(value);

const arabicDigitsToEnglish = (value: string) =>
  value
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
    )
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
    );

function normalize(value: string) {
  return arabicDigitsToEnglish(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "")
    .replace(/(.)\1{2,}/g, "$1$1")
    .replace(/[؟?!.,،:;'"()[\]{}<>/\\|@#$%^&*_+=~`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compact(value: string) {
  return normalize(value).replace(/\s+/g, "");
}

function levenshtein(a: string, b: string) {
  const left = compact(a);
  const right = compact(b);

  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  const previous = Array.from(
    { length: right.length + 1 },
    (_, index) => index,
  );

  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;

      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
    }

    for (let j = 0; j < current.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[right.length];
}

function similarity(a: string, b: string) {
  const left = compact(a);
  const right = compact(b);
  const longest = Math.max(left.length, right.length);

  if (!longest) return 1;

  return 1 - levenshtein(left, right) / longest;
}

function fuzzyIncludes(text: string, phrase: string, threshold = 0.72) {
  const source = normalize(text);
  const target = normalize(phrase);

  if (!source || !target) return false;
  if (source.includes(target)) return true;

  const sourceWords = source.split(" ");
  const targetWords = target.split(" ");

  if (targetWords.length === 1) {
    return sourceWords.some((word) => {
      const adaptiveThreshold =
        target.length <= 4 ? 0.75 : threshold;

      return similarity(word, target) >= adaptiveThreshold;
    });
  }

  for (
    let start = 0;
    start <= sourceWords.length - targetWords.length;
    start += 1
  ) {
    const chunk = sourceWords
      .slice(start, start + targetWords.length)
      .join(" ");

    if (similarity(chunk, target) >= threshold) {
      return true;
    }
  }

  return similarity(source, target) >= threshold;
}

function hasAny(text: string, phrases: string[], threshold = 0.72) {
  return phrases.some((phrase) =>
    fuzzyIncludes(text, phrase, threshold),
  );
}

const money = (value: unknown, arabic: boolean) =>
  `${Number(value).toFixed(Number(value) % 1 ? 2 : 0)} ${
    arabic ? "جنيه" : "EGP"
  }`;

const aliases: Record<string, string[]> = {
  espresso: [
    "espresso",
    "اسبريسو",
    "اسبرسو",
    "اكسبريسو",
    "اكسبرسو",
  ],
  americano: [
    "americano",
    "امريكانو",
    "امريكانو",
    "امريكنو",
  ],
  latte: [
    "latte",
    "لاتيه",
    "لاتي",
    "لاتية",
  ],
  "spanish-latte": [
    "spanish latte",
    "سبانش لاتيه",
    "اسبانيش لاتيه",
    "سبانش لاتي",
  ],
  "vanilla-latte": [
    "vanilla latte",
    "فانيلا لاتيه",
    "فانيليا لاتيه",
    "فانيلا لاتي",
  ],
  "caramel-macchiato": [
    "caramel macchiato",
    "كراميل ماكياتو",
    "كاراميل ماكياتو",
    "كرامل مكياتو",
  ],
  "flat-white": [
    "flat white",
    "فلات وايت",
    "فلاتوايت",
  ],
  cappuccino: [
    "cappuccino",
    "كابتشينو",
    "كابوتشينو",
    "كبتشينو",
  ],
  mocha: [
    "mocha",
    "موكا",
    "موكا",
  ],
  "cold-brew": [
    "cold brew",
    "كولد برو",
    "كولدبرو",
    "كول برو",
  ],
  affogato: [
    "affogato",
    "افوجاتو",
    "افوقاتو",
  ],
  "white-mocha": [
    "white mocha",
    "وايت موكا",
    "وايت موكا",
  ],
  "plain-croissant": [
    "plain croissant",
    "كرواسون ساده",
    "كرواسون ساد",
    "كروسان ساده",
  ],
  "chocolate-croissant": [
    "chocolate croissant",
    "كرواسون شوكولاته",
    "كرواسون شوكلاته",
    "كروسان شوكولاته",
  ],
  "almond-croissant": [
    "almond croissant",
    "كرواسون لوز",
    "كروسان لوز",
  ],
  "pistachio-croissant": [
    "pistachio croissant",
    "كرواسون فستق",
    "كروسان فستق",
    "كرواسو فستق",
  ],
  "cheese-croissant": [
    "cheese croissant",
    "كرواسون جبنه",
    "كرواسون جبنة",
    "كروسان جبنه",
  ],
  "turkey-cheese-croissant": [
    "turkey cheese croissant",
    "كرواسون تركي وجبنه",
    "كرواسون تركي وجبنة",
    "كروسان تركي وجبنه",
  ],
};

const intentWords = {
  calculate: [
    "احسب",
    "الحساب",
    "المجموع",
    "كام",
    "تكلفه",
    "التكلفه",
    "total",
    "calculate",
    "how much",
    "cost",
  ],
  headache: [
    "مصدع",
    "مصدعه",
    "مصدعه",
    "صداع",
    "صداعي",
    "وجع دماغ",
    "دماغي وجعاني",
    "headache",
    "migraine",
  ],
  beans: [
    "نوع البن",
    "انواع البن",
    "البن",
    "bean type",
    "beans",
    "برازيلي",
    "كولومبي",
    "اثيوبي",
    "ديكاف",
  ],
  time: [
    "امتي",
    "متي",
    "الصبح",
    "المساء",
    "بعد الاكل",
    "قبل الشغل",
    "when drink",
  ],
  croissant: [
    "كرواسون",
    "كروسان",
    "كرواسو",
    "croissant",
    "pastry",
  ],
  cheapest: [
    "ارخص",
    "اقل سعر",
    "cheapest",
    "lowest price",
  ],
  expensive: [
    "اغلي",
    "اعلي سعر",
    "most expensive",
    "highest price",
  ],
  strong: [
    "قوي",
    "تقيل",
    "كافيين",
    "يفوق",
    "افوق",
    "تركيز",
    "strong",
    "bold",
  ],
  sweet: [
    "حلو",
    "مسكر",
    "سكري",
    "كريمي",
    "sweet",
    "creamy",
  ],
  cold: [
    "بارد",
    "ساقع",
    "متلج",
    "مثلج",
    "iced",
    "cold",
  ],
  menu: [
    "منيو",
    "انواع القهوه",
    "مشروبات",
    "products",
    "menu",
  ],
  location: [
    "مكان",
    "عنوان",
    "فين",
    "location",
    "address",
  ],
  delivery: [
    "توصيل",
    "دليفري",
    "اوردر",
    "طلب",
    "delivery",
    "order",
  ],
  account: [
    "حساب",
    "تسجيل",
    "اكونت",
    "account",
    "register",
    "login",
  ],
  greeting: [
    "اهلا",
    "مرحبا",
    "السلام",
    "صباح الخير",
    "مساء الخير",
    "hello",
    "hi",
    "hey",
  ],
};

export async function POST(request: Request) {
  const parsed = schema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return fail("Invalid message");
  }

  const text = parsed.data.message;
  const query = normalize(text);
  const arabic = isArabic(text);

  const [rows]: any = await db.query(`
    SELECT
      p.slug,
      p.name_en,
      p.name_ar,
      p.description_en,
      p.description_ar,
      p.base_price,
      p.is_available,
      p.type,
      c.name_en AS category_en,
      c.name_ar AS category_ar
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_available = 1
    ORDER BY p.sort_order, p.name_en
  `);

  const products = rows || [];
  const drinks = products.filter(
    (product: any) => product.type === "drink",
  );
  const pastries = products.filter(
    (product: any) => product.type === "pastry",
  );

  const findProduct = (slug: string) =>
    products.find((product: any) => product.slug === slug);

  const productNames = (product: any) =>
    [
      product.name_en,
      product.name_ar,
      product.slug.replace(/-/g, " "),
      ...(aliases[product.slug] || []),
    ]
      .filter(Boolean)
      .map(normalize);

  const productScore = (product: any) =>
    Math.max(
      ...productNames(product).map((name: string) => {
        if (query.includes(name)) return 1;

        const words = query.split(" ");
        const wordScore = Math.max(
          0,
          ...words.map((word) => similarity(word, name)),
        );

        return Math.max(
          wordScore,
          similarity(query, name),
          fuzzyIncludes(query, name, 0.72) ? 0.8 : 0,
        );
      }),
    );

  const productMatch = products
    .map((product: any) => ({
      product,
      score: productScore(product),
    }))
    .sort((a: any, b: any) => b.score - a.score)[0];

  const matchedProduct =
    productMatch?.score >= 0.66
      ? productMatch.product
      : null;

  const productLines = (items: any[]) =>
    items
      .map(
        (item) =>
          `${arabic ? item.name_ar : item.name_en} — ${money(
            item.base_price,
            arabic,
          )}`,
      )
      .join(arabic ? "، " : "; ");

  let reply = "";

  const calculateIntent = hasAny(
    query,
    intentWords.calculate,
    0.7,
  );

  const foundItems: any[] = [];

  for (const product of products) {
    const matchedName = productNames(product)
      .sort((a: string, b: string) => b.length - a.length)
      .find((name: string) =>
        fuzzyIncludes(query, name, 0.72),
      );

    if (!matchedName) continue;

    const escapedName = matchedName.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const exactBefore = query.match(
      new RegExp(`(\\d+)\\s*(?:x|×)?\\s*${escapedName}`),
    );

    const exactAfter = query.match(
      new RegExp(`${escapedName}\\s*(?:x|×)?\\s*(\\d+)`),
    );

    const nearbyNumber = query.match(
      /(?:^|\s)(\d+)\s*(?:x|×)?\s*/,
    );

    const quantity = Math.max(
      1,
      Number(
        exactBefore?.[1] ||
          exactAfter?.[1] ||
          nearbyNumber?.[1] ||
          1,
      ),
    );

    if (
      !foundItems.some(
        (item) => item.product.slug === product.slug,
      )
    ) {
      foundItems.push({
        product,
        quantity,
      });
    }
  }

  if (calculateIntent && foundItems.length) {
    const total = foundItems.reduce(
      (sum, item) =>
        sum +
        Number(item.product.base_price) *
          item.quantity,
      0,
    );

    reply =
      foundItems
        .map(
          (item) =>
            `${item.quantity} × ${
              arabic
                ? item.product.name_ar
                : item.product.name_en
            } = ${money(
              Number(item.product.base_price) *
                item.quantity,
              arabic,
            )}`,
        )
        .join("\n") +
      `\n${arabic ? "الإجمالي" : "Total"} = ${money(
        total,
        arabic,
      )}\n${
        arabic
          ? "الأسعار الأساسية قبل الإضافات أو تغيير الحجم."
          : "Base prices before extras or size upgrades."
      }`;
  }

  if (!reply) {
    const range = query.match(
      /(?:من|بين|from|between)\s*(\d+(?:\.\d+)?)\s*(?:ل|الي|و|to|and|-)\s*(\d+(?:\.\d+)?)/i,
    );

    if (range) {
      const minimum = Math.min(
        Number(range[1]),
        Number(range[2]),
      );

      const maximum = Math.max(
        Number(range[1]),
        Number(range[2]),
      );

      const available = products.filter(
        (product: any) =>
          Number(product.base_price) >= minimum &&
          Number(product.base_price) <= maximum,
      );

      reply = available.length
        ? arabic
          ? `المتاح من ${money(
              minimum,
              true,
            )} إلى ${money(maximum, true)}:\n${productLines(
              available,
            )}`
          : `Available from ${money(
              minimum,
              false,
            )} to ${money(maximum, false)}:\n${productLines(
              available,
            )}`
        : arabic
          ? "مفيش أصناف متاحة في الرينج ده حاليًا."
          : "No available items in that range right now.";
    }
  }

  if (
    !reply &&
    hasAny(query, intentWords.headache, 0.62)
  ) {
    reply = arabic
      ? "لو الصداع بسيط وممكن يكون من قلة الكافيين: اشربي مياه الأول، وبعدها ممكن Espresso صغير أو Americano خفيف لو إنتِ معتادة على القهوة. ولو معدتك حساسة اختاري Latte أخف. القهوة مش علاج للصداع، ولو الصداع شديد أو متكرر أو غير معتاد يفضل استشارة طبيب."
      : "For a mild headache that may be related to caffeine withdrawal, hydrate first. If you normally drink coffee, consider a small Espresso or light Americano. Choose a Latte if your stomach is sensitive. Coffee is not a headache treatment; seek medical advice for severe, recurring, or unusual symptoms.";
  } else if (
    !reply &&
    hasAny(query, intentWords.beans, 0.66)
  ) {
    reply = arabic
      ? "أنواع البن المتاحة: House Blend متوازن للاستخدام اليومي؛ Brazilian بطعم شوكولاتة ومكسرات وحموضة قليلة ومناسب للاتيه والكابتشينو؛ Colombian متوازن بكراميل وفاكهة خفيفة ومناسب للأمريكانو والفلات وايت؛ Ethiopian عطري وفاكهي وحموضته أوضح ومناسب للإسبريسو أو القهوة السوداء؛ Decaf بطعم القهوة مع كافيين أقل ومناسب للمساء."
      : "Available bean choices: House Blend for a balanced everyday cup; Brazilian for chocolate and nutty notes with low acidity; Colombian for caramel and gentle fruit; Ethiopian for floral, fruity brightness; and Decaf for coffee flavor with less caffeine.";
  } else if (
    !reply &&
    hasAny(query, intentWords.time, 0.68)
  ) {
    reply = arabic
      ? "للصباح أو قبل الشغل: Espresso أو Americano. مع الفطار: Cappuccino أو Latte. بعد الأكل: Espresso أو Affogato لو عايزة حاجة حلوة. للجو الحار: Cold Brew. للمساء: Decaf أو Latte خفيف."
      : "Morning or before work: Espresso or Americano. With breakfast: Cappuccino or Latte. After a meal: Espresso, or Affogato for dessert. Hot weather: Cold Brew. Evening: Decaf or a light Latte.";
  } else if (
    !reply &&
    hasAny(query, intentWords.croissant, 0.62)
  ) {
    reply = arabic
      ? `الكرواسون المتاح حاليًا (${pastries.length} أنواع):\n${productLines(
          pastries,
        )}\nالسادة خفيف مع القهوة، والشوكولاتة واللوز والفستق للحلو، والجبنة أو التركي والجبنة للفطار أو وجبة مشبعة.`
      : `Available croissants (${pastries.length} types):\n${productLines(
          pastries,
        )}\nPlain pairs lightly with coffee; chocolate, almond and pistachio are sweet; cheese or turkey and cheese work well for breakfast.`;
  } else if (
    !reply &&
    hasAny(query, intentWords.cheapest, 0.7)
  ) {
    const cheapest = [...products].sort(
      (a: any, b: any) =>
        Number(a.base_price) - Number(b.base_price),
    )[0];

    reply = arabic
      ? `أرخص اختيار متاح هو ${cheapest.name_ar} بسعر ${money(
          cheapest.base_price,
          true,
        )}.`
      : `The cheapest available item is ${
          cheapest.name_en
        } at ${money(cheapest.base_price, false)}.`;
  } else if (
    !reply &&
    hasAny(query, intentWords.expensive, 0.7)
  ) {
    const mostExpensive = [...products].sort(
      (a: any, b: any) =>
        Number(b.base_price) - Number(a.base_price),
    )[0];

    reply = arabic
      ? `أعلى سعر حاليًا هو ${
          mostExpensive.name_ar
        } بسعر ${money(mostExpensive.base_price, true)}.`
      : `The highest current price is ${
          mostExpensive.name_en
        } at ${money(mostExpensive.base_price, false)}.`;
  } else if (
    !reply &&
    hasAny(query, intentWords.strong, 0.66)
  ) {
    const strongest =
      findProduct("espresso") ||
      findProduct("americano") ||
      drinks[0];

    reply = arabic
      ? `للطعم القوي والتركيز اختاري ${
          strongest.name_ar
        }: ${strongest.description_ar || ""} — ${money(
          strongest.base_price,
          true,
        )}. ولو عايزاه أطول وأخف شوية اختاري Americano.`
      : `For a bold, focused cup, choose ${
          strongest.name_en
        }: ${strongest.description_en || ""} — ${money(
          strongest.base_price,
          false,
        )}. Choose Americano for a longer, slightly lighter drink.`;
  } else if (
    !reply &&
    hasAny(query, intentWords.sweet, 0.66)
  ) {
    const sweet =
      findProduct("spanish-latte") ||
      findProduct("mocha") ||
      drinks[0];

    reply = arabic
      ? `اختيار حلو وكريمي مناسب: ${
          sweet.name_ar
        } بسعر ${money(
          sweet.base_price,
          true,
        )}. ولو بتحبي الشوكولاتة اختاري Mocha أو White Mocha.`
      : `A sweet, creamy pick: ${
          sweet.name_en
        } at ${money(
          sweet.base_price,
          false,
        )}. For chocolate, choose Mocha or White Mocha.`;
  } else if (
    !reply &&
    hasAny(query, intentWords.cold, 0.66)
  ) {
    const coldChoices = drinks.filter(
      (product: any) =>
        /cold|iced/.test(product.slug) ||
        /بارد|مثلج/.test(
          normalize(product.name_ar || ""),
        ) ||
        [
          "americano",
          "latte",
          "vanilla-latte",
          "caramel-macchiato",
          "mocha",
          "white-mocha",
        ].includes(product.slug),
    );

    reply = arabic
      ? `الاختيارات الباردة المقترحة:\n${productLines(
          coldChoices.slice(0, 8),
        )}`
      : `Recommended cold choices:\n${productLines(
          coldChoices.slice(0, 8),
        )}`;
  } else if (
    !reply &&
    hasAny(query, intentWords.menu, 0.68)
  ) {
    reply = arabic
      ? `عندنا ${drinks.length} مشروب و${pastries.length} نوع كرواسون. المشروبات تشمل: ${drinks
          .map((product: any) => product.name_ar)
          .join(
            "، ",
          )}. قولي ذوقك قوي ولا حلو ولا بارد، أو ميزانيتك من كام لكام.`
      : `We have ${drinks.length} drinks and ${
          pastries.length
        } croissants. Drinks include: ${drinks
          .map((product: any) => product.name_en)
          .join(
            ", ",
          )}. Tell me whether you prefer bold, sweet, cold, or give me a budget range.`;
  } else if (
    !reply &&
    hasAny(query, intentWords.location, 0.7)
  ) {
    reply = arabic
      ? "العنوان وبيانات التواصل موجودة في قسم Contact أسفل الصفحة."
      : "The address and contact details are in the Contact section at the bottom of the page.";
  } else if (
    !reply &&
    hasAny(query, intentWords.delivery, 0.68)
  ) {
    reply = arabic
      ? "اختاري المشروب أو الكرواسون من المنيو، حددي الحجم والإضافات، وبعدها أضيفيه للسلة واكتبي الاسم ورقم الهاتف والعنوان ثم أكدي الطلب."
      : "Choose a drink or croissant, select the size and extras, add it to the cart, then enter your name, phone number and address to confirm the order.";
  } else if (
    !reply &&
    hasAny(query, intentWords.account, 0.7)
  ) {
    reply = arabic
      ? "من أيقونة الشخص فوق تقدري تسجلي الدخول أو تعملي حساب. بعد تسجيل الدخول تظهر الحساب والطلبات والمفضلة، ولو الحساب Admin تظهر لوحة التحكم."
      : "Use the user icon to log in or create an account. After signing in, you can access Account, Orders and Favorites; Admin accounts also see the Dashboard.";
  } else if (!reply && matchedProduct) {
    reply = arabic
      ? `${matchedProduct.name_ar}: ${
          matchedProduct.description_ar ||
          "متاح الآن في المنيو"
        } — السعر ${money(
          matchedProduct.base_price,
          true,
        )}. القسم: ${matchedProduct.category_ar}.`
      : `${matchedProduct.name_en}: ${
          matchedProduct.description_en || "Available now"
        } — ${money(
          matchedProduct.base_price,
          false,
        )}. Category: ${matchedProduct.category_en}.`;
  } else if (
    !reply &&
    hasAny(query, intentWords.greeting, 0.68)
  ) {
    reply = arabic
      ? "أهلًا بيك في NØIR BEAN ☕ اسأليني بطريقتك حتى لو في أخطاء كتابة. قولي ذوقك، ميزانيتك، أو اسم أي مشروب وأنا أساعدك."
      : "Welcome to NØIR BEAN ☕ Ask naturally, even with typos. Tell me your taste, budget, or any item name and I’ll help.";
  } else if (!reply) {
    reply = arabic
      ? "قوليلي بتحبي المشروب قوي ولا حلو ولا بارد، أو اكتبي ميزانيتك، أو اسم أي مشروب/كرواسون حتى لو الكلمة فيها غلطة بسيطة."
      : "Tell me whether you prefer bold, sweet or cold, give me a budget, or type any drink or croissant name—even with a small typo.";
  }

  const session = currentSession();

  try {
    await db.execute(
      `
        INSERT INTO chat_messages (
          id,
          user_id,
          session_id,
          role,
          content
        )
        VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
      `,
      [
        uuid(),
        session?.userId || null,
        parsed.data.sessionId,
        "user",
        text,
        uuid(),
        session?.userId || null,
        parsed.data.sessionId,
        "assistant",
        reply,
      ],
    );
  } catch {
    // Chat replies should still work if logging fails.
  }

  return NextResponse.json({ reply });
}
