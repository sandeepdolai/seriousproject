"use client"

const LOGOS = [
  "Adidas",
  "Airbnb",
  "Apple",
  "Chanel",
  "Google",
  "Gucci",
  "H&M",
  "Nike",
  "Sephora",
  "Starbucks",
  "Toyota",
]

/**
 * "Trusted by creatives at" wordmark row (11 gray placeholder wordmarks).
 */
export function LogoRow() {
  return (
    <section aria-label="Trusted by creatives at" className="py-10">
      <p className="mb-6 text-center text-sm text-gray-400">
        Trusted by creatives at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
        {LOGOS.map((logo) => (
          <span
            key={logo}
            className="cursor-default text-lg font-bold text-gray-400 transition-colors hover:text-gray-600"
          >
            {logo}
          </span>
        ))}
      </div>
    </section>
  )
}
