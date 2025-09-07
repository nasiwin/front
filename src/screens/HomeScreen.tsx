import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CirclePlus, ShoppingCart, User2, BarChart3, Settings, ScanLine, Search, UtensilsCrossed } from "lucide-react";

const DIET_BG_DATA_URI = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='360' viewBox='0 0 1600 360'><rect width='100%25' height='100%25' fill='transparent'/><g transform='translate(800,180) scale(1.2,0.8) translate(-800,-180) translate(40,72)'><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter,Segoe%20UI,system-ui,Arial,sans-serif' font-size='190' fill='%236B7280' opacity='0.85' letter-spacing='10'>KETO</text></g></svg>";

const exampleDiet = {
  id: "keto",
  name: "Кето",
  kcalTarget: 1800,
  macros: { p: 130, f: 120, c: 30 },
  rules: { maxSugar: 10, maxNetCarbs: 30, avoid: ["рафинированный сахар", "сладкие напитки", "белый хлеб"] },
};

const exampleDayStats = { kcal: 920, macros: { p: 68, f: 72, c: 14 } };

const exampleTrips = [
  { id: "trip-1", title: "Покупка — Магнит (09:20)", items: [
    { id: "1", name: "Творог 5% 180г", qty: 1, kcal: 240, p: 26, f: 10, c: 6, fit: "ok" },
    { id: "2", name: "Шоколад молочный 90г", qty: 1, kcal: 480, p: 6, f: 28, c: 52, fit: "warn", reason: "Сахар/углеводы" },
  ]},
  { id: "trip-2", title: "Покупка — Пятёрочка (12:05)", items: [
    { id: "3", name: "Лосось стейк 300г", qty: 1, kcal: 450, p: 60, f: 24, c: 0, fit: "ok" },
  ]},
];

function clamp(n: number, min = 0, max = 100) { return Math.max(min, Math.min(max, n)); }
function pct(current: number, target: number) { if (!target) return 0; return clamp(Math.round((current / target) * 100)); }

function suggestAlternatives(product: any, diet: any) {
  if (product.fit === "ok") return [] as Array<{ name: string; reason: string }>;
  if (/шоколад|конфет|печен|сахар/i.test(product.name)) {
    return [
      { name: "Горький шоколад 85% 40г", reason: "Меньше сахара, ниже net carbs" },
      { name: "Миндаль 30г", reason: "Жиры/белки, почти без сахара" },
    ];
  }
  return [
    { name: "Яйца 2 шт.", reason: "Белок и жир без углеводов" },
    { name: "Сыр 30г", reason: "Жиры/белки, низкие угли" },
  ];
}

function compensationsForBasket(trips: any[], diet: any) {
  const totals = trips.flatMap(t => t.items).reduce((acc: any, it: any) => {
    acc.kcal += it.kcal * it.qty; acc.p += it.p * it.qty; acc.f += it.f * it.qty; acc.c += it.c * it.qty; return acc;
  }, { kcal: 0, p: 0, f: 0, c: 0 });
  const out: Array<{ name: string; reason: string }> = [];
  if (totals.c > diet.macros.c * 0.6) out.push({ name: "Тунец в собственном соку 1 банка", reason: "Компенсирует избыток углей белком" });
  if (totals.p < diet.macros.p * 0.6) out.push({ name: "Греческий йогурт 200г", reason: "Добавит белка" });
  if (totals.f < diet.macros.f * 0.6) out.push({ name: "Авокадо 1 шт.", reason: "Полезные жиры" });
  return out;
}

export default function HomeScreen() {
  const [diet, setDiet] = useState(exampleDiet);
  const [stats, setStats] = useState(exampleDayStats);
  const [trips, setTrips] = useState(exampleTrips);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const totals = useMemo(() => {
    const base = trips.flatMap(t => t.items).reduce((acc: any, it: any) => {
      acc.kcal += it.kcal * it.qty; acc.p += it.p * it.qty; acc.f += it.f * it.qty; acc.c += it.c * it.qty; return acc;
    }, { kcal: 0, p: 0, f: 0, c: 0 });
    return base;
  }, [trips]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pb-28">
      <TopBar diet={diet} />
      <main className="px-4 pt-4 space-y-4 max-w-md mx-auto">
        <DietCard diet={diet} onOpenSettings={() => {}} />
        <div className="grid grid-cols-2 gap-4">
          <StatsCard stats={stats} diet={diet} />
          <BasketCard trips={trips} onOpenBasket={() => {}} />
        </div>
      </main>
      <ScannerFAB onClick={() => setScannerOpen(true)} />
      <ScannerDialog
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onManualSubmit={(code: string) => { const mock = mockByBarcode(code); setScanResult(mock); }}
      >
        <ScanResultView result={scanResult} diet={diet} onAdd={(p: any) => addToBasket(setTrips, p)} />
      </ScannerDialog>
      <BottomBar />
    </div>
  );
}

