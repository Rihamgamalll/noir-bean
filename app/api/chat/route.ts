import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { fail,currentSession } from "@/lib/http";
import { uuid } from "@/lib/security";

const schema=z.object({message:z.string().min(1).max(800),sessionId:z.string().min(4).max(100)});
const isAr=(s:string)=>/[\u0600-\u06ff]/.test(s);
const digits=(s:string)=>s.replace(/[٠-٩]/g,d=>String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[۰-۹]/g,d=>String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const norm=(s:string)=>digits(s).toLowerCase().replace(/[؟?!.,،]/g,' ').replace(/ـ/g,'').replace(/\s+/g,' ').trim();
const money=(n:any,ar:boolean)=>`${Number(n).toFixed(Number(n)%1?2:0)} ${ar?'جنيه':'EGP'}`;
const aliases:Record<string,string[]>= {
 espresso:['اسبريسو','إسبريسو'],americano:['امريكانو','أمريكانو'],latte:['لاتيه','لاتي'],
 'spanish-latte':['سبانش لاتيه','اسبانيش لاتيه'],'vanilla-latte':['فانيلا لاتيه','فانيليا لاتيه'],
 'caramel-macchiato':['كراميل ماكياتو','كاراميل ماكياتو'],'flat-white':['فلات وايت'],cappuccino:['كابتشينو'],mocha:['موكا'],
 'cold-brew':['كولد برو','كولدبرو'],affogato:['افوجاتو','أفوجاتو'],'white-mocha':['وايت موكا'],
 'plain-croissant':['كرواسون سادة','كرواسون ساده'],'chocolate-croissant':['كرواسون شوكولاتة','كرواسون شوكلاته'],
 'almond-croissant':['كرواسون لوز'],'pistachio-croissant':['كرواسون فستق'],'cheese-croissant':['كرواسون جبنة','كرواسون جبنه'],
 'turkey-cheese-croissant':['كرواسون تركي وجبنة','كرواسون تركي وجبنه']
};

export async function POST(r:Request){
 const p=schema.safeParse(await r.json().catch(()=>null));if(!p.success)return fail("Invalid message");
 const text=p.data.message,q=norm(text),ar=isAr(text);
 const [rows]:any=await db.query(`SELECT p.slug,p.name_en,p.name_ar,p.description_en,p.description_ar,p.base_price,p.is_available,p.type,c.name_en category_en,c.name_ar category_ar FROM products p JOIN categories c ON c.id=p.category_id WHERE p.is_available=1 ORDER BY p.sort_order,p.name_en`);
 const products=rows||[],drinks=products.filter((x:any)=>x.type==='drink'),pastries=products.filter((x:any)=>x.type==='pastry');
 const find=(slug:string)=>products.find((x:any)=>x.slug===slug);
 const productNames=(x:any)=>[x.name_en,x.name_ar,x.slug.replace(/-/g,' '),...(aliases[x.slug]||[])].map(norm);
 const match=products.find((x:any)=>productNames(x).some((n:string)=>n&&q.includes(n)));
 const productLines=(xs:any[])=>xs.map(x=>`${ar?x.name_ar:x.name_en} — ${money(x.base_price,ar)}`).join(ar?'، ':'; ');
 let reply='';

 // Order calculations using live prices.
 const calcIntent=/احسب|الحساب|المجموع|كام|تكلفة|total|calculate|how much|cost/.test(q);
 const found:any[]=[];
 for(const x of products){const name=productNames(x).find((n:string)=>q.includes(n));if(!name)continue;const esc=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const before=q.match(new RegExp(`(\\d+)\\s*(?:x|×)?\\s*${esc}`));const after=q.match(new RegExp(`${esc}\\s*(?:x|×)?\\s*(\\d+)`));found.push({x,qty:Math.max(1,Number(before?.[1]||after?.[1]||1))});}
 if(calcIntent&&found.length){const total=found.reduce((s,v)=>s+Number(v.x.base_price)*v.qty,0);reply=found.map(v=>`${v.qty} × ${ar?v.x.name_ar:v.x.name_en} = ${money(Number(v.x.base_price)*v.qty,ar)}`).join('\n')+`\n${ar?'الإجمالي':'Total'} = ${money(total,ar)}\n${ar?'الأسعار الأساسية قبل الإضافات أو تغيير الحجم.':'Base prices before extras or size upgrades.'}`;}

 // Price range recommendations.
 if(!reply){const range=q.match(/(?:من|بين|from|between)\s*(\d+(?:\.\d+)?)\s*(?:ل|الى|إلى|و|to|and|-)\s*(\d+(?:\.\d+)?)/i);if(range){const min=Math.min(+range[1],+range[2]),max=Math.max(+range[1],+range[2]);const xs=products.filter((x:any)=>+x.base_price>=min&&+x.base_price<=max);reply=xs.length?(ar?`المتاح من ${money(min,true)} إلى ${money(max,true)}:\n${productLines(xs)}`:`Available from ${money(min,false)} to ${money(max,false)}:\n${productLines(xs)}`):(ar?'مفيش أصناف متاحة في الرينج ده حاليًا.':'No available items in that range right now.');}}

 if(!reply&&/مصدع|صداع|headache|migraine/.test(q)) reply=ar?"لو الصداع بسيط وممكن يكون من قلة الكافيين: اشرب مياه الأول، وبعدها Espresso صغير أو Americano خفيف لو أنت معتاد على القهوة. لو معدتك حساسة اختار Latte أخف. القهوة مش علاج للصداع، ولو الصداع شديد أو متكرر أو مصحوب بأعراض غير طبيعية استشر طبيبًا.":"For a mild headache that may be caffeine withdrawal: hydrate first, then consider a small Espresso or light Americano if you normally drink coffee. Choose a Latte if your stomach is sensitive. Coffee is not a headache treatment; seek medical care for severe, recurring, or unusual symptoms.";
 else if(!reply&&/نوع البن|انواع البن|أنواع البن|bean type|beans|برازيلي|كولومبي|اثيوبي|إثيوبي|ديكاف/.test(q)) reply=ar?"أنواع البن المتاحة للاختيار: House Blend متوازن للاستخدام اليومي؛ Brazilian بطعم شوكولاتة ومكسرات وحموضة قليلة ومناسب للاتيه والكابتشينو؛ Colombian متوازن بكراميل وفاكهة خفيفة ومناسب للأمريكانو والفلات وايت؛ Ethiopian عطري وفاكهي وحموضته أوضح ومناسب للإسبريسو أو القهوة السوداء؛ Decaf بطعم القهوة مع كافيين أقل ومناسب للمساء أو لمن يقلل الكافيين.":"Available bean choices: House Blend for a balanced everyday cup; Brazilian for chocolate, nutty notes and low acidity—great with milk; Colombian for caramel and gentle fruit—good for Americano and Flat White; Ethiopian for floral, fruity brightness—best black or as espresso; Decaf for coffee flavor with less caffeine, especially later in the day.";
 else if(!reply&&/امتى|متي|when.*drink|الصبح|المساء|بعد الاكل|قبل الشغل/.test(q)) reply=ar?"للصباح أو قبل الشغل: Espresso أو Americano. مع الفطار: Cappuccino أو Latte. بعد الأكل: Espresso أو Affogato لو عايز حلو. للجو الحار: Cold Brew. للمساء: Decaf أو Latte خفيف. لو عايز حلو وكريمي: Spanish Latte أو Mocha.":"Morning or before work: Espresso or Americano. With breakfast: Cappuccino or Latte. After a meal: Espresso, or Affogato for dessert. Hot weather: Cold Brew. Evening: Decaf or a light Latte. Sweet and creamy: Spanish Latte or Mocha.";
 else if(!reply&&/كرواسون|croissant|pastr/.test(q)){reply=ar?`الكرواسون المتاح حاليًا (${pastries.length} أنواع):\n${productLines(pastries)}\nالسادة خفيف مع القهوة، الشوكولاتة واللوز والفستق للحلو، الجبنة أو التركي والجبنة للفطار أو وجبة مشبعة.`:`Available croissants (${pastries.length} types):\n${productLines(pastries)}\nPlain pairs lightly with coffee; chocolate, almond and pistachio are sweet; cheese or turkey & cheese work well for breakfast or a filling snack.`}
 else if(!reply&&/ارخص|أرخص|cheapest|اقل سعر/.test(q)){const x=[...products].sort((a:any,b:any)=>a.base_price-b.base_price)[0];reply=ar?`أرخص اختيار متاح هو ${x.name_ar} بسعر ${money(x.base_price,true)}.`:`The cheapest available item is ${x.name_en} at ${money(x.base_price,false)}.`}
 else if(!reply&&/اغلى|أغلى|most expensive|highest price/.test(q)){const x=[...products].sort((a:any,b:any)=>b.base_price-a.base_price)[0];reply=ar?`أعلى سعر حاليًا هو ${x.name_ar} بسعر ${money(x.base_price,true)}.`:`The highest current price is ${x.name_en} at ${money(x.base_price,false)}.`}
 else if(!reply&&/قوي|strong|bold|كافيين|يفوق/.test(q)){const x=find('espresso')||find('americano')||drinks[0];reply=ar?`للطعم القوي والتركيز اختار ${x.name_ar}: ${x.description_ar||''} — ${money(x.base_price,true)}. لو عايزه أطول وأخف شوية اختار Americano.`:`For a bold, focused cup, choose ${x.name_en}: ${x.description_en||''} — ${money(x.base_price,false)}. Choose Americano for a longer, slightly lighter drink.`}
 else if(!reply&&/حلو|sweet|كريمي|creamy/.test(q)){const x=find('spanish-latte')||find('mocha');reply=x?(ar?`اختيار حلو وكريمي مناسب: ${x.name_ar} بسعر ${money(x.base_price,true)}. ولو بتحب الشوكولاتة اختار Mocha أو White Mocha.`:`A sweet creamy pick: ${x.name_en} at ${money(x.base_price,false)}. For chocolate, choose Mocha or White Mocha.`):''}
 else if(!reply&&/بارد|ساقع|iced|cold/.test(q)){const xs=drinks.filter((x:any)=>/cold|iced/.test(x.slug)||/بارد|مثلج/.test(x.name_ar)||['americano','latte','vanilla-latte','caramel-macchiato','mocha','white-mocha'].includes(x.slug));reply=ar?`الاختيارات الباردة المقترحة:\n${productLines(xs.slice(0,8))}`:`Recommended cold choices:\n${productLines(xs.slice(0,8))}`}
 else if(!reply&&/منيو|menu|انواع القهوة|أنواع القهوة|products|مشروبات/.test(q)) reply=ar?`عندنا ${drinks.length} مشروب و${pastries.length} نوع كرواسون. المشروبات تشمل: ${drinks.map((x:any)=>x.name_ar).join('، ')}. قولي ذوقك قوي ولا حلو ولا بارد، أو ميزانيتك من كام لكام.`:`We have ${drinks.length} drinks and ${pastries.length} croissants. Drinks include: ${drinks.map((x:any)=>x.name_en).join(', ')}. Tell me whether you prefer bold, sweet, cold, or give me a budget range.`;
 else if(!reply&&/مكان|عنوان|location|address|فين/.test(q)) reply=ar?"العنوان وبيانات التواصل موجودة في قسم Contact أسفل الصفحة، ويمكن لصاحب الكافيه تعديلها قبل الاستضافة.":"The address and contact details are in the Contact section and can be updated by the café owner before deployment.";
 else if(!reply&&/توصيل|delivery|دليفري|اوردر|order/.test(q)) reply=ar?"اختار المشروب أو الكرواسون من المنيو، حدّد الحجم والإضافات، وبعدها أضفه للسلة وأكمل الطلب. حسابك يحفظ الطلبات السابقة.":"Choose a drink or croissant from the menu, select size and extras, add it to the cart, then complete the order. Your account stores past orders.";
 else if(!reply&&/حساب|register|login|تسجيل|اكونت|account/.test(q)) reply=ar?"من أيقونة الشخص فوق يظهر للضيف فقط: تسجيل الدخول أو إنشاء حساب. بعد تسجيل الدخول تظهر الحساب والطلبات والمفضلة، ولو الحساب Admin تظهر لوحة التحكم أيضًا.":"The user icon shows only Log in and Create account for guests. After sign-in it shows Account, Orders and Favorites; Admin accounts also see the Dashboard.";
 else if(!reply&&match) reply=ar?`${match.name_ar}: ${match.description_ar||'متاح الآن في المنيو'} — السعر ${money(match.base_price,true)}. القسم: ${match.category_ar}.`:`${match.name_en}: ${match.description_en||'Available now'} — ${money(match.base_price,false)}. Category: ${match.category_en}.`;
 else if(!reply&&/hello|hi|hey|السلام|اهلا|أهلا|مرحبا|صباح|مساء/.test(q)) reply=ar?"أهلًا بيك في NØIR BEAN ☕ اسألني عن أي مشروب أو كرواسون، الأسعار، رينج ميزانية، أنواع البن، ترشيح حسب وقت اليوم أو المزاج، أو حساب إجمالي طلبك.":"Welcome to NØIR BEAN ☕ Ask about any drink or croissant, prices, budget ranges, bean types, recommendations by time or mood, or an order total.";
 else if(!reply) reply=ar?"اسألني براحتك عن المنيو الحقيقية: مثلًا «أنا مصدعة أشرب إيه؟»، «عايزة حاجة من 100 لـ150»، «إيه الفرق بين البن البرازيلي والإثيوبي؟»، «احسب 2 لاتيه وكرواسون فستق»، أو اسم أي مشروب/كرواسون.":"Ask me about the live menu, for example: “What should I drink for a mild headache?”, “Something from 100 to 150”, “Brazilian vs Ethiopian beans”, “Calculate 2 lattes and a pistachio croissant”, or any item name.";

 const s=currentSession();try{await db.execute("INSERT INTO chat_messages(id,user_id,session_id,role,content) VALUES(?,?,?,?,?),(?,?,?,?,?)",[uuid(),s?.userId||null,p.data.sessionId,'user',text,uuid(),s?.userId||null,p.data.sessionId,'assistant',reply])}catch{}
 return NextResponse.json({reply});
}
