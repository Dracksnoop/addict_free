// API Service for connecting to backend
const API_BASE_URL = window.location.origin + '/api';

class ApiService {
    constructor() {
        this.isOnline = true;
        this.checkConnection();
    }

    async checkConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            this.isOnline = response.ok;
            return this.isOnline;
        } catch (error) {
            this.isOnline = false;
            console.warn('Backend not available, using localStorage fallback');
            return false;
        }
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Profile Methods
    async getProfiles() {
        try {
            return await this.request('/profiles');
        } catch (error) {
            return [];
        }
    }

    async getProfile(profileId) {
        return await this.request(`/profiles/${profileId}`);
    }

    async createProfile(name) {
        return await this.request('/profiles', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }

    async updateProfile(profileId, data) {
        return await this.request(`/profiles/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProfile(profileId) {
        return await this.request(`/profiles/${profileId}`, {
            method: 'DELETE',
        });
    }

    // Data Methods
    async getProfileData(profileId) {
        try {
            const data = await this.request(`/data/${profileId}`);
            // Convert MongoDB dates to ISO strings
            return this.normalizeData(data);
        } catch (error) {
            return null;
        }
    }

    async updateProfileData(profileId, data) {
        return await this.request(`/data/${profileId}`, {
            method: 'PUT',
            body: JSON.stringify({ data }),
        });
    }

    async addCheckIn(profileId, checkIn) {
        return await this.request(`/data/${profileId}/checkin`, {
            method: 'POST',
            body: JSON.stringify(checkIn),
        });
    }

    async addCraving(profileId, craving) {
        return await this.request(`/data/${profileId}/craving`, {
            method: 'POST',
            body: JSON.stringify(craving),
        });
    }

    // Normalize MongoDB data to match frontend format
    normalizeData(data) {
        if (!data) return null;

        return {
            startDate: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
            lastCheckIn: data.lastCheckIn ? new Date(data.lastCheckIn).toISOString() : null,
            checkIns: (data.checkIns || []).map(c => ({
                ...c,
                date: new Date(c.date).toISOString()
            })),
            cravings: (data.cravings || []).map(c => ({
                ...c,
                date: new Date(c.date).toISOString()
            })),
            goals: data.goals || [],
            milestones: data.milestones || [],
            achievements: data.achievements || []
        };
    }

    // Sync localStorage with backend
    async syncToBackend(profileId, localData) {
        try {
            await this.updateProfileData(profileId, localData);
            return true;
        } catch (error) {
            console.error('Sync to backend failed:', error);
            return false;
        }
    }

    async syncFromBackend(profileId) {
        try {
            const backendData = await this.getProfileData(profileId);
            return backendData;
        } catch (error) {
            console.error('Sync from backend failed:', error);
            return null;
        }
    }
}

// Create global API instance
window.apiService = new ApiService();

