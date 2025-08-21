// lib/rionaApi.js
const BASE = process.env.NEXT_PUBLIC_RIONA_API || "/api/riona";

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
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(errorText || `HTTP ${res.status}`);
  }
  
  return res.headers.get("content-type")?.includes("application/json")
    ? res.json()
    : res.text();
}

export const Riona = {
  // Health & Status - mappa agli endpoint backend esistenti
  health: () => api("/api/status"),
  status: () => api("/api/status"),
  
  // Authentication  
  login: (credentials) => api("/api/login", { 
    method: "POST", 
    body: JSON.stringify(credentials) 
  }),
  logout: () => api("/api/logout", { method: "POST" }),
  me: () => api("/api/me"),
  
  // Characters - endpoint che potrebbero essere implementati nel backend
  listCharacters: async () => {
    try {
      return await api("/api/characters");
    } catch (error) {
      // Fallback to mock data if no endpoint available
      console.warn('Characters endpoint not available, using mock data');
      return [
        {
          id: "arcan-edge",
          name: "ArcanEdge System Agent",
          bio: "Advanced AI agent for social media automation",
          topics: ["technology", "ai", "automation"],
          active: true
        },
        {
          id: "elon-character", 
          name: "Tech Entrepreneur",
          bio: "Innovative entrepreneur focused on technology and space exploration",
          topics: ["technology", "space", "innovation"],
          active: false
        }
      ];
    }
  },
  
  getCharacter: async (id) => {
    try {
      return await api(`/characters/${id}`);
    } catch (error) {
      return {
        id,
        name: "Default Character",
        bio: "Default AI character",
        topics: ["general"]
      };
    }
  },
  
  setCharacter: (id) => api(`/characters/select`, { 
    method: "POST", 
    body: JSON.stringify({ id }) 
  }),
  
  createCharacter: (payload) => api(`/characters`, { 
    method: "POST", 
    body: JSON.stringify(payload) 
  }),
  
  deleteCharacter: (id) => api(`/characters/${id}`, { 
    method: "DELETE" 
  }),
  
  // Instagram Actions - mappa agli endpoint backend esistenti
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
  
  // Nuovi endpoint per le azioni Instagram
  postToInstagram: async (payload) => {
    try {
      return await api("/instagram/post", { 
        method: "POST", 
        body: JSON.stringify(payload) 
      });
    } catch (error) {
      throw new Error("Instagram posting endpoint not implemented in backend");
    }
  },
  
  likeByHashtag: async (payload) => {
    try {
      return await api("/instagram/like", { 
        method: "POST", 
        body: JSON.stringify(payload) 
      });
    } catch (error) {
      throw new Error("Instagram hashtag liking endpoint not implemented in backend");
    }
  },
  
  commentByHashtag: async (payload) => {
    try {
      return await api("/instagram/comment", { 
        method: "POST", 
        body: JSON.stringify(payload) 
      });
    } catch (error) {
      throw new Error("Instagram hashtag commenting endpoint not implemented in backend");
    }
  },
  
  // Clear cookies
  clearCookies: () => api("/api/clear-cookies", { method: "DELETE" }),
  
  // Exit gracefully
  exit: () => api("/api/exit", { method: "POST" }),
  
  // Logs - SSE endpoint proxato
  streamLogsUrl: () => `${BASE}/api/logs/stream`,
  
  // Settings - endpoint che potrebbero essere implementati
  getSettings: async () => {
    try {
      return await api("/api/settings");
    } catch (error) {
      // Fallback settings
      return {
        backendUrl: BASE,
        mongoUri: "mongodb://localhost:27017/riona-ai-agent",
        igUsername: "",
        igPassword: "",
        googleApiKey: "",
        proxyHost: "",
        proxyUsername: "",
        proxyPassword: ""
      };
    }
  },
  
  saveSettings: async (payload) => {
    try {
      return await api("/api/settings", { 
        method: "POST", 
        body: JSON.stringify(payload) 
      });
    } catch (error) {
      throw new Error("Settings endpoint not implemented in backend");
    }
  }
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