import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <img 
        src="/images/company.png" 
        alt="TradeHub Logo" 
        className="h-10 w-auto"
      />
      <span className="text-white font-bold text-xl hidden sm:inline">
        TradeHub
      </span>
    </Link>
  );
}
