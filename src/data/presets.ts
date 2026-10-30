import { v4 as uuid } from 'uuid';
import type { CelebrationEvent } from '../types';

/**
 * Pre-built event templates that showcase the planner's capabilities.
 * Each template includes authentic, domain-specific budget items, timelines, vendors, and checklists.
 */
export function getEventPresets(): CelebrationEvent[] {
  return [
    createWeddingPreset(),
    createBirthdayPreset(),
    createCommunityPreset(),
  ];
}

function createWeddingPreset(): CelebrationEvent {
  return {
    id: uuid(),
    name: 'Grand Royal Wedding',
    type: 'wedding',
    date: '2027-02-14',
    guestCount: 250,
    totalBudget: 2500000,
    description: 'An elegant multi-ceremony wedding celebration featuring a Mehndi night, Sangeet, and a grand reception with 250 guests.',
    location: 'The Grand Palace Banquet Hall, Mumbai',
    createdAt: new Date().toISOString(),
    budgetItems: [
      { id: uuid(), category: 'venue', name: 'Grand Banquet Hall Rental (3 days)', estimated: 600000, actual: 580000, paid: 300000, notes: 'Includes setup & teardown' },
      { id: uuid(), category: 'catering', name: 'Multi-cuisine Buffet (250 pax)', estimated: 500000, actual: 520000, paid: 200000, notes: 'Veg & Non-veg options, 5-course' },
      { id: uuid(), category: 'decor', name: 'Floral Mandap & Stage Decor', estimated: 350000, actual: 340000, paid: 170000, notes: 'Fresh roses, marigolds, drapes' },
      { id: uuid(), category: 'entertainment', name: 'Live Band + DJ + Sangeet Choreography', estimated: 200000, actual: 200000, paid: 100000, notes: '4-hour set + sangeet performance' },
      { id: uuid(), category: 'photography', name: 'Premium Photo & Cinematic Video', estimated: 250000, actual: 260000, paid: 130000, notes: '2 photographers, 1 cinematic, drone' },
      { id: uuid(), category: 'attire', name: 'Bridal Lehenga + Groom Sherwani', estimated: 200000, actual: 180000, paid: 180000, notes: 'Designer collection' },
      { id: uuid(), category: 'logistics', name: 'Guest Transport & Accommodation', estimated: 100000, actual: 90000, paid: 50000, notes: 'Hotel blocks + shuttle service' },
      { id: uuid(), category: 'stationery', name: 'Digital + Physical Invites', estimated: 50000, actual: 45000, paid: 45000, notes: 'Letterpress + e-invite portal' },
      { id: uuid(), category: 'contingency', name: 'Emergency Reserve', estimated: 250000, actual: 0, paid: 0, notes: '10% contingency buffer' },
    ],
    timeline: [
      { id: uuid(), phase: 'pre-event', title: 'Book Venue & Caterer', description: 'Finalize venue contract and catering menu tasting.', date: '2026-08-14', dueLabel: '6 months out', assignee: 'Bride & Groom', completed: true, priority: 'critical' },
      { id: uuid(), phase: 'pre-event', title: 'Hire Photographer & Videographer', description: 'Review portfolios and sign contract.', date: '2026-09-14', dueLabel: '5 months out', assignee: 'Bride', completed: true, priority: 'high' },
      { id: uuid(), phase: 'pre-event', title: 'Send Invitations', description: 'Dispatch physical invites and share e-invite link.', date: '2026-12-14', dueLabel: '2 months out', assignee: 'Wedding Planner', completed: false, priority: 'high' },
      { id: uuid(), phase: 'pre-event', title: 'Final Dress Fitting', description: 'Last alterations for bridal lehenga and groom sherwani.', date: '2027-01-28', dueLabel: '2 weeks out', assignee: 'Bride & Groom', completed: false, priority: 'medium' },
      { id: uuid(), phase: 'pre-event', title: 'Rehearsal Dinner', description: 'Full run-through with wedding party at the venue.', date: '2027-02-12', dueLabel: '2 days before', assignee: 'Wedding Planner', completed: false, priority: 'high' },
      { id: uuid(), phase: 'day-of', title: 'Mehndi Setup & Artist Arrival', description: 'Mehndi artists arrive and begin setting up stations.', date: '08:00', dueLabel: '8:00 AM', assignee: 'Mehndi Coordinator', completed: false, priority: 'high' },
      { id: uuid(), phase: 'day-of', title: 'Baraat Procession', description: 'Groom arrives with Baraat procession at main gate.', date: '16:00', dueLabel: '4:00 PM', assignee: 'Groom Party', completed: false, priority: 'critical' },
      { id: uuid(), phase: 'day-of', title: 'Wedding Ceremony', description: 'Phera ceremony under the mandap.', date: '17:30', dueLabel: '5:30 PM', assignee: 'Pandit / Officiant', completed: false, priority: 'critical' },
      { id: uuid(), phase: 'day-of', title: 'Reception & Dinner', description: 'Grand reception with cocktails, dinner, and toasts.', date: '20:00', dueLabel: '8:00 PM', assignee: 'MC / Host', completed: false, priority: 'high' },
      { id: uuid(), phase: 'day-of', title: 'Vidaai & Farewell', description: 'Emotional farewell ceremony and departure.', date: '23:00', dueLabel: '11:00 PM', assignee: 'Family', completed: false, priority: 'medium' },
    ],
    vendors: [
      { id: uuid(), name: 'The Grand Palace Banquets', category: 'venue', status: 'contracted', contactName: 'Rajesh Kumar', contactEmail: 'info@grandpalace.com', contactPhone: '+91 98765 43210', quote: 600000, notes: 'Premium hall with outdoor garden', rating: 5 },
      { id: uuid(), name: 'Royal Feast Caterers', category: 'catering', status: 'contracted', contactName: 'Priya Sharma', contactEmail: 'royalfeast@email.com', contactPhone: '+91 98765 43211', quote: 500000, notes: 'Menu tasting done, excellent', rating: 4 },
      { id: uuid(), name: 'Bloom & Petal Decor', category: 'decor', status: 'quoted', contactName: 'Anita Verma', contactEmail: 'bloom@email.com', contactPhone: '+91 98765 43212', quote: 350000, notes: 'Specializes in mandap decor', rating: 5 },
      { id: uuid(), name: 'CineWed Studios', category: 'photography', status: 'deposit_paid', contactName: 'Arjun Mehta', contactEmail: 'cinewed@email.com', contactPhone: '+91 98765 43213', quote: 250000, notes: 'Award-winning cinematography', rating: 5 },
    ],
    checklist: [
      { id: uuid(), text: 'Finalize guest list and seating chart', completed: false, category: 'Planning', priority: 'high' },
      { id: uuid(), text: 'Book mehendi artist', completed: true, category: 'Vendors', priority: 'medium' },
      { id: uuid(), text: 'Order wedding cake', completed: false, category: 'Catering', priority: 'medium' },
      { id: uuid(), text: 'Arrange flower garlands (varmala)', completed: false, category: 'Decor', priority: 'high' },
      { id: uuid(), text: 'Confirm DJ playlist and timeline', completed: false, category: 'Entertainment', priority: 'low' },
      { id: uuid(), text: 'Setup photo booth props', completed: false, category: 'Photography', priority: 'low' },
      { id: uuid(), text: 'Prepare emergency kit (sewing, first aid)', completed: false, category: 'Logistics', priority: 'medium' },
    ],
    themes: [],
    invitations: [],
    activities: [],
  };
}