function TopBar({ diet }: { diet: typeof exampleDiet }) {
  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 grid place-items-center">
            <User2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Моя диета</div>
            <div className="font-semibold leading-tight">{diet.name}</div>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[90vw] max-w-sm">
            <SheetHeader>
              <SheetTitle>Настройки</SheetTitle>
            </SheetHeader>
            <div className="mt-4 text-sm text-slate-600 space-y-3" />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function DietCard({ diet, onOpenSettings }: { diet: typeof exampleDiet; onOpenSettings: () => void }) {
  return (
    <Card className="rounded-2xl overflow-hidden relative shadow-sm cursor-pointer min-h-20" onClick={onOpenSettings}>
      <img src={DIET_BG_DATA_URI} alt="KETO background" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <CardHeader className="relative z-10 h-20 w-full flex flex-row items-center justify-between pl-4 pr-4">
        <div className="flex flex-col">
          <CardTitle className="text-base">Моя диета</CardTitle>
        </div>
        <UtensilsCrossed className="h-6 w-6 mr-2" />
      </CardHeader>
      <CardContent className="p-0 hidden" />
    </Card>
  );
}

function StatsRow({ label, value, target }: { label: string; value: number; target: number }) {
  const p = pct(value, target);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-900">{value} / {target}</span>
      </div>
      <Progress value={p} className="h-1" />
    </div>
  );
}

function StatsCard({ stats, diet }: { stats: typeof exampleDayStats; diet: typeof exampleDiet }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Статистика за сегодня
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 px-3 pb-3">
        <StatsRow label="Калории" value={stats.kcal} target={diet.kcalTarget} />
        <StatsRow label="Белки" value={stats.macros.p} target={diet.macros.p} />
        <StatsRow label="Жиры" value={stats.macros.f} target={diet.macros.f} />
        <StatsRow label="Углеводы" value={stats.macros.c} target={diet.macros.c} />
      </CardContent>
    </Card>
  );
}

function FitBadge({ fit }: { fit: "ok" | "warn" | string }) {
  if (fit === "ok") return <Badge className="bg-emerald-600 hover:bg-emerald-600">Подходит</Badge>;
  if (fit === "warn") return <Badge variant="destructive">Компенсировать</Badge>;
  return <Badge variant="secondary">Неизвестно</Badge>;
}

