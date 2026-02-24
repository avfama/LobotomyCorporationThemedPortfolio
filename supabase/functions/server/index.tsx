import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Create Supabase client
const getSupabaseClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-fa970a63/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all game state
app.get("/make-server-fa970a63/game-state", async (c) => {
  try {
    const employees = await kv.get("employees") || [];
    const containmentUnits = await kv.get("containmentUnits") || [];
    const alerts = await kv.get("alerts") || [];
    const managers = await kv.get("managers") || [];
    const meltdownState = await kv.get("meltdownState") || { state: 'normal', progress: 0 };
    
    return c.json({ 
      success: true,
      data: {
        employees,
        containmentUnits,
        alerts,
        managers,
        meltdownState
      }
    });
  } catch (error) {
    console.log("Error fetching game state:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Initialize game state with default data
app.post("/make-server-fa970a63/initialize", async (c) => {
  try {
    const { employees, containmentUnits, alerts, managers } = await c.req.json();
    
    await kv.set("employees", employees);
    await kv.set("containmentUnits", containmentUnits);
    await kv.set("alerts", alerts);
    await kv.set("managers", managers);
    await kv.set("meltdownState", { state: 'normal', progress: 0 });
    
    return c.json({ success: true, message: "Game state initialized" });
  } catch (error) {
    console.log("Error initializing game state:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update employees
app.put("/make-server-fa970a63/employees", async (c) => {
  try {
    const employees = await c.req.json();
    await kv.set("employees", employees);
    return c.json({ success: true, data: employees });
  } catch (error) {
    console.log("Error updating employees:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update containment units
app.put("/make-server-fa970a63/containment-units", async (c) => {
  try {
    const containmentUnits = await c.req.json();
    await kv.set("containmentUnits", containmentUnits);
    return c.json({ success: true, data: containmentUnits });
  } catch (error) {
    console.log("Error updating containment units:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update alerts
app.put("/make-server-fa970a63/alerts", async (c) => {
  try {
    const alerts = await c.req.json();
    await kv.set("alerts", alerts);
    return c.json({ success: true, data: alerts });
  } catch (error) {
    console.log("Error updating alerts:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update managers
app.put("/make-server-fa970a63/managers", async (c) => {
  try {
    const managers = await c.req.json();
    await kv.set("managers", managers);
    return c.json({ success: true, data: managers });
  } catch (error) {
    console.log("Error updating managers:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update meltdown state
app.put("/make-server-fa970a63/meltdown-state", async (c) => {
  try {
    const meltdownState = await c.req.json();
    await kv.set("meltdownState", meltdownState);
    return c.json({ success: true, data: meltdownState });
  } catch (error) {
    console.log("Error updating meltdown state:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Reset game to initial state
app.post("/make-server-fa970a63/reset", async (c) => {
  try {
    const { employees, containmentUnits, alerts, managers } = await c.req.json();
    
    await kv.set("employees", employees);
    await kv.set("containmentUnits", containmentUnits);
    await kv.set("alerts", alerts);
    await kv.set("managers", managers);
    await kv.set("meltdownState", { state: 'normal', progress: 0 });
    
    return c.json({ success: true, message: "Game state reset" });
  } catch (error) {
    console.log("Error resetting game state:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// ALERTS TABLE ENDPOINTS
// ============================================

// Get all alerts from the alerts table
app.get("/make-server-fa970a63/alerts-table", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100); // Limit to last 100 alerts
    
    if (error) {
      console.log("Supabase error fetching alerts:", error);
      throw new Error(error.message);
    }
    
    return c.json({ success: true, data: data || [] });
  } catch (error) {
    console.log("Error fetching alerts from table:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create a new alert in the alerts table
app.post("/make-server-fa970a63/alerts-table", async (c) => {
  try {
    const { created_at, message } = await c.req.json();
    const supabase = getSupabaseClient();
    
    console.log("Creating alert:", { created_at, message });
    
    const { data, error } = await supabase
      .from("alerts")
      .insert([{
        created_at: created_at,
        message: message
      }])
      .select()
      .single();
    
    if (error) {
      console.log("Supabase error creating alert:", error);
      throw new Error(error.message);
    }
    
    return c.json({ success: true, data });
  } catch (error) {
    console.log("Error creating alert:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Clear all alerts
app.delete("/make-server-fa970a63/alerts-table/clear", async (c) => {
  try {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from("alerts")
      .delete()
      .neq("created_at", "1970-01-01"); // Delete all rows
    
    if (error) {
      console.log("Supabase error clearing alerts:", error);
      throw new Error(error.message);
    }
    
    return c.json({ success: true, message: "All alerts cleared" });
  } catch (error) {
    console.log("Error clearing alerts:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

Deno.serve(app.fetch);