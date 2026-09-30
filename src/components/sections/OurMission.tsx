import { Lightbulb, Code2, Globe2, ShieldCheck } from 'lucide-react';

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description: 'We believe in pushing the boundaries of what is possible through technology and creative problem-solving.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'group-hover:border-amber-500/50'
  },
  {
    icon: Code2,
    title: 'Builder First',
    description: 'Our platform is designed by developers for developers. Everything we do serves the builder community.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'group-hover:border-blue-500/50'
  },
  {
    icon: Globe2,
    title: 'Global Impact',
    description: 'We aim to democratize access to opportunities, connecting talent from everywhere to global challenges.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'group-hover:border-emerald-500/50'
  },
  {
    icon: ShieldCheck,
    title: 'Inclusive & Safe',
    description: 'Fostering an environment where everyone, regardless of background, can collaborate, learn, and grow safely.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'group-hover:border-purple-500/50'
  }
];

export function OurMission() {
  return (
    <section className="py-24 bg-secondary/20 bg-grid-pattern relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">
            Our Mission & Core Values
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are on a mission to build the largest, most active digital ecosystem for builders. 
            A place where your next big idea finds its team, its mentors, and its launchpad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div 
              key={idx} 
              className={`group relative p-8 rounded-3xl bg-background border border-border/50 hover:shadow-xl transition-all duration-300 ${val.border}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${val.bg}`}>
                <val.icon className={`w-7 h-7 ${val.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {val.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
