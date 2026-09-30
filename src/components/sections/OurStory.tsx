import { CheckCircle2 } from 'lucide-react';

const milestones = [
  "Noticed a gap in how hackathons were being organized globally.",
  "Built the first MVP to streamline team formation.",
  "Scaled to over 10,000 active builders in the first year.",
  "Expanded to support enterprise hackathons and mentorship matching."
];

export function OurStory() {
  return (
    <section className="py-5 bg-secondary/10 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          {/* Left Text Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
              How It All <span className="text-primary">Began</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Nerds Room started from a simple frustration: hackathons are incredible learning experiences, but organizing them—or even finding the right team—was historically painful.
              </p>
              <p>
                Our founders, being avid hackathon participants themselves, decided to build a platform that strips away the administrative friction. We wanted a place where builders could focus entirely on what they do best: <strong className="text-foreground">Building.</strong>
              </p>
            </div>
          </div>

          {/* Right Timeline/Milestones */}
          <div className="bg-background border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
            
            <h3 className="text-2xl font-bold text-foreground mb-8 relative z-10">Our Journey</h3>
            
            <div className="space-y-6 relative z-10">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-foreground/90 leading-relaxed font-medium">
                    {milestone}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
