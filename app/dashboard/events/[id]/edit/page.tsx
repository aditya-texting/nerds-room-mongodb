"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Trash2, Calendar, FileText, CheckCircle, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useEvent, useUpdateEvent } from "@/src/modules/events/hooks/useEvents";
import TiptapEditor from "@/src/components/ui/TiptapEditor";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const { data: eventResponse, isLoading: isFetching } = useEvent(eventId);
  const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateEvent();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImageUrl: "",
    startDate: "",
    endDate: "",
    locationType: "ONLINE",
    locationAddress: "",
    locationUrl: "",
    participationType: "INDIVIDUAL",
    minTeamSize: 1,
    maxTeamSize: 1,
    status: "DRAFT",
    isFeatured: false,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const [timeline, setTimeline] = useState<any[]>([]);
  const [formFields, setFormFields] = useState<any[]>([]);

  const [uploadingImage, setUploadingImage] = useState(false);

  // Pre-populate data when fetched
  useEffect(() => {
    if (eventResponse?.data) {
      const event = eventResponse.data;
      
      const formatToDateTimeLocal = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      };

      setFormData({
        name: event.name || "",
        description: event.description || "",
        coverImageUrl: event.coverImageUrl || "",
        startDate: formatToDateTimeLocal(event.startDate),
        endDate: formatToDateTimeLocal(event.endDate),
        locationType: event.locationType || "ONLINE",
        locationAddress: event.locationAddress || "",
        locationUrl: event.locationUrl || "",
        participationType: event.participationType || "INDIVIDUAL",
        minTeamSize: event.minTeamSize || 1,
        maxTeamSize: event.maxTeamSize || 1,
        status: event.status || "DRAFT",
        isFeatured: Boolean(event.isFeatured),
      });

      setTags(event.tags || []);
      
      setTimeline(event.eventTimeline ? event.eventTimeline.map((t: any) => ({
        ...t,
        startTime: formatToDateTimeLocal(t.startTime)
      })) : []);

      setFormFields(event.formFields ? event.formFields.map((f: any) => ({
        ...f,
        options: f.options ? f.options.join(", ") : ""
      })) : []);
    }
  }, [eventResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | boolean = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');
      
      setFormData(prev => ({ ...prev, coverImageUrl: data.url }));
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDescriptionChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  // Tags Handlers
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Timeline Handlers
  const addTimelineEvent = () => {
    setTimeline([...timeline, { title: "", description: "", startTime: "" }]);
  };

  const updateTimelineEvent = (index: number, field: string, value: string) => {
    const newTimeline = [...timeline];
    newTimeline[index][field] = value;
    setTimeline(newTimeline);
  };

  const removeTimelineEvent = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  // Form Field Handlers
  const addFormField = () => {
    setFormFields([...formFields, { fieldName: "", fieldType: "TEXT", isRequired: false, options: "" }]);
  };

  const updateFormField = (index: number, field: string, value: string | boolean) => {
    const newFields = [...formFields];
    newFields[index][field] = value;
    setFormFields(newFields);
  };

  const removeFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || formData.description === "<p><br></p>") {
      toast.error("Please enter a description");
      return;
    }

    try {
      const payload = {
        ...formData,
        tags,
        timeline,
        formFields: formFields.map((f) => ({
          ...f,
          options: f.options ? f.options.split(",").map((o: string) => o.trim()).filter(Boolean) : [],
        })),
      };

      await updateEvent({ id: eventId, data: payload });
      toast.success("Event updated successfully!");
      router.push("/dashboard/events");
    } catch (error: any) {
      toast.error(error.message || "Failed to update event");
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Basic Information */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Event Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="Awesome Hackathon 2026" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      disabled={uploadingImage}
                      className="w-full pl-10 p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                    />
                  </div>
                  {uploadingImage && <span className="text-sm text-muted-foreground animate-pulse">Uploading...</span>}
                </div>
                {formData.coverImageUrl && (
                  <div className="relative w-full md:w-1/2 h-40 rounded-xl overflow-hidden border border-border mt-2">
                    <img src={formData.coverImageUrl} alt="Cover Preview" className="object-cover w-full h-full" />
                    <button type="button" onClick={() => setFormData(p => ({ ...p, coverImageUrl: '' }))} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <TiptapEditor 
                value={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none transition">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="p-2 flex flex-wrap gap-2 items-center rounded-lg bg-background border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition min-h-[50px]">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 rounded-full focus:outline-none">
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-sm p-1"
                  placeholder="Type tag and press Enter..."
                />
              </div>
            </div>
            <div className="flex items-center gap-3 md:col-span-2 mt-2">
              <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded text-primary focus:ring-primary bg-background border-border" />
              <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">Featured Event (Shows at top)</label>
            </div>
          </div>
        </section>

        {/* Dates & Location */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Dates & Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event Start Date</label>
              <input required type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Event End Date</label>
              <input required type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border outline-none transition" />
            </div>
            
            <div className="md:col-span-2 border-t border-border my-2 pt-6" />

            <div>
              <label className="block text-sm font-medium mb-2">Location Type</label>
              <select name="locationType" value={formData.locationType} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border outline-none transition">
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location URL (for Online/Hybrid)</label>
              <input type="url" name="locationUrl" value={formData.locationUrl} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border outline-none transition" placeholder="https://zoom.us/..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Location Address (for Offline/Hybrid)</label>
              <textarea name="locationAddress" value={formData.locationAddress} onChange={handleChange} rows={2} className="w-full p-3 rounded-lg bg-background border border-border outline-none transition" placeholder="123 Main St, City, Country" />
            </div>
          </div>
        </section>

        {/* Participation Rules */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" /> Participation Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={formData.participationType === "INDIVIDUAL" ? "md:col-span-3" : ""}>
              <label className="block text-sm font-medium mb-2">Participation Type</label>
              <select name="participationType" value={formData.participationType} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border outline-none transition">
                <option value="INDIVIDUAL">Individual Only</option>
                <option value="TEAM">Team Only</option>
                <option value="BOTH">Individual & Team</option>
              </select>
            </div>
            {formData.participationType !== "INDIVIDUAL" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Min Team Size</label>
                  <input type="number" min="1" required name="minTeamSize" value={formData.minTeamSize} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Team Size</label>
                  <input type="number" min="1" required name="maxTeamSize" value={formData.maxTeamSize} onChange={handleChange} className="w-full p-3 rounded-lg bg-background border border-border outline-none transition" />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Timeline Builder */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Event Timeline
            </h2>
            <button type="button" onClick={addTimelineEvent} className="text-sm flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition">
              <Plus className="w-4 h-4" /> Add Phase
            </button>
          </div>
          <div className="space-y-4">
            {timeline.length === 0 && <p className="text-muted-foreground text-sm">No timeline events added yet.</p>}
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 border border-border rounded-lg bg-background relative group">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Phase Title</label>
                    <input required value={item.title} onChange={(e) => updateTimelineEvent(index, "title", e.target.value)} className="w-full p-2 rounded-md bg-card border border-border text-sm" placeholder="e.g. Ideation Phase" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Date & Time</label>
                    <input required type="datetime-local" value={item.startTime} onChange={(e) => updateTimelineEvent(index, "startTime", e.target.value)} className="w-full p-2 rounded-md bg-card border border-border text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1">Description (Optional)</label>
                    <input value={item.description} onChange={(e) => updateTimelineEvent(index, "description", e.target.value)} className="w-full p-2 rounded-md bg-card border border-border text-sm" placeholder="Short description..." />
                  </div>
                </div>
                <button type="button" onClick={() => removeTimelineEvent(index)} className="text-red-500 hover:text-red-600 p-2">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Registration Form Builder */}
        <section className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Registration Form Builder
            </h2>
            <button type="button" onClick={addFormField} className="text-sm flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition">
              <Plus className="w-4 h-4" /> Add Custom Field
            </button>
          </div>
          
          <div className="mb-6 space-y-2">
            <p className="text-sm text-foreground font-medium">Default Required Fields (Always Collected):</p>
            <div className="flex flex-wrap gap-2">
              {['Name', 'Email', 'Phone Number'].map(field => (
                <span key={field} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg border border-border">
                  {field}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">These fields are permanently baked into the registration form. Add any extra custom fields you need below.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            {formFields.length === 0 && <p className="text-muted-foreground text-sm">No custom fields added yet.</p>}
            {formFields.map((field, index) => (
              <div key={index} className="flex gap-4 p-4 border border-border rounded-lg bg-background relative group">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium mb-1">Field Label / Question</label>
                    <input required value={field.fieldName} onChange={(e) => updateFormField(index, "fieldName", e.target.value)} className="w-full p-2 rounded-md bg-card border border-border text-sm" placeholder="e.g. T-Shirt Size" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium mb-1">Field Type</label>
                    <select value={field.fieldType} onChange={(e) => updateFormField(index, "fieldType", e.target.value)} className="w-full p-2 rounded-md bg-card border border-border text-sm">
                      <option value="TEXT">Short Text</option>
                      <option value="TEXTAREA">Long Text</option>
                      <option value="EMAIL">Email</option>
                      <option value="NUMBER">Number</option>
                      <option value="SELECT">Dropdown</option>
                      <option value="RADIO">Radio Choices</option>
                      <option value="LINKEDIN">LinkedIn</option>
                      <option value="GITHUB">GitHub</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={field.isRequired} onChange={(e) => updateFormField(index, "isRequired", e.target.checked)} className="w-4 h-4 text-primary bg-card border-border rounded" />
                      <span className="text-xs font-medium">Required?</span>
                    </label>
                  </div>
                  {(field.fieldType === "SELECT" || field.fieldType === "RADIO" || field.fieldType === "CHECKBOX") && (
                    <div className="md:col-span-12 mt-2">
                      <label className="block text-xs font-medium mb-1">Options (Comma separated)</label>
                      <input required value={field.options} onChange={(e) => updateFormField(index, "options", e.target.value)} className="w-full p-2 rounded-md bg-card border border-border text-sm" placeholder="Small, Medium, Large" />
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => removeFormField(index)} className="text-red-500 hover:text-red-600 p-2">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <button type="submit" disabled={isUpdating} className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition shadow-lg disabled:opacity-50 flex items-center gap-2">
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
