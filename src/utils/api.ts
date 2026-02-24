import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fa970a63`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<T> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      console.error(`API Error [${method} ${endpoint}]: HTTP ${response.status}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data as T;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Get all game state
  getGameState: () => apiRequest('/game-state', 'GET'),

  // Initialize game state
  initialize: (data: any) => apiRequest('/initialize', 'POST', data),

  // Update specific state
  updateEmployees: (employees: any[]) => apiRequest('/employees', 'PUT', employees),
  updateContainmentUnits: (units: any[]) => apiRequest('/containment-units', 'PUT', units),
  updateAlerts: (alerts: any[]) => apiRequest('/alerts', 'PUT', alerts),
  updateManagers: (managers: any[]) => apiRequest('/managers', 'PUT', managers),
  updateMeltdownState: (state: any) => apiRequest('/meltdown-state', 'PUT', state),

  // Reset game
  reset: (data: any) => apiRequest('/reset', 'POST', data),

  // Alerts Table operations (connected to your Supabase alerts table)
  alertsTable: {
    // Get all alerts from the table
    getAll: () => apiRequest('/alerts-table', 'GET'),
    
    // Create a single alert
    create: (created_at: string, message: string) => 
      apiRequest('/alerts-table', 'POST', { created_at, message }),
    
    // Clear all alerts
    clear: () => apiRequest('/alerts-table/clear', 'DELETE')
  }
};