"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEvents, useDeleteEvent } from '@/src/modules/events/hooks/useEvents';
import { useAuthContext } from '@/src/providers/auth-provider';
import { Plus, Search, Calendar, MapPin, Edit, Trash2, Filter, Users, Eye, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardEventsPage() {
  const { user } = useAuthContext();
  
  // States
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  
  // Delete Modal State
  const [eventToDelete, setEventToDelete] = useState<{ id: string, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch events
  const { data: response, isLoading, refetch } = useEvents({
    page,
    limit: 9,
    search: debouncedSearch,
    status: statusFilter,
    locationType: locationFilter,
    isFeatured: featuredFilter,
  });

  const { mutateAsync: deleteEvent } = useDeleteEvent();

  const events = response?.data || [];
  const meta = response?.meta || {};

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
    refetch();
  };

  const handleDeleteClick = (id: string, name: string) => {
    setEventToDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await deleteEvent(eventToDelete.id);
      toast.success('Event deleted');
      setEventToDelete(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track all events on the platform.</p>
        </div>
        <Link
          href="/dashboard/events/create"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-card p-4 rounded-xl border border-border flex flex-col md:flex-row flex-wrap gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border focus:border-primary outline-none transition"
          />
        </form>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="p-2.5 rounded-lg bg-background border border-border focus:border-primary outline-none transition text-sm"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <select
            value={locationFilter}
            onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
            className="p-2.5 rounded-lg bg-background border border-border focus:border-primary outline-none transition text-sm"
          >
            <option value="">Any Location Type</option>
            <option value="ONLINE">Online Event</option>
            <option value="OFFLINE">Offline Event</option>
            <option value="HYBRID">Hybrid Event</option>
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
            className="p-2.5 rounded-lg bg-background border border-border focus:border-primary outline-none transition text-sm"
          >
            <option value="">Any Featured Status</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-card rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No events found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or create a new event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <div key={event.id} className="bg-card rounded-xl border border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors group relative">
              
              {/* Cover Image */}
              {event.coverImageUrl ? (
                <div className="h-40 w-full relative overflow-hidden bg-muted">
                  <img 
                    src={event.coverImageUrl} 
                    alt={event.name} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Image+Not+Found';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {event.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1.5 rounded-full shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-20 w-full bg-gradient-to-r from-primary/20 to-primary/5 relative">
                   {event.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1.5 rounded-full shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    event.dynamicStatus === 'LIVE' ? 'bg-emerald-500/10 text-emerald-600' :
                    event.dynamicStatus === 'UPCOMING' ? 'bg-blue-500/10 text-blue-600' :
                    'bg-gray-500/10 text-gray-600'
                  }`}>
                    {event.dynamicStatus}
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    event.status === 'PUBLISHED' ? 'border-emerald-500/30 text-emerald-500' : 'border-amber-500/30 text-amber-500'
                  }`}>
                    {event.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {event.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {stripHtml(event.description)}
                </p>

                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{event.locationType === 'ONLINE' ? 'Online Event' : event.locationType === 'HYBRID' ? 'Hybrid Event' : event.locationAddress || 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground pt-2 border-t border-border mt-2">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>{event._count?.eventRegistrations || 0} Registrations</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-secondary/50 px-5 py-3 border-t border-border flex justify-end gap-3 mt-auto">
                <Link href={`/events/${event.slug}`} className="p-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-background rounded border border-border shadow-sm mr-auto px-3">
                  <Eye className="w-3.5 h-3.5" />
                  View details
                </Link>

                {user?.role === 'ADMIN' && (
                  <>
                    <Link href={`/dashboard/events/${event.id}/edit`} className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-background rounded border border-border shadow-sm">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDeleteClick(event.id, event.name)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors bg-background rounded border border-border shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="text-sm font-medium">Page {page} of {meta.totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Event</h3>
            <p className="text-foreground/80 mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground font-semibold">{eventToDelete.name}</strong>? This action cannot be undone and will permanently remove all associated registrations and data.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setEventToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 font-medium rounded-lg text-foreground hover:bg-secondary border border-transparent hover:border-border transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
