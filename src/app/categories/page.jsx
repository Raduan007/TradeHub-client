import Link from "next/link";
import { FaMobile, FaCar, FaCouch, FaTshirt, FaLaptop } from "react-icons/fa";

const CATEGORIES = [
  {
    slug: "electronics",
    label: "Electronics",
    icon: FaLaptop,
    description: "Laptops, gadgets, and home electronics.",
  },
  {
    slug: "furniture",
    label: "Furniture",
    icon: FaCouch,
    description: "Tables, chairs, and home decor.",
  },
  {
    slug: "vehicles",
    label: "Vehicles",
    icon: FaCar,
    description: "Cars, bikes, and vehicle parts.",
  },
  {
    slug: "fashion",
    label: "Fashion",
    icon: FaTshirt,
    description: "Clothing, shoes, and accessories.",
  },
  {
    slug: "mobile",
    label: "Mobile Phones",
    icon: FaMobile,
    description: "Smartphones and mobile accessories.",
  },
];

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Popular Categories
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Explore second-hand products by category.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                <Icon size={22} />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {category.label}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {category.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
