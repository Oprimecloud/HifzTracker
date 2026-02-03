import { UserPlus, ClipboardCheck, LayoutDashboard } from "lucide-react";

const steps = [
  {
    name: "Create an Account",
    description: "Sign up in seconds using your email. No complex passwords needed—just a simple magic link.",
    icon: UserPlus,
  },
  {
    name: "Log Your Progress",
    description: "Enter the Surah and Ayah range you recited or memorized today. It takes less than 30 seconds.",
    icon: ClipboardCheck,
  },
  {
    name: "Visualize Your Growth",
    description: "Watch your streak grow and see your progress heatmap fill up as you stay consistent.",
    icon: LayoutDashboard,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-wide">
            Simplicity for the Ummah
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Start Your Journey in 3 Easy Steps
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.name} className="relative flex flex-col items-center text-center">
                {/* Step Number Circle */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20">
                  <step.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                
                <dt className="text-xl font-bold leading-7 text-slate-900">
                  <span className="text-emerald-600 mr-2">{index + 1}.</span>
                  {step.name}
                </dt>
                
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>

                {/* Desktop Decorative Arrow/Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[70%] w-full border-t-2 border-dashed border-emerald-100 -z-10" />
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}