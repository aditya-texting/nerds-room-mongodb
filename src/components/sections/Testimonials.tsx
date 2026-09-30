import * as React from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Amit Verma",
    role: "Android Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    text: <>Nerds Room introduced me to open-source tech communities. Their guidance helped me advance my career, and I'm grateful for the opportunities Nerds Room provided. <strong>I'm now excited to share my own experiences as a speaker!</strong></>
  },
  {
    id: 2,
    name: "Karan Mehta",
    role: "Project Coordinator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
    text: <>Being part of Nerds Room was transformative for me. It was more than a community; it was where I found my voice and my people. Nerds Room was my safe space to share ideas and learn without fear. <strong>I'll never forget speaking at the hackathon event.</strong> I was terrified, but they believed in me and gave me the courage to step into the spotlight. <strong>The connections I made built a reliable support system.</strong> The conversations, brainstorming, and sense of belonging helped me grow.</>
  },
  {
    id: 3,
    name: "Rohan Sharma",
    role: "Full Stack Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
    text: <>In college, I faced many distractions that could have led me astray. <strong>In my second year, joining the Nerds Room community was a turning point.</strong></>
  },
  {
    id: 4,
    name: "Simran Kaur",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simran",
    text: <>Nerds Room is my happy place. When I joined this community 2 years ago, I had no experience in proper communication. The team, especially the organizers, were so helpful and always encouraged me. <strong>Thanks to Nerds Room, I've improved my analytical thinking and task management skills and landed great opportunities.</strong></>
  },
  {
    id: 5,
    name: "Priya Singh",
    role: "UX Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    text: <>I had the privilege of meeting amazing designers at Nerds Room events. I learned the fundamentals of design from their workshops. As distinguished speakers at the events, they left an indelible mark on me. <strong>I am grateful to Nerds Room for providing me with this opportunity to connect with great designers,</strong> which has accelerated my career growth and development.</>
  },
  {
    id: 6,
    name: "Neha Patel",
    role: "Associate Project Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
    text: <>Their guidance helped me advance my career, and I'm grateful for the opportunities Nerds Room provided. <strong>The sessions and hands-on workshops inspired me to contribute to open source, and collaborations sparked new friendships.</strong></>
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-[44px] font-black text-slate-900 tracking-tight">
            Success Stories that Define Our Community
          </h2>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <TestimonialCard testimonial={testimonials[0]} />
            <TestimonialCard testimonial={testimonials[3]} />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <TestimonialCard testimonial={testimonials[1]} />
            <TestimonialCard testimonial={testimonials[4]} />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <TestimonialCard testimonial={testimonials[2]} />
            <TestimonialCard testimonial={testimonials[5]} />
          </div>

        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
      <p className="text-slate-600 text-[15px] leading-relaxed mb-8">
        {testimonial.text}
      </p>
      
      <div className="flex items-center gap-4 mt-auto">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-[15px]">{testimonial.name}</h4>
          <p className="text-xs text-slate-500 font-medium">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
