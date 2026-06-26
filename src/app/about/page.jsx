export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          About ReSell Hub
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          ReSell Hub is an online marketplace where users can buy and sell pre-owned products
          safely and efficiently. We help reduce waste, promote sustainable consumption, and
          create opportunities for users to earn money from unused items.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Our Mission</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Many people own products that are still usable but no longer needed. ReSell Hub connects
          buyers looking for affordable products with sellers who want to give items a second life.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Sustainable", text: "Reduce waste through second-hand commerce." },
          { title: "Secure", text: "Protected accounts, orders, and payment records." },
          { title: "Community", text: "Trusted buyers and sellers across Bangladesh." },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-200 p-5 dark:border-slate-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