function createBirthdayPreset(): CelebrationEvent {
  return {
    id: uuid(),
    name: 'Neon Retro 30th Birthday Bash',
    type: 'birthday',
    date: '2027-03-15',
    guestCount: 60,
    totalBudget: 150000,
    description: 'A vibrant 80s/90s neon retro themed milestone birthday party with arcade games, glow-in-the-dark decor, and a DJ set.',
    location: 'SkyLounge Rooftop, Bangalore',
    createdAt: new Date().toISOString(),
    budgetItems: [
      { id: uuid(), category: 'venue', name: 'SkyLounge Rooftop (Evening)', estimated: 40000, actual: 38000, paid: 20000, notes: 'Includes bar access and AV setup' },
      { id: uuid(), category: 'catering', name: 'Cocktail Buffet + Cake', estimated: 35000, actual: 36000, paid: 15000, notes: 'Finger food, custom neon cake' },
      { id: uuid(), category: 'decor', name: 'Neon Lights & UV Decor', estimated: 20000, actual: 18000, paid: 18000, notes: 'LED strips, glow paint, neon signs' },
      { id: uuid(), category: 'entertainment', name: 'DJ + Arcade Game Rentals', estimated: 25000, actual: 25000, paid: 12000, notes: 'Retro arcade machines + DJ set' },
      { id: uuid(), category: 'photography', name: 'Photo Booth + Photographer', estimated: 15000, actual: 14000, paid: 7000, notes: 'Instant prints + digital gallery' },
      { id: uuid(), category: 'contingency', name: 'Buffer', estimated: 15000, actual: 0, paid: 0, notes: '10% contingency' },
    ],
    timeline: [
      { id: uuid(), phase: 'pre-event', title: 'Book Venue', description: 'Reserve SkyLounge and negotiate package.', date: '2027-01-15', dueLabel: '2 months out', assignee: 'Host', completed: true, priority: 'critical' },
      { id: uuid(), phase: 'pre-event', title: 'Order Neon Decor', description: 'Custom neon "Dirty Thirty" sign and UV balloons.', date: '2027-02-15', dueLabel: '1 month out', assignee: 'Host', completed: false, priority: 'high' },
      { id: uuid(), phase: 'pre-event', title: 'Send E-Invites', description: 'Digital retro-themed invitations via WhatsApp/email.', date: '2027-02-20', dueLabel: '3 weeks out', assignee: 'Host', completed: false, priority: 'high' },
      { id: uuid(), phase: 'day-of', title: 'Venue Setup & Decor', description: 'Install neon lights, arcade machines, and photo booth.', date: '14:00', dueLabel: '2:00 PM', assignee: 'Decor Team', completed: false, priority: 'critical' },
      { id: uuid(), phase: 'day-of', title: 'Guest Arrival & Cocktails', description: 'Welcome drinks and retro photo ops.', date: '19:00', dueLabel: '7:00 PM', assignee: 'Host', completed: false, priority: 'high' },
      { id: uuid(), phase: 'day-of', title: 'Birthday Toast & Cake Cutting', description: 'Speech, toast, and neon cake cutting ceremony.', date: '21:00', dueLabel: '9:00 PM', assignee: 'Best Friend / MC', completed: false, priority: 'critical' },
      { id: uuid(), phase: 'day-of', title: 'Dance Floor & DJ Set', description: 'High-energy retro music and dancing.', date: '21:30', dueLabel: '9:30 PM', assignee: 'DJ', completed: false, priority: 'high' },
    ],
    vendors: [
      { id: uuid(), name: 'SkyLounge Rooftop', category: 'venue', status: 'contracted', contactName: 'Vikram', contactEmail: 'book@skylounge.in', contactPhone: '+91 99887 76655', quote: 40000, notes: 'Rooftop with city view', rating: 4 },
      { id: uuid(), name: 'DJ NeoBeat', category: 'entertainment', status: 'quoted', contactName: 'Rahul DJ', contactEmail: 'dj@neobeat.com', contactPhone: '+91 99887 76656', quote: 15000, notes: 'Specializes in retro sets', rating: 5 },
    ],
    checklist: [
      { id: uuid(), text: 'Create Spotify retro playlist backup', completed: false, category: 'Entertainment', priority: 'low' },
      { id: uuid(), text: 'Order glow sticks and neon accessories', completed: true, category: 'Decor', priority: 'medium' },
      { id: uuid(), text: 'Confirm guest RSVPs', completed: false, category: 'Planning', priority: 'high' },
      { id: uuid(), text: 'Arrange designated driver / cab service', completed: false, category: 'Logistics', priority: 'high' },
    ],
    themes: [],
    invitations: [],
    activities: [],
  };
}

