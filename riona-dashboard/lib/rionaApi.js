// lib/rionaApi.js
const BASE = process.env.NEXT_PUBLIC_RIONA_API || "http://localhost:3000";

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { 
    ...opts, 
    headers: { 
      "Content-Type": "application/json", 
      ...(opts.headers || {}) 
    },
    cache: "no-store",
    credentials: "include" // Include cookies for authentication
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP ${res.status}`);
  }
  
  return res.json();
}

export const Riona = {
  // Health & Status
  health: () => api("/api/status"),
  status: () => api("/api/status"),
  
  // Authentication  
  login: (credentials) => api("/api/login", { 
    method: "POST", 
    body: JSON.stringify(credentials) 
  }),
  logout: () => api("/api/logout", { method: "POST" }),
  me: () => api("/api/me"),
  
  // Characters - mapping to backend structure
  listCharacters: async () => {
    // Since backend doesn't have character management endpoints,
    // we'll simulate this by reading available character files
    try {
      const response = await fetch('/api/characters');
      return response.json();
    } catch (error) {
      // Fallback to mock data if no endpoint available
      return [
        {
          id: "arcan-edge",
          name: "ArcanEdge System Agent",
          bio: "Advanced AI agent for social media automation",
          topics: ["technology", "ai", "automation"],
          active: true
        }
      ];
    }
  },
  
  getCharacter: (id) => api(`/api/characters/${id}`).catch(() => ({
    id,
    name: "Default Character",
    bio: "Default AI character",
    topics: ["general"]
  })),
  
  setCharacter: (id) => api(`/api/characters/select`, { 
    method: "POST", 
    body: JSON.stringify({ id }) 
  }),
  
  createCharacter: (payload) => api(`/api/characters`, { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }),
  
  deleteCharacter: (id) => api(`/api/characters/${id}`, { 
    method: "DELETE" 
  }),
  
  // Instagram Actions - mapping to existing backend endpoints
  loginInstagram: (payload) => api("/api/login", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }),
  
  interactWithPosts: () => api("/api/interact", { method: "POST" }),
  
  sendDirectMessage: (payload) => api("/api/dm", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }),
  
  sendDirectMessagesFromFile: (payload) => api("/api/dm-file", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }),
  
  scrapeFollowers: (payload) => api("/api/scrape-followers", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }),
  
  // Post to Instagram - would need backend implementation
  postToInstagram: (payload) => api("/api/instagram/post", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }).catch(() => {
    throw new Error("Instagram posting not yet implemented in backend");
  }),
  
  // Like posts by hashtag - would need backend implementation  
  likeByHashtag: (payload) => api("/api/instagram/like", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }).catch(() => {
    throw new Error("Hashtag liking not yet implemented in backend");
  }),
  
  // Comment by hashtag - would need backend implementation
  commentByHashtag: (payload) => api("/api/instagram/comment", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }).catch(() => {
    throw new Error("Hashtag commenting not yet implemented in backend");
  }),
  
  // Clear cookies
  clearCookies: () => api("/api/clear-cookies", { method: "DELETE" }),
  
  // Logs - SSE endpoint
  streamLogsUrl: () => `${BASE}/api/logs/stream`,
  
  // Settings - would need backend implementation
  getSettings: () => api("/api/settings").catch(() => ({
    backendUrl: BASE,
    mongoUri: "mongodb://localhost:27017/riona-ai-agent",
    igUsername: "",
    igPassword: "",
    googleApiKey: "",
    proxyHost: "",
    proxyUsername: "",
    proxyPassword: ""
  })),
  
  saveSettings: (payload) => api("/api/settings", { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }).catch(() => {
    throw new Error("Settings save not yet implemented in backend");
  })
};

// Utility functions
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    error: error.message || 'Unknown error occurred'
  };
};

export const isOnline = async () => {
  try {
    await Riona.health();
    return true;
  } catch (error) {
    return false;
  }
};