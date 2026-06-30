// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OUR STORY SECTION — Ministry history & journey
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import SectionHeading from "@/components/ui/SectionHeading";

export default function OurStorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-14">
          <SectionHeading
            badge="Our Story"
            title={
              <>
                A Family Born from{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Divine Encounter
                </span>
              </>
            }
            subtitle="The Triumphant Family is not just a church. It is a family — a movement of believers raised to demonstrate the supernatural power of God."
            withDivider
          />
        </div>

        {/* Story content */}
        <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed text-base md:text-lg">

          <p>
            The Triumphant Family — The Gleam of Salvation Apostolic Ministry — was
            birthed out of a divine mandate placed upon{" "}
            <strong className="text-brand-purple-800">Prophet Olayiwole Ogunsola</strong>{" "}
            to gather God&rsquo;s people into a family of prayer, prophetic worship, and
            unshakeable faith.
          </p>

          <p>
            What began as small intercessory gatherings has grown into a thriving
            ministry impacting lives across Nigeria and beyond. Today, our prayer
            services, conferences, and online broadcasts reach thousands of believers
            hungry for an authentic encounter with God.
          </p>

          <p>
            We believe that <strong className="text-brand-purple-800">prayer changes things</strong>,
            that the <strong className="text-brand-purple-800">Word of God transforms lives</strong>,
            and that the <strong className="text-brand-purple-800">Holy Spirit still moves with power</strong>{" "}
            today — just as in the days of the apostles. Our services are charged with
            faith, anointing, and the manifest presence of God.
          </p>

          <p>
            Whether you join us in person at our auditorium in Akute, Ogun State, or
            stream our services online from any part of the world, you are welcome
            here. You are not just a guest — you are family.
          </p>

          {/* Highlight quote */}
          <div className="relative my-12 py-8 px-6 md:px-10 border-l-4 border-brand-gold-400 bg-gradient-to-r from-brand-purple-50 to-transparent rounded-r-2xl">
            <svg className="absolute top-4 left-4 w-8 h-8 text-brand-gold-400/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <p className="text-xl md:text-2xl font-heading italic text-brand-purple-900 leading-relaxed">
              You were not created to be defeated. You were created to triumph!
            </p>
            <p className="text-sm text-gray-500 mt-3 font-semibold">
              — Prophet Olayiwole Ogunsola
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}