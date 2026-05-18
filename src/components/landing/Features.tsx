import { Card } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";

const features = [
  {
    emoji: "🎯",
    title: "Smart matching",
    description:
      "Our algorithm weighs sleep schedules, cleanliness, and social energy — not just your major.",
  },
  {
    emoji: "🏫",
    title: "Campus verified",
    description:
      "Sign up with your .edu email so you only see real students at your school.",
  },
  {
    emoji: "💬",
    title: "Chat before commit",
    description:
      "Break the ice with prompts and vibe tags before you ever sign a housing form.",
  },
  {
    emoji: "🔒",
    title: "Safe & private",
    description:
      "You control what's visible. Report anything sus — we take campus safety seriously.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
            Built for how you actually live
          </h2>
          <p className="mt-4 text-muted">
            No more awkward GroupMe threads. Find people who match your lifestyle.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center sm:text-left">
              <span className="text-3xl" role="img" aria-hidden>
                {feature.emoji}
              </span>
              <h3 className="mt-4 font-semibold text-lg">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