function createCommunityPreset(): CelebrationEvent {
  return {
    id: uuid(),
    name: 'Community Food & Arts Festival',
    type: 'community',
    date: '2027-04-20',
    guestCount: 500,
    totalBudget: 800000,
    description: 'A two-day community festival celebrating local artisans, food vendors, live performances, and cultural workshops.',
    location: 'Central Park Open Grounds, Hyderabad',
    createdAt: new Date().toISOString(),
    budgetItems: [
      { id: uuid(), category: 'venue', name: 'Central Park Ground Permit & Tents', estimated: 200000, actual: 195000, paid: 100000, notes: 'Includes 4 large tents & stage' },
      { id: uuid(), category: 'catering', name: 'Food Stall Infrastructure', estimated: 100000, actual: 95000, paid: 50000, notes: 'Stall kits, serving supplies, waste mgmt' },
      { id: uuid(), category: 'entertainment', name: 'Stage, Sound & Light Rig', estimated: 150000, actual: 155000, paid: 80000, notes: 'Full stage with PA system, LED walls' },
      { id: uuid(), category: 'logistics', name: 'Permits, Safety & Volunteers', estimated: 120000, actual: 110000, paid: 60000, notes: 'Police NOC, fire safety, medical team' },
      { id: uuid(), category: 'decor', name: 'Banners, Signage & Art Installations', estimated: 80000, actual: 75000, paid: 40000, notes: 'Entry arch, wayfinding, art walls' },
      { id: uuid(), category: 'stationery', name: 'Digital Marketing & Ticketing', estimated: 50000, actual: 50000, paid: 50000, notes: 'Social media ads, ticket platform' },
      { id: uuid(), category: 'contingency', name: 'Emergency & Weather Reserve', estimated: 100000, actual: 0, paid: 0, notes: 'Rain covers, backup generator' },
    ],
    timeline: [
      { id: uuid(), phase: 'pre-event', title: 'Secure Venue Permit', description: 'Apply for municipal permit and police NOC.', date: '2027-01-20', dueLabel: '3 months out', assignee: 'Event Director', completed: true, priority: 'critical' },
      { id: uuid(), phase: 'pre-event', title: 'Recruit Vendors & Artisans', description: 'Open applications and curate vendor lineup.', date: '2027-02-20', dueLabel: '2 months out', assignee: 'Vendor Manager', completed: false, priority: 'high' },
      { id: uuid(), phase: 'pre-event', title: 'Volunteer Registration', description: 'Recruit and train 50 community volunteers.', date: '2027-03-20', dueLabel: '1 month out', assignee: 'Volunteer Coordinator', completed: false, priority: 'high' },
      { id: uuid(), phase: 'pre-event', title: 'Safety Inspection', description: 'Fire marshal and health inspector walkthrough.', date: '2027-04-15', dueLabel: '5 days before', assignee: 'Safety Officer', completed: false, priority: 'critical' },
      { id: uuid(), phase: 'day-of', title: 'Ground Setup & Vendor Load-In', description: 'All tents, stalls, and stage assembled.', date: '06:00', dueLabel: '6:00 AM', assignee: 'Setup Crew', completed: false, priority: 'critical' },
      { id: uuid(), phase: 'day-of', title: 'Gates Open', description: 'Welcome attendees, begin ticketing.', date: '10:00', dueLabel: '10:00 AM', assignee: 'Gate Volunteers', completed: false, priority: 'high' },
      { id: uuid(), phase: 'day-of', title: 'Main Stage Performances', description: 'Local bands, dance troupes, cultural acts.', date: '14:00', dueLabel: '2:00 PM', assignee: 'Stage Manager', completed: false, priority: 'high' },
      { id: uuid(), phase: 'day-of', title: 'Community Award Ceremony', description: 'Honor local heroes and artisans.', date: '18:00', dueLabel: '6:00 PM', assignee: 'MC / Organizer', completed: false, priority: 'medium' },
    ],
    vendors: [
      { id: uuid(), name: 'Central Park Authority', category: 'venue', status: 'contracted', contactName: 'Municipal Office', contactEmail: 'parks@hyderabad.gov', contactPhone: '+91 40 2345 6789', quote: 200000, notes: 'Permit approved for 2 days', rating: 4 },
      { id: uuid(), name: 'SoundWave Productions', category: 'entertainment', status: 'deposit_paid', contactName: 'Kiran Reddy', contactEmail: 'kiran@soundwave.in', contactPhone: '+91 99001 22334', quote: 150000, notes: 'Full PA, LED wall, lighting rig', rating: 5 },
    ],
    checklist: [
      { id: uuid(), text: 'Confirm fire safety equipment placement', completed: false, category: 'Safety', priority: 'high' },
      { id: uuid(), text: 'Setup first-aid station', completed: false, category: 'Safety', priority: 'high' },
      { id: uuid(), text: 'Print volunteer ID badges', completed: false, category: 'Logistics', priority: 'medium' },
      { id: uuid(), text: 'Arrange waste bins and recycling stations', completed: false, category: 'Logistics', priority: 'medium' },
      { id: uuid(), text: 'Test microphones and speakers', completed: false, category: 'Entertainment', priority: 'high' },
      { id: uuid(), text: 'Confirm parking arrangements', completed: false, category: 'Logistics', priority: 'low' },
    ],
    themes: [],
    invitations: [],
    activities: [],
  };
}
