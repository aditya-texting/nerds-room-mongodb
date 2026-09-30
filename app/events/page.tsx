'use client';

import * as React from 'react';
import { Search, Filter, Loader2, Star } from 'lucide-react';
import { EventCard } from '@/src/components/ui/EventCard';
import { motion, AnimatePresence } from 'framer-motion';

import { useEvents } from '@/src/modules/events/hooks/useEvents';

const CATEGORIES = ['All', 'AI', 'Web3', 'Fintech', 'Open Source', 'Security', 'Design', 'Mobile', 'AR/VR', 'Cloud', 'Data', 'IoT'];
const TYPES = ['All', 'Online', 'Offline', 'Hybrid'];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedType, setSelectedType] = React.useState('All');
  const [isFeaturedOnly, setIsFeaturedOnly] = React.useState(false);
  
  const [page, setPage] = React.useState(1);
  const [allLoadedEvents, setAllLoadedEvents] = React.useState<any[]>([]);

  const handleFilterChange = (setter: any, val: any) => {
    setter(val);
    setPage(1);
    setAllLoadedEvents([]);
  };

  // Map filters to API
  const locationType = selectedType === 'All' ? undefined : selectedType.toUpperCase();
  const search = searchQuery.trim() || undefined;
  const category = selectedCategory !== 'All' ? selectedCategory : undefined;

  const { data, isLoading, isFetching, isPlaceholderData } = useEvents({
    page,
    limit: 9,
    search,
    category,
    locationType,
    isFeatured: isFeaturedOnly ? 'true' : undefined,
  });

  React.useEffect(() => {
    if (data?.data && !isPlaceholderData) {
      if (page === 1) {
        setAllLoadedEvents(data.data);
      } else {
        setAllLoadedEvents(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(e => e.id));
          const newEvents = data.data.filter((e: any) => !existingIds.has(e.id));
          return [...prev, ...newEvents];
        });
      }
    }
  }, [data, page, isPlaceholderData]);

  const total = data?.meta?.total || 0;
  const hasMore = allLoadedEvents.length < total;

  const handleLoadMore = () => setPage(p => p + 1);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      
      {/* Header Section */}
      <div className="relative border-b border-border/50 overflow-hidden flex items-center justify-center min-h-[350px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/events-hero-bg.jpg" 
            alt="Events Background" 
            className="w-full h-full object-cover opacity-30 dark:opacity-50 pointer-events-none" 
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10 pt-28">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 drop-shadow-sm">
            Discover <span className="text-primary">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground/90 font-medium max-w-2xl mx-auto drop-shadow-sm">
            Find the best hackathons, workshops, and meetups around the world.
          </p>
        </div>
      </div>

      {/* Filters & Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Search events by name or keyword..."
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-secondary/30 border border-border/50 rounded-xl px-4 py-2 min-w-[160px]">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              className="bg-transparent w-full border-none text-sm font-medium text-foreground outline-none cursor-pointer pr-4"
              value={selectedType}
              onChange={(e) => handleFilterChange(setSelectedType, e.target.value)}
            >
              {TYPES.map(type => (
                <option key={type} value={type}>{type} Format</option>
              ))}
            </select>
          </div>

          {/* Featured Toggle */}
          <button
            onClick={() => handleFilterChange(setIsFeaturedOnly, !isFeaturedOnly)}
            className={`flex items-center gap-2 border border-border/50 rounded-xl px-4 py-2 min-w-max transition-all ${
              isFeaturedOnly 
                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50' 
                : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
            }`}
          >
            <Star className={`w-4 h-4 ${isFeaturedOnly ? 'fill-yellow-500' : ''}`} />
            <span className="text-sm font-medium">Featured Only</span>
          </button>
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(setSelectedCategory, cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                selectedCategory === cat 
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/20 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : allLoadedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {allLoadedEvents.map((event: any, idx: number) => {
                const startDate = new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const mappedType = event.locationType === 'ONLINE' ? 'Online' : event.locationType === 'OFFLINE' ? 'Offline' : 'Hybrid';
                
                return (
                  <motion.div
                    key={event.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventCard 
                      slug={event.slug}
                      title={event.name}
                      date={startDate}
                      type={mappedType}
                      location={event.locationAddress || undefined}
                      image={event.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'}
                      registrations={event._count?.eventRegistrations || 0}
                      description={event.description.replace(/<[^>]+>/g, '').substring(0, 100) + '...'}
                      tags={event.tags || []}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-secondary border border-border/60 text-foreground font-semibold hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                </>
              ) : (
                'Load More Events'
              )}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
