export default function BuyerPageHeader({ title, description }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
      ) : null}
    </div>
  );
}
