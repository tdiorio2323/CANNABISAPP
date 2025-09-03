'use client';
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, LogIn, ChevronRight, User, Grid, Globe, BookOpen, ShoppingCart,
  Bot, LayoutGrid, Briefcase, Video, Leaf, MonitorSmartphone, Settings,
  ArrowLeft, Eye, Rocket, Plus, Trash2, GripVertical, Palette,
  Image as ImageIcon, Link as LinkIcon
} from "lucide-react";

// Tailwind classes assumed available. Minimal, high-contrast wireframe. No APIs. Local state + localStorage only.

const CARD_CLASSES = "group relative rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4 flex flex-col gap-2 min-h-[120px] shadow-sm hover:shadow-md text-left w-full";
const INPUT_CLASSES = "rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 w-full";
const BUTTON_CLASSES = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition-transform active:scale-95";
const STORAGE_KEY = "tdhub_linkinbio_v1";

// Types
export type Route = { icon: React.ElementType; title: string; subtitle?: string };
export type LinkItem = { id: number; title: string; url: string; enabled: boolean };
export type Profile = { name: string; bio: string };
export type Appearance = { background: string; buttonStyle: string; buttonColor: string };
export type Persisted = { profile: Profile; links: LinkItem[]; appearance: Appearance };

// --- Route Card ---
function RouteCard({ icon: Icon, title, subtitle, onClick }: Route & { onClick: () => void }) {
  return (
    <button onClick={onClick} className={CARD_CLASSES}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/10 p-2"><Icon className="size-5" /></div>
          <div className="text-left">
            <div className="font-semibold">{title}</div>
            {subtitle ? <div className="text-xs text-white/70">{subtitle}</div> : null}
          </div>
        </div>
        <ChevronRight className="size-4 opacity-60 group-hover:translate-x-0.5 transition" />
      </div>
      <div className="mt-auto pt-3 grid grid-cols-3 gap-2 text-[10px] text-white/60">
        <div className="rounded-lg border border-white/10 bg-black/10 px-2 py-1 text-center">Config</div>
        <div className="rounded-lg border border-white/10 bg-black/10 px-2 py-1 text-center">Preview</div>
        <div className="rounded-lg border border-white/10 bg-black/10 px-2 py-1 text-center">Launch</div>
      </div>
    </button>
  );
}

const routes: Route[] = [
  { icon: User, title: "Creator Link-in-Bio", subtitle: "Profile • Buttons • Styles • Features" },
  { icon: Leaf, title: "Cannabis Brand Page", subtitle: "Strains • Menu • Compliance" },
  { icon: Briefcase, title: "Agency Page", subtitle: "Web • Branding • Social" },
  { icon: Bot, title: "AI Course Page", subtitle: "Curriculum • Checkout • Drip" },
  { icon: MonitorSmartphone, title: "Personal Dashboard", subtitle: "Ops • Tasks • Integrations" },
  { icon: ShoppingCart, title: "E‑commerce Page", subtitle: "Catalog • Cart • Checkout" },
  { icon: BookOpen, title: "Blog", subtitle: "Posts • Tags • SEO" },
  { icon: LayoutGrid, title: "Empty Slot A", subtitle: "Reserve" },
  { icon: LayoutGrid, title: "Empty Slot B", subtitle: "Reserve" },
  { icon: LayoutGrid, title: "Empty Slot C", subtitle: "Reserve" },
  { icon: Globe, title: "External Sites Hub", subtitle: "Open multiple sites" },
  { icon: Video, title: "Live/Video Features", subtitle: "Video chat • Tips" },
];

const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}>
    {children}
  </button>
);

