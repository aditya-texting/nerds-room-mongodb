import { AboutHero } from '@/src/components/sections/AboutHero';
import { OurStory } from '@/src/components/sections/OurStory';
import { Testimonials } from '@/src/components/sections/Testimonials';

export const metadata = {
  title: 'About Us | Nerds Room',
  description: 'The story behind Nerds Room and our incredible platform stats.',
};

export default function AboutUsPage() {
  return (
    <main className="flex flex-col">
      <AboutHero />
      <OurStory />
      <Testimonials />
    </main>
  );
}
