import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Weather by Abbas, a weather information platform providing forecasts, alerts and updates across Asia.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="font-display text-3xl font-bold text-storm-900 sm:text-4xl">
          About Weather by Abbas
        </h1>

        <div className="mt-6 space-y-5 text-base leading-7 text-slate-700">
          <p>
            Weather by Abbas is a weather information platform providing
            forecasts, weather alerts and updates across Asia, with a special
            focus on South Asia and the Middle East.
          </p>

          <p>
            Our coverage includes India, Pakistan, Afghanistan, Iran and
            Jammu &amp; Kashmir, along with other parts of Asia when significant
            weather conditions develop.
          </p>

          <p>
            We provide updates on rainfall, thunderstorms, heavy showers,
            temperature changes and other important weather conditions in a
            simple and easy-to-understand format.
          </p>

          <p>
            Our aim is to keep people informed about changing weather and help
            them stay prepared for significant weather conditions.
          </p>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="font-display text-2xl font-bold text-storm-900">
            Connect With Us
          </h2>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p>
              📷 Instagram:{" "}
              <span className="font-medium">@kashmir_storms</span>
            </p>

            <p>
              📧 Email:{" "}
              <a
                href="mailto:abbasahmad7120@gmail.com"
                className="font-medium text-storm-700 hover:text-amber-600"
              >
                abbasahmad7120@gmail.com
              </a>
            </p>

            <p>
              <a
                href="#"
                className="font-medium text-storm-700 hover:text-amber-600"
              >
                Follow us on Instagram
              </a>
            </p>
          </div>
        </div>

        <p className="mt-10 border-t border-slate-200 pt-6 text-sm font-medium text-slate-600">
          Weather by Abbas — Weather updates across Asia.
        </p>
      </div>
    </div>
  );
}
