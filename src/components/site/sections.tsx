import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
        <span className="mr-2 inline-block h-[2px] w-6 translate-y-[-3px] bg-accent-500" />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl",
          dark ? "text-white" : "text-navy-900"
        )}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={cn(
            "mt-4 text-[15px] leading-relaxed",
            dark ? "text-slate-300" : "text-slate-600"
          )}
        >
          {desc}
        </p>
      )}
    </div>
  );
}

export function PageHero({
  title,
  desc,
  image = "/images/6.jpg",
}: {
  title: string;
  desc?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/70 to-navy-950/20" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 pt-32 sm:px-6 sm:py-24 sm:pt-36">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
          Faqib Surya Perkasa
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white text-balance sm:text-5xl">
          {title}
        </h1>
        {desc && (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}
