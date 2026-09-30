import * as React from 'react';
import { Calendar, MapPin, Users, Eye, ArrowRight, Laptop } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  slug: string;
  title: string;
  date: string;
  type: 'Online' | 'Offline' | 'Hybrid';
  location?: string;
  image: string;
  registrations: number;
  description?: string;
  tags?: string[];
}

export function EventCard({
  slug,
  title,
  date,
  type,
  location,
  image,
  registrations,
  description,
  tags = [],
}: EventCardProps) {
  return (
    <div className="group relative flex flex-col bg-background rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay Stats */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
            <Users className="w-3 h-3" /> {registrations}
          </div>
        </div>
        {/* Type Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-md font-medium shadow-sm">
          {type === 'Online' ? <Laptop className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
          {type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
            {description}
          </p>
        )}
        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 capitalize"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary text-muted-foreground border border-border">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
          {location && type !== 'Online' && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6">
          <Link
            href={`/events/${slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-[1.02]"
          >
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
