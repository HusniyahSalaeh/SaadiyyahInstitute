
"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, BookOpen, GraduationCap, FileText,
  Search, Filter, X, Plus, Minus, Sparkles, BadgeCheck,
  Globe, CreditCard, Download, Info
} from "lucide-react";

const SITE = {
  brand: "EduCartoon",
  tagline: "แหล่งรวมใบงาน คอร์สออนไลน์ และหนังสือการ์ตูนเพื่อการเรียนรู้สนุก ๆ",
  highlight: "เปิดตัว! คอลเลกชันใบงานวิทยาศาสตร์ ป.4-6",
  social: {
    facebook: "https://facebook.com/",
    line: "https://line.me/ti/p/",
    youtube: "https://youtube.com/@",
  },
  payment: {
    howTo: "โอนผ่าน PromptPay แล้วแนบสลิปในกล่องข้อความ หรือส่งมาที่ LINE",
    checkoutLink: "#",
  },
};

type ItemType = "worksheet" | "course" | "comic";
type CatalogItem = {
  id: string;
  type: ItemType;
  title: string;
  price: number;
  tags: string[];
  desc: string;
  thumb: string;
  downloadSample?: string;
  digital?: boolean;
  physical?: boolean;
  bestseller?: boolean;
  new?: boolean;
  hours?: number;
  lessons?: number;
};

const CATALOG: CatalogItem[] = [
  {
    id: "wks-001",
    type: "worksheet",
    title: "ใบงานคณิต ป.3 ชุดที่ 1",
    price: 79,
    tags: ["คณิต", "ป.3"],
    desc: "แบบฝึกหัดบวก ลบ คูณ หาร พร้อมเฉลย ดาวน์โหลดเป็น PDF พิมพ์ได้",
    thumb: "https://images.unsplash.com/photo-1584697964154-3f71e66b4a7a?w=600&auto=format&fit=crop&q=60",
    downloadSample: "#",
    digital: true,
    bestseller: true,
  },
  {
    id: "wks-002",
    type: "worksheet",
    title: "ใบงานวิทย์ ป.5 เรื่อง สิ่งมีชีวิต",
    price: 89,
    tags: ["วิทยาศาสตร์", "ป.5"],
    desc: "กิจกรรมสืบเสาะหาความรู้ แผ่นกิจกรรม + ใบประเมิน",
    thumb: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&auto=format&fit=crop&q=60",
    downloadSample: "#",
    digital: true,
    new: true,
  },
  {
    id: "crs-101",
    type: "course",
    title: "วาดการ์ตูนตั้งแต่ 0 ถึงออกเล่มแรก",
    price: 1290,
    tags: ["การ์ตูน", "วาดภาพ", "ผู้เริ่มต้น"],
    desc: "คอร์สวิดีโอ 20 บท + ไฟล์ brush + กลุ่มเฉพาะตอบคำถาม",
    thumb: "https://images.unsplash.com/photo-1544551763-7ef42006926f?w=600&auto=format&fit=crop&q=60",
    hours: 12,
    lessons: 45,
    digital: true,
    bestseller: true,
  },
  {
    id: "crs-102",
    type: "course",
    title: "ฟิสิกส์สนุก ม.ต้น: แรงและการเคลื่อนที่",
    price: 1590,
    tags: ["ฟิสิกส์", "มัธยมต้น"],
    desc: "คอร์สอินเตอร์แอคทีฟ + แบบฝึกหัดออนไลน์ + ใบงานแถม",
    thumb: "https://images.unsplash.com/photo-1517976487492-576ea3455634?w=600&auto=format&fit=crop&q=60",
    hours: 10,
    lessons: 30,
    digital: true,
  },
  {
    id: "cmc-201",
    type: "comic",
    title: "นักสืบหมีพูห์ ภาค 1",
    price: 199,
    tags: ["การ์ตูน", "สืบสวน"],
    desc: "หนังสือการ์ตูนพิมพ์สีทั้งเล่ม พร้อมโค้ดโหลด e-book",
    thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=60",
    digital: true,
    physical: true,
  },
  {
    id: "cmc-202",
    type: "comic",
    title: "วิทย์มันส์ซ่า เล่มพิเศษ: ห้องทดลองในครัว",
    price: 179,
    tags: ["วิทยาศาสตร์", "ครอบครัว"],
    desc: "คอมิกความรู้ ทดลองง่าย ๆ ในบ้าน เหมาะกับทุกวัย",
    thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=60",
    digital: true,
    physical: false,
    new: true,
  },
];