function BasketCard({ trips, onOpenBasket }: { trips: typeof exampleTrips; onOpenBasket: () => void }) {
  return (
    <Card className="rounded-2xl shadow-sm cursor-pointer" onClick={onOpenBasket}>
      <CardHeader className="py-1 px-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" /> Корзина на сегодня
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="space-y-2 max-h-40 overflow-auto">
          {trips.map(trip => (
            <div key={trip.id} className="border rounded-lg p-2">
              <div className="text-xs text-slate-500 mb-1">{trip.title}</div>
              <div className="space-y-1">
                {trip.items.map(it => (
                  <div key={it.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{it.name} ×{it.qty}</div>
                      <div className="text-xs text-slate-500">{it.kcal} ккал · Б{it.p} Ж{it.f} У{it.c}</div>
                    </div>
                    <FitBadge fit={it.fit} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ScannerFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full grid place-items-center border border-black/20 shadow-xl bg-black text-white hover:opacity-90 active:scale-95 transition"
      aria-label="Сканер штрихкодов"
    >
      <ScanLine className="h-7 w-7" />
    </button>
  );
}

function ScannerDialog({ open, onOpenChange, children, onManualSubmit }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode; onManualSubmit: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if ("BarcodeDetector" in window) setSupported(true);
  }, []);

  useEffect(() => {
    let cleanup = () => {};
    async function start() {
      if (!open || !supported) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          (videoRef.current as HTMLVideoElement).srcObject = stream as any;
          await (videoRef.current as HTMLVideoElement).play();
        }
        setActive(true);
        // @ts-ignore
        const detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "code_128"] });
        let stop = false;
        const tick = async () => {
          if (stop) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes && barcodes[0]) onManualSubmit(barcodes[0].rawValue);
          } catch {}
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cleanup = () => { stop = true; stream.getTracks().forEach(t => t.stop()); setActive(false); };
      } catch (e) { console.warn(e); }
    }
    start();
    return () => cleanup();
  }, [open, supported, onManualSubmit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Сканер</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {supported ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden grid place-items-center">
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            </div>
          ) : (
            <div className="p-4 border rounded-xl text-sm text-slate-600">Ваш браузер не поддерживает BarcodeDetector. Введите код вручную ниже.</div>
          )}
          <div className="flex items-center gap-2">
            <Input placeholder="Введите штрихкод" onKeyDown={(e) => { if ((e as any).key === "Enter") onManualSubmit((e.currentTarget as HTMLInputElement).value); }} />
            <Button onClick={() => { const el = document.querySelector("input[placeholder='Введите штрихкод']") as HTMLInputElement | null; if (el) onManualSubmit(el.value); }}>
              <Search className="h-4 w-4 mr-1" /> OK
            </Button>
          </div>
          <div className="rounded-xl border p-3">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScanResultView({ result, diet, onAdd }: { result: any; diet: typeof exampleDiet; onAdd: (p: any) => void }) {
  if (!result) return <div className="text-sm text-slate-500">Наведите камеру на штрихкод или введите код.</div>;
  const alts = suggestAlternatives(result, diet);
  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium leading-tight">{result.name}</div>
          <div className="text-xs text-slate-500">{result.kcal} ккал · Б{result.p} Ж{result.f} У{result.c}</div>
        </div>
        <FitBadge fit={result.fit} />
      </div>
      {result.fit === "warn" && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">Причина: {result.reason || "может нарушить правила диеты"}</div>
      )}
      <div className="flex items-center gap-2">
        <Button onClick={() => onAdd(result)} className="flex-1">
          <CirclePlus className="h-4 w-4 mr-1" /> В корзину
        </Button>
      </div>
      {alts.length > 0 && (
        <div className="pt-2 border-t space-y-2">
          <div className="text-xs text-slate-500">Альтернативы</div>
          {alts.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <Badge variant="secondary" className="shrink-0">Вариант</Badge>
              <div>
                <div className="font-medium leading-tight">{a.name}</div>
                <div className="text-xs text-slate-500">{a.reason}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BottomBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/80 backdrop-blur py-2">
      <div className="max-w-md mx-auto px-6 grid grid-cols-4 gap-2 text-xs">
        <NavBtn icon={<ScanLine className="h-5 w-5" />} label="Сканер" active={false} />
        <NavBtn icon={<ShoppingCart className="h-5 w-5" />} label="Корзина" />
        <NavBtn icon={<BarChart3 className="h-5 w-5" />} label="Статистика" />
        <NavBtn icon={<User2 className="h-5 w-5" />} label="Аккаунт" />
      </div>
    </nav>
  );
}

function NavBtn({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${active ? "text-slate-900" : "text-slate-500"}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function mockByBarcode(code: string) {
  if (!code) return null;
  if (/^460/.test(code)) return { id: code, name: "Шоколад молочный 90г", qty: 1, kcal: 480, p: 6, f: 28, c: 52, fit: "warn", reason: "Сахар/углеводы" };
  return { id: code, name: "Творог 5% 180г", qty: 1, kcal: 240, p: 26, f: 10, c: 6, fit: "ok" };
}

function addToBasket(setTrips: React.Dispatch<React.SetStateAction<typeof exampleTrips>>, product: any) {
  setTrips(prev => {
    const copy = [...prev];
    if (!copy[0]) copy.unshift({ id: `trip-${Date.now()}`, title: "Покупка — Сейчас", items: [] as any[] });
    (copy[0] as any).items.unshift({ ...product, id: `${Date.now()}` });
    return copy as typeof exampleTrips;
  });
}

export const __testables = { clamp, pct, suggestAlternatives, compensationsForBasket, mockByBarcode };


