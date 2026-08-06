// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA HOW TO REGISTER — White gradient + white 3D icons + tight spacing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ICON_3D_STYLE = {
  color: "#ffffff",
  filter: "drop-shadow(0 2px 0 #e0e0e0) drop-shadow(0 3px 0 #cccccc) drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0 6px 15px rgba(255,255,255,0.15))",
};

const STEPS = [
  {
    number: "01",
    title: "Complete Registration",
    description: "Fill out the online registration form with your personal details, academic information, and upload your passport photograph.",
    icon: (
      <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Admin Approval",
    description: "Your registration will be reviewed by the school administrator. You'll receive confirmation once approved (usually within 24-48 hours).",
    icon: (
      <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Start Learning",
    description: "Once approved, login to your student portal, access your course materials, submit assignments, and begin your discipleship journey!",
    icon: (
      <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
];

export default function TDAHowToRegister() {
  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Simple Process
            </span>
          </div>
        </div>

        {/* Heading — WHITE gradient */}
        <div className="text-center mb-6 lg:mb-8 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            How to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
              Register
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            Getting started is easy. Follow these three simple steps to begin
            your journey with the Triumphant Disciples Academy.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-5 lg:p-6 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Big Step Number (background) */}
              <div className="absolute top-3 right-4 font-heading text-6xl font-black text-white/10 select-none pointer-events-none">
                {step.number}
              </div>

              <div className="relative z-10">
                {/* Icon — WHITE 3D no bg box */}
                <div className="mb-4 mx-auto md:mx-0 w-fit group-hover:scale-110 transition-transform duration-300" style={ICON_3D_STYLE}>
                  {step.icon}
                </div>

                {/* Step Badge — WHITE */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple-950/60 border border-white/20 mb-3">
                  <span className="text-white font-bold text-xs uppercase tracking-widest">
                    Step {step.number}
                  </span>
                </div>

                <h3 className="font-heading text-lg lg:text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-brand-purple-100 text-sm lg:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}