const currency = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB" });

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial as T;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"worksheet" | "course" | "comic" | "all">("all");
  const [sort, setSort] = useState<"popular" | "new" | "price_asc" | "price_desc">("popular");
  const [onlyDigital, setOnlyDigital] = useState(false);
  const [cart, setCart] = useLocalStorage<{ id: string; qty: number }[]>("cart", []);
  const [active, setActive] = useState<CatalogItem | null>(null);

  const filtered = useMemo(() => {
    let items = CATALOG.slice();
    if (type !== "all") items = items.filter((i) => i.type === type);
    if (onlyDigital) items = items.filter((i) => i.digital);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          i.desc.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "new":
        items = items.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case "price_asc":
        items = items.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        items = items.sort((a, b) => b.price - a.price);
        break;
      default:
        items = items.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }
    return items;
  }, [query, type, sort, onlyDigital]);

  const total = useMemo(
    () =>
      cart.reduce((sum, c) => {
        const item = CATALOG.find((i) => i.id === c.id);
        return sum + (item ? item.price * c.qty : 0);
      }, 0),
    [cart]
  );

  const addToCart = (id: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { id, qty }];
    });
  };
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((p) => p.id !== id));
  const setQty = (id: string, qty: number) =>
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  const clearCart = () => setCart([]);

  return (
    <div>
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b">
        <div className="container py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-indigo-600 grid place-items-center text-white shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold leading-tight">{SITE.brand}</div>
              <div className="text-xs text-slate-500">{SITE.tagline}</div>
            </div>
            <span className="badge ml-2 bg-green-100 border-green-300">พร้อมขาย</span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <a className="hover:underline" href={SITE.social.facebook}>Facebook</a>
            <a className="hover:underline" href={SITE.social.line}>LINE</a>
            <a className="hover:underline" href={SITE.social.youtube}>YouTube</a>
            <button className="btn" onClick={() => document.getElementById("cart-drawer")?.classList.remove("hidden")}>
              <ShoppingCart className="h-4 w-4 mr-2" /> ตะกร้า ({cart.reduce((a, b) => a + b.qty, 0)})
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-10 md:py-14 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">สร้างการเรียนรู้ให้สนุก ด้วยสื่อพร้อมใช้</h1>
          <p className="text-slate-600 mt-3 md:text-lg">{SITE.tagline}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="badge"><FileText className="h-3.5 w-3.5 mr-1" />ใบงาน</span>
            <span className="badge"><GraduationCap className="h-3.5 w-3.5 mr-1" />คอร์สออนไลน์</span>
            <span className="badge"><BookOpen className="h-3.5 w-3.5 mr-1" />หนังสือการ์ตูน</span>
            <span className="badge bg-amber-100 border-amber-300"><BadgeCheck className="h-3.5 w-3.5 mr-1" />คุณครูใช้ได้ ผู้ปกครองก็เลิฟ</span>
          </div>
          <div className="mt-6 flex gap-2">
            <a href="#catalog" className="btn btn-primary"><ShoppingCart className="h-4 w-4 mr-2"/>ช็อปเลย</a>
            <a href="#contact" className="btn"><Globe className="h-4 w-4 mr-2"/>พูดคุยกับเรา</a>
          </div>
          <div className="mt-3 text-sm text-indigo-700 font-medium">{SITE.highlight}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&auto=format&fit=crop&q=60" className="rounded-3xl shadow-2xl border" />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow p-3 flex items-center gap-2 border text-sm">
              <Info className="h-4 w-4" /> แก้รูป/ข้อความได้จากตัวแปรด้านบน
            </div>
          </div>
        </motion.div>
      </section>

      {/* Controls */}
      <section id="catalog" className="border-t bg-white/60">
        <div className="container py-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-9"
                placeholder="ค้นหาชื่อสินค้า แท็ก หรือคำอธิบาย"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="input w-[160px]" value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="all">ทั้งหมด</option>
                <option value="worksheet">ใบงาน</option>
                <option value="course">คอร์ส</option>
                <option value="comic">การ์ตูน</option>
              </select>
              <select className="input w-[160px]" value={sort} onChange={(e) => setSort(e.target.value as any)}>
                <option value="popular">ยอดนิยม</option>
                <option value="new">มาใหม่</option>
                <option value="price_asc">ราคาต่ำ-สูง</option>
                <option value="price_desc">ราคาสูง-ต่ำ</option>
              </select>
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl border">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm">เฉพาะดิจิทัล</span>
                <input type="checkbox" className="h-4 w-4" checked={onlyDigital} onChange={(e) => setOnlyDigital(e.target.checked)} />
              </label>
            </div>
          </div>

          {/* Grid */}
          <div className="grid-catalog mt-6">
            {filtered.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                <div className="relative">
                  <img src={item.thumb} className="h-44 w-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.bestseller && <span className="badge bg-rose-100 border-rose-300">ขายดี</span>}
                    {item.new && <span className="badge bg-emerald-100 border-emerald-300">มาใหม่</span>}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-lg font-semibold leading-tight line-clamp-2">{item.title}</div>
                  <div className="text-sm text-slate-600 line-clamp-2 mt-1">{item.desc}</div>
                  <div className="flex flex-wrap gap-2 my-3">
                    {item.tags.map((t) => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">{currency(item.price)}</div>
                    <div className="text-xs text-slate-500">{item.digital ? "Digital" : ""}{item.physical ? " + หนังสือจริง" : ""}</div>
                  </div>
                </div>
                <div className="p-4 flex gap-2">
                  <button className="btn btn-primary flex-1" onClick={() => addToCart(item.id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> เพิ่มลงตะกร้า
                  </button>
                  <button className="btn" onClick={() => setActive(item)}>ดูรายละเอียด</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="container">
          <div className="card p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-2xl font-bold">ดาวน์โหลดแคตตาล็อกตัวอย่าง</div>
              <p className="text-slate-600 mt-2">รวมตัวอย่างใบงาน คอร์ส และตัวอย่างหน้าหนังสือการ์ตูน</p>
              <div className="mt-4 flex gap-2">
                <a className="btn" href="#"><Download className="h-4 w-4 mr-2" />ดาวน์โหลด PDF</a>
                <a className="btn btn-primary" href="#catalog">เลือกต่อ</a>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&auto=format&fit=crop&q=60" className="rounded-2xl border shadow" />
          </div>
        </div>
      </section>

      {/* FAQ & Contact */}
      <section id="contact" className="py-12 bg-slate-50 border-t">
        <div className="container grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold">คำถามที่พบบ่อย</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li><span className="font-semibold">Q: ได้ไฟล์เมื่อไหร่?</span><br/>A: สินค้าดิจิทัลจะได้รับลิงก์ดาวน์โหลดทันทีหลังชำระเงิน</li>
              <li><span className="font-semibold">Q: นำไปใช้เชิงพาณิชย์ได้ไหม?</span><br/>A: ใช้สอนในห้องเรียน/ครอบครัวได้ หากต้องการลิขสิทธิ์เพิ่มเติมติดต่อเรา</li>
              <li><span className="font-semibold">Q: ออกใบเสร็จได้หรือไม่?</span><br/>A: ได้ แจ้งรายละเอียดในฟอร์มสั่งซื้อได้เลย</li>
            </ul>
          </div>
          <div className="card p-5">
            <div className="text-lg font-semibold">ติดต่อ/สั่งซื้อแบบด่วน</div>
            <div className="text-sm text-slate-600">ระบุรายการที่ต้องการหรือสอบถามข้อมูล</div>
            <div className="space-y-3 mt-4">
              <input className="input" placeholder="ชื่อของคุณ" />
              <input className="input" placeholder="อีเมลหรือ LINE ID" />
              <textarea className="input" placeholder="ข้อความ" />
              <div className="flex gap-2">
                <a className="btn btn-primary" href={SITE.payment.checkoutLink}>ส่งข้อความ</a>
                <a className="btn" href={SITE.social.line}>แชทผ่าน LINE</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {SITE.brand} • ทั้งหมดนี้ปรับแก้ได้ • ทำด้วยรักให้การเรียนรู้สนุกขึ้น
      </footer>

      {/* Drawer Cart */}
      <div id="cart-drawer" className="hidden fixed inset-0">
        <div className="modal-backdrop" onClick={() => document.getElementById("cart-drawer")?.classList.add("hidden")}></div>
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">ตะกร้าสินค้า</div>
            <button className="btn" onClick={() => document.getElementById("cart-drawer")?.classList.add("hidden")}><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 space-y-3 flex-1 overflow-auto">
            {cart.length === 0 && <div className="text-sm text-slate-500">ยังไม่มีสินค้า</div>}
            {cart.map((c) => {
              const item = CATALOG.find((i) => i.id === c.id)!;
              return (
                <div key={c.id} className="flex items-center gap-3 border rounded-xl p-3">
                  <img src={item.thumb} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-slate-500">{currency(item.price)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="btn" onClick={() => setQty(c.id, c.qty - 1)}><Minus className="h-4 w-4" /></button>
                      <div className="w-9 text-center">{c.qty}</div>
                      <button className="btn" onClick={() => setQty(c.id, c.qty + 1)}><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <button className="btn" onClick={() => removeFromCart(c.id)}><X className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>รวม</span>
              <span className="font-semibold">{currency(total)}</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">{SITE.payment.howTo}</div>
            <div className="flex gap-2 mt-4">
              <a className="btn btn-primary w-full" href={SITE.payment.checkoutLink}>
                <CreditCard className="h-4 w-4 mr-2" /> ชำระเงิน/กรอกข้อมูล
              </a>
              <button className="btn" onClick={clearCart}>ล้างตะกร้า</button>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">* ระบบเป็นเดโม่ ต่อเกตเวย์ชำระเงินจริงได้ (Stripe/Omise/PromptPay)</div>
        </div>
      </div>

      {/* Modal Details */}
      {active && (
        <div className="fixed inset-0 z-50">
          <div className="modal-backdrop" onClick={() => setActive(null)}></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border shadow-xl w-[90vw] max-w-2xl p-4">
            <div className="text-lg font-semibold">{active.title}</div>
            <div className="grid sm:grid-cols-2 gap-4 mt-3">
              <img src={active.thumb} className="rounded-xl border object-cover w-full h-44" />
              <div>
                <div className="text-sm text-slate-600">{active.desc}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {active.tags.map((t) => <span key={t} className="badge">{t}</span>)}
                </div>
                <div className="mt-3 text-2xl font-bold">{currency(active.price)}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {active.digital && "Digital"} {active.physical && "+ หนังสือจริง"}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn btn-primary" onClick={() => addToCart(active.id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> เพิ่มลงตะกร้า
                  </button>
                  {active.downloadSample && <a className="btn" href={active.downloadSample} target="_blank">ดูตัวอย่าง</a>}
                </div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button className="btn" onClick={() => setActive(null)}>ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
