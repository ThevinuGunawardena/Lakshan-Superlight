import React, { useState } from 'react';
import {
  Megaphone,
  Share2,
  MapPin,
  MessageCircle,
  Copy,
  ExternalLink,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  QrCode,
  Download
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const MarketingHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'funnel' | 'broadcast' | 'google'>('funnel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const company = StorageService.getCompanyInfo();
  const bookings = StorageService.getBookings();
  const lightWalOrders = StorageService.getLightWalOrders();
  const posTx = StorageService.getPOSTransactions();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  // WhatsApp Funnel Templates
  const [whatsappPhone, setWhatsappPhone] = useState(company.whatsapp.replace('+', ''));
  const funnelTemplates = [
    {
      id: 'lw',
      title: 'Light Wal (Fairy / Festoon Lights) Inquiry',
      subtitle: 'Festoon Pricing & Lengths',
      message: 'Hi Lakshan Superlight, I would like to inquire about purchasing / renting Light Wal festoon packages. Could you please share available lengths and pricing?'
    },
    {
      id: 'wedding',
      title: 'Grand Wedding & Stage Lighting Package',
      subtitle: 'Moving Heads & Ambient Lights',
      message: 'Hi Lakshan Superlight, I am planning an upcoming wedding reception and would like a quotation for Stage Moving Heads, Sharpy Beams, and Par Lights.'
    },
    {
      id: 'pirith',
      title: 'Religious & Ceremony Illumination',
      subtitle: 'Perimeter & Ambient Decor',
      message: 'Hi Lakshan Superlight, we need an illumination setup for an upcoming religious ceremony. Please share details on canopy lighting and outdoor setups.'
    },
    {
      id: 'concert',
      title: 'Live Musical Concert & DJ Truss Lighting',
      subtitle: 'Aluminum Trusses & Lasers',
      message: 'Hi Lakshan Superlight, need a technical quotation for 10ft Box Trusses, Sharpy 7R beams, pure diode Lasers, and DMX Haze machines.'
    }
  ];

  // Broadcast composer state
  const [broadcastSegment, setBroadcastSegment] = useState<'all' | 'events' | 'retail' | 'lightwal'>('all');
  const [broadcastText, setBroadcastText] = useState(
    'Special Offer from Lakshan Superlight! Reserve your event lighting early for upcoming weddings, corporate shows, and banquets. Premium Sharpy 7R, Waterproof Par Cans, and Custom Light Wal Festoons. Contact us today: +94 77 123 4567 | WhatsApp: +94 77 123 4567.'
  );

  const eventContacts = bookings.map(b => ({ name: b.customerName, phone: b.customerPhone, source: 'Event Booking' }));
  const lwContacts = lightWalOrders.map(o => ({ name: o.customerName, phone: o.customerPhone, source: 'Light Wal' }));
  const retailContacts = posTx.filter(p => p.customerPhone).map(p => ({ name: p.customerName || 'Retail Customer', phone: p.customerPhone || '', source: 'Retail POS' }));
  
  const allContacts = [...eventContacts, ...lwContacts, ...retailContacts].filter((v, i, a) => 
    a.findIndex(t => t.phone === v.phone) === i
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">Digital Marketing & Online Presence Hub</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Direct Facebook-to-WhatsApp inquiry links, broadcast messaging workflow, and Google Maps business profile optimization
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'funnel' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Facebook-to-WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'broadcast' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Broadcast Workflow</span>
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'google' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Business</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Facebook-to-WhatsApp Lead Funnel */}
      {activeTab === 'funnel' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Direct Facebook-to-WhatsApp Funnel Links</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-configured click-to-chat links for Facebook ads, page buttons, and promotional campaigns
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">WhatsApp Number:</span>
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white font-mono w-32"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {funnelTemplates.map((tpl) => {
                const encodedMsg = encodeURIComponent(tpl.message);
                const fullUrl = `https://wa.me/${whatsappPhone}?text=${encodedMsg}`;
                const isCopied = copiedKey === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">{tpl.title}</span>
                        <span className="text-[10px] text-slate-400">{tpl.subtitle}</span>
                      </div>

                      <div className="mt-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                        "{tpl.message}"
                      </div>

                      <div className="mt-2 text-[11px] font-mono text-slate-400 truncate bg-slate-900/60 p-1.5 rounded">
                        {fullUrl}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleCopy(fullUrl, tpl.id)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isCopied
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Link Copied!' : 'Copy Link for Facebook'}</span>
                      </button>

                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        title="Test Open WhatsApp"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: WhatsApp Broadcast Workflow */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Broadcast Composer */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-white text-base">Promotional Broadcast Composer</h3>
            <p className="text-xs text-slate-400">
              Compose promotional messages and copy for broadcast distribution to organized customer lists
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Customer Segment</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'All Contacts', count: allContacts.length },
                    { id: 'events', label: 'Event Clients', count: eventContacts.length },
                    { id: 'lightwal', label: 'Light Wal Buyers', count: lwContacts.length },
                    { id: 'retail', label: 'POS Retail', count: retailContacts.length }
                  ].map(seg => (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setBroadcastSegment(seg.id as any)}
                      className={`p-2 rounded-lg border text-center transition ${
                        broadcastSegment === seg.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>{seg.label}</div>
                      <div className="text-[10px] opacity-75">({seg.count} contacts)</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Broadcast Message Body</label>
                <textarea
                  rows={5}
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopy(broadcastText, 'broadcast')}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedKey === 'broadcast' ? 'Message Copied!' : 'Copy Broadcast Text for WhatsApp'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Directory */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Customer Contacts ({allContacts.length})</h4>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Auto-Synced
              </span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {allContacts.map((c, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{c.phone}</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded">
                    {c.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Google Business Profile & Local SEO */}
      {activeTab === 'google' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Google Business Profile Registration & Local Search</h3>
              <p className="text-xs text-slate-400">
                Official business metadata and location information for Google Search and Google Maps verification
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  Official Business Profile Details (Copy to Google Profile)
                </h4>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block">Registered Business Name:</span>
                    <span className="font-bold text-white text-sm">{company.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Primary Google Category:</span>
                    <span className="font-semibold text-emerald-400">Event Lighting Service • Stage Lighting Equipment Supplier</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Location Address:</span>
                    <span className="text-slate-200">{company.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Official Contact Numbers:</span>
                    <span className="text-slate-200">{company.phone1} / {company.phone2}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(`${company.name}\n${company.address}\nPhone: ${company.phone1}`, 'gprofile')}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  {copiedKey === 'gprofile' ? 'Profile Details Copied!' : 'Copy Profile Details'}
                </button>
              </div>

              {/* Local SEO & Verification Checklist */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                  Verification Checklist
                </h4>

                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Create profile on <strong>business.google.com</strong> with above exact name.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pin the exact store/warehouse location on Google Maps.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Upload photos of Moving Heads, Light Wal installations, and delivery vehicles.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Send review collection link to past event clients after event completion.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