export default function DashboardWireframe() {
  const [stage, setStage] = useState<"auth" | "routes" | "config" | "link-in-bio">("auth");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [editorTab, setEditorTab] = useState<'profile' | 'links' | 'appearance'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [devStatus, setDevStatus] = useState<string>("");

  // Local state for Link-in-Bio
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [profile, setProfile] = useState<Profile>({ name: 'Your Name', bio: 'Your bio goes here...' });
  const [appearance, setAppearance] = useState<Appearance>({ background: 'bg-zinc-900', buttonStyle: 'rounded-lg', buttonColor: 'bg-white/10' });

  // --- Local persistence ---
  function loadFromStorage(): Persisted | null {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as Persisted : null; } catch { return null; }
  }
  function saveToStorage(next: Partial<Persisted>) {
    const current: Persisted = { profile, links, appearance };
    const merged: Persisted = { ...current, ...next } as Persisted;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  useEffect(() => {
    // DEV tests
    try {
      localStorage.setItem("__dev_test__", "ok");
      const t = localStorage.getItem("__dev_test__");
      if (t === "ok") setDevStatus("storage ok"); else setDevStatus("storage failed");
    } catch { setDevStatus("storage disabled"); }

    setIsLoading(true);
    const cached = loadFromStorage();
    if (cached) {
      setProfile(cached.profile);
      setLinks(cached.links);
      setAppearance(cached.appearance);
    }
    setIsLoading(false);
  }, []);

  // Auto-save on changes
  useEffect(() => { saveToStorage({ profile }); }, [profile]);
  useEffect(() => { saveToStorage({ links }); }, [links]);
  useEffect(() => { saveToStorage({ appearance }); }, [appearance]);

  // Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; setProfile(prev => ({ ...prev, [name]: value }));
  };
  const handleLinkChange = (id: number, field: keyof LinkItem, value: string | boolean) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value as any } : l));
  };
  const addNewLink = () => { setLinks(prev => [...prev, { id: Date.now(), title: 'New Link', url: '', enabled: true }]); };
  const removeLink = (id: number) => { setLinks(prev => prev.filter(l => l.id !== id)); };
  const handleAppearanceChange = (field: keyof Appearance, value: string) => { setAppearance(prev => ({ ...prev, [field]: value })); };

  // UI routing
  const handleRouteSelect = (route: Route) => { setSelectedRoute(route); setStage(route.title === "Creator Link-in-Bio" ? "link-in-bio" : "config"); };

  const renderContent = () => {
    if (stage === "auth") return (
      <motion.section key="auth" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto grid max-w-xl gap-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/10 p-2"><Lock className="size-5" /></div>
            <h1 className="text-xl font-semibold">Secure Access</h1>
          </div>
          <div className="grid gap-3">
            <label className="text-xs text-white/70">Username</label>
            <input className={INPUT_CLASSES} placeholder="Enter username" />
            <label className="mt-3 text-xs text-white/70">Password</label>
            <input type="password" className={INPUT_CLASSES} placeholder="••••••••" />
            <div className="mt-3 flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 opacity-80"><input type="checkbox" className="size-3 accent-white/50" /> Remember me</label>
              <button className="opacity-80 underline">Forgot?</button>
            </div>
            <button onClick={() => setStage("routes")} className={`${BUTTON_CLASSES} mt-6 bg-white text-black`}><LogIn className="size-4" /> Continue</button>
          </div>
        </div>
        <p className="mx-auto max-w-xl text-center text-xs text-white/60">Static wireframe. Button advances to Route Picker.</p>
      </motion.section>
    );

    if (stage === "routes") return (
      <motion.section key="routes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Grid className="size-4 opacity-70" /><div className="text-sm font-semibold">Pick a Route</div></div>
            <div className="text-xs text-white/60">Step 2 of 3</div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map(route => (<RouteCard key={route.title} {...route} onClick={() => handleRouteSelect(route)} />))}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <button onClick={() => setStage("auth")} className={`${BUTTON_CLASSES} border border-white/15 text-sm text-white/80 hover:bg-white/10`}><ArrowLeft className="size-4" /> Back</button>
          <div className="text-xs text-white/60"><span>Next: choose a card to expand configuration →</span></div>
        </div>
      </motion.section>
    );

    if (stage === "config" && selectedRoute) {
      const Icon = selectedRoute.icon;
      return (
        <motion.section key="config" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/10 p-2"><Icon className="size-5" /></div>
              <div><h2 className="font-semibold">{selectedRoute.title}</h2><p className="text-xs text-white/70">{selectedRoute.subtitle}</p></div>
            </div>
            <div className="text-xs text-white/60">Step 3 of 3</div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 grid gap-6">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Settings className="size-5" /> Configuration</h3>
              <div className="grid gap-3"><label className="text-sm font-medium text-white/90">Route Name</label><input className={INPUT_CLASSES} defaultValue={selectedRoute.title} /><p className="text-xs text-white/60">Internal name.</p></div>
              <div className="border-t border-white/10" />
              <div className="grid gap-3">
                <label className="text-sm font-medium text-white/90">Public URL</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/50 bg-black/20 px-3 py-2 rounded-l-xl border border-r-0 border-white/10">tdstudios.hub/</span>
                  <input className={INPUT_CLASSES + " rounded-l-none"} defaultValue={selectedRoute.title.toLowerCase().replace(/\s+/g, '-')}/>
                </div>
                <p className="text-xs text-white/60">Live URL.</p>
              </div>
              <div className="border-t border-white/10" />
              <div className="flex items-center justify-between"><div><label className="text-sm font-medium text-white/90">Status</label><p className="text-xs text-white/60 mt-1">Activate or deactivate this route.</p></div>
                <label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" className="peer sr-only" defaultChecked /><div className="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-600 after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none"></div></label>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Eye className="size-5" /> Preview</h3>
              <div className="flex-grow rounded-lg bg-black/20 border border-white/10 flex items-center justify-center"><p className="text-xs text-white/50">Live preview unavailable</p></div>
              <button className={`${BUTTON_CLASSES} w-full bg-white/10 text-white/90 hover:bg-white/20`}><Rocket className="size-4" /> Launch</button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <button onClick={() => setStage("routes")} className={`${BUTTON_CLASSES} border border-white/15 text-sm text-white/80 hover:bg-white/10`}><ArrowLeft className="size-4" /> Back to Routes</button>
          </div>
        </motion.section>
      );
    }

    if (stage === "link-in-bio" && selectedRoute) {
      const Icon = selectedRoute.icon;
      return (
        <motion.section key="link-in-bio" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-6">
          {/* Header */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/10 p-2"><Icon className="size-5" /></div>
              <div><h2 className="font-semibold">{selectedRoute.title}</h2><p className="text-xs text-white/70">{selectedRoute.subtitle}</p></div>
            </div>
            <div className="text-xs text-white/60">Editing</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-white/50">Loading…</div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Editor Panel */}
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 grid gap-6">
                <div className="p-1 bg-black/20 rounded-lg flex items-center gap-1 self-start">
                  <TabButton active={editorTab === 'profile'} onClick={() => setEditorTab('profile')}><User className="size-4 inline mr-1.5" />Profile</TabButton>
                  <TabButton active={editorTab === 'links'} onClick={() => setEditorTab('links')}><LinkIcon className="size-4 inline mr-1.5" />Links</TabButton>
                  <TabButton active={editorTab === 'appearance'} onClick={() => setEditorTab('appearance')}><Palette className="size-4 inline mr-1.5" />Appearance</TabButton>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={editorTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    {editorTab === 'profile' && (
                      <div className="grid gap-4">
                        <h3 className="text-lg font-semibold">Profile Settings</h3>
                        <div className="flex items-start gap-4">
                          <button className="relative group size-20 rounded-full bg-black/20 border border-white/10 flex items-center justify-center"><ImageIcon className="size-8 text-white/40" /></button>
                          <div className="flex-1 grid gap-3">
                            <input name="name" className={INPUT_CLASSES} placeholder="Name" value={profile.name} onChange={handleProfileChange} />
                            <textarea name="bio" className={`${INPUT_CLASSES} min-h-[80px]`} placeholder="Bio" value={profile.bio} onChange={handleProfileChange} />
                          </div>
                        </div>
                      </div>
                    )}

                    {editorTab === 'links' && (
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Your Links</h3>
                          <button onClick={addNewLink} className={`${BUTTON_CLASSES} bg-white/10 text-xs hover:bg-white/20`}><Plus className="size-4" /> Add Link</button>
                        </div>
                        <div className="grid gap-3">
                          {links.map(link => (
                            <div key={link.id} className="bg-black/20 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                              <GripVertical className="size-5 text-white/40 cursor-grab mt-2.5" />
                              <div className="flex-1 grid gap-2">
                                <input className={INPUT_CLASSES} placeholder="Title" value={link.title} onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)} />
                                <input className={INPUT_CLASSES} placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)} />
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <button onClick={() => removeLink(link.id)} className="p-2 text-white/50 hover:text-white"><Trash2 className="size-4" /></button>
                                <label className="relative inline-flex cursor-pointer items-center">
                                  <input type="checkbox" checked={link.enabled} onChange={(e) => handleLinkChange(link.id, 'enabled', e.target.checked)} className="peer sr-only" />
                                  <div className="peer h-5 w-9 rounded-full bg-zinc-700 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {editorTab === 'appearance' && (
                      <div className="grid gap-6">
                        <h3 className="text-lg font-semibold">Appearance</h3>
                        <div>
                          <label className="text-sm font-medium text-white/90 mb-2 block">Background</label>
                          <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => handleAppearanceChange('background', 'bg-zinc-900')} className="h-12 rounded-lg bg-zinc-900 border-2 border-white/20"></button>
                            <button onClick={() => handleAppearanceChange('background', 'bg-gradient-to-br from-blue-900 to-zinc-900')} className="h-12 rounded-lg bg-gradient-to-br from-blue-900 to-zinc-900"></button>
                            <button onClick={() => handleAppearanceChange('background', 'bg-gradient-to-br from-purple-900 to-zinc-900')} className="h-12 rounded-lg bg-gradient-to-br from-purple-900 to-zinc-900"></button>
                            <button onClick={() => handleAppearanceChange('background', 'bg-gradient-to-br from-green-900 to-zinc-900')} className="h-12 rounded-lg bg-gradient-to-br from-green-900 to-zinc-900"></button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white/90 mb-2 block">Button Style</label>
                          <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => handleAppearanceChange('buttonStyle', 'rounded-lg')} className="h-10 rounded-lg bg-white/10 text-xs">Sharp</button>
                            <button onClick={() => handleAppearanceChange('buttonStyle', 'rounded-2xl')} className="h-10 rounded-2xl bg-white/10 text-xs">Rounded</button>
                            <button onClick={() => handleAppearanceChange('buttonStyle', 'rounded-full')} className="h-10 rounded-full bg-white/10 text-xs">Pill</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Preview Panel */}
              <div className="p-6 flex flex-col gap-4 sticky top-10">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Eye className="size-5" /> Phone Preview</h3>
                <div className={`w-full max-w-[300px] mx-auto rounded-[40px] border-[10px] border-zinc-800 shadow-xl overflow-hidden aspect-[9/19.5] transition-colors duration-300 ${appearance.background}`}>
                  <div className="p-4 pt-8 flex flex-col items-center gap-4 h-full overflow-y-auto">
                    <div className="size-20 rounded-full bg-white/10"></div>
                    <div className="text-center">
                      <h4 className="font-semibold">{profile.name || "Your Name"}</h4>
                      <p className="text-xs text-white/70 max-w-xs break-words">{profile.bio || "Your bio goes here..."}</p>
                    </div>
                    <div className="w-full flex flex-col gap-3 mt-4">
                      {links.filter(l => l.enabled).map(link => (
                        <div key={link.id} className={`w-full p-3 text-center text-sm font-medium transition-all duration-300 ${appearance.buttonStyle} ${appearance.buttonColor}`}>{link.title || "Link Title"}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <button onClick={() => setStage("routes")} className={`${BUTTON_CLASSES} border border-white/15 text-sm text-white/80 hover:bg-white/10`}><ArrowLeft className="size-4" /> Back to Routes</button>
            <p className="text-xs text-white/60">Auto-saved locally ({devStatus}).</p>
          </div>
        </motion.section>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white font-sans">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur" />
            <div className="font-semibold tracking-wide">TD Studios • Hub</div>
          </div>
          <div className="text-xs text-white/60">Wireframe • v5 (Local)</div>
        </div>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%,transparent_70%,rgba(255,255,255,0.04))]" />
      </div>
    </div>
  );
}
