// Data Management with Multi-Profile Support (Backend + LocalStorage)
class AddictionApp {
    constructor() {
        this.api = window.apiService || null;
        this.useBackend = false;
        this.currentProfileId = this.loadCurrentProfileId();
        this.profiles = {};
        this.data = this.getDefaultData();
        this.initAsync();
    }

    async initAsync() {
        this.setupEventListeners();
        
        // Check if backend is available
        if (this.api) {
            this.useBackend = await this.api.checkConnection();
        }

        // Load profiles (from backend or localStorage)
        await this.loadProfilesAsync();
        
        // Load current profile data
        await this.loadCurrentProfileDataAsync();
        
        // Initialize UI
        this.loadProfileSelector();
        this.updateDashboard();
        this.loadQuotes();
        this.checkMilestones();
        this.checkAchievements();
        this.updateRecentActivity();
        this.updateCravingsList();
        this.updateGoalsList();
        this.updateProfilesList();
        
        // Show connection status
        if (this.useBackend) {
            console.log('✅ Connected to backend - data will be saved to MongoDB');
        } else {
            console.warn('⚠️ Backend not available - using localStorage only');
        }
    }

    // Profile Management
    async loadProfilesAsync() {
        if (this.useBackend && this.api) {
            try {
                const backendProfiles = await this.api.getProfiles();
                // Convert array to object format
                this.profiles = {};
                backendProfiles.forEach(profile => {
                    this.profiles[profile.profileId] = {
                        id: profile.profileId,
                        name: profile.name,
                        createdAt: profile.createdAt,
                        data: null // Will load separately
                    };
                });
                // Sync to localStorage as backup
                this.saveProfilesToLocal();
                return;
            } catch (error) {
                console.error('Failed to load profiles from backend:', error);
                this.useBackend = false;
            }
        }
        
        // Fallback to localStorage
        this.loadProfilesFromLocal();
    }

    loadProfilesFromLocal() {
        const saved = localStorage.getItem('addictionAppProfiles');
        if (saved) {
            this.profiles = JSON.parse(saved);
        } else {
            this.profiles = {};
        }
    }

    saveProfilesToLocal() {
        localStorage.setItem('addictionAppProfiles', JSON.stringify(this.profiles));
    }

    async saveProfiles() {
        // Save to localStorage as backup
        this.saveProfilesToLocal();
        
        // Sync to backend if available
        if (this.useBackend && this.api) {
            // Profiles are managed via API, no need to sync here
        }
    }

    loadCurrentProfileId() {
        return localStorage.getItem('addictionAppCurrentProfile') || null;
    }

    saveCurrentProfileId(profileId) {
        if (profileId) {
            localStorage.setItem('addictionAppCurrentProfile', profileId);
        } else {
            localStorage.removeItem('addictionAppCurrentProfile');
        }
        this.currentProfileId = profileId;
    }

    async loadCurrentProfileDataAsync() {
        if (!this.currentProfileId) {
            this.data = this.getDefaultData();
            return;
        }

        if (this.useBackend && this.api) {
            try {
                const backendData = await this.api.getProfileData(this.currentProfileId);
                if (backendData) {
                    this.data = backendData;
                    // Update local cache
                    if (this.profiles[this.currentProfileId]) {
                        this.profiles[this.currentProfileId].data = this.data;
                    }
                    this.saveProfilesToLocal();
                    return;
                }
            } catch (error) {
                console.error('Failed to load data from backend:', error);
                this.useBackend = false;
            }
        }

        // Fallback to localStorage
        if (this.profiles[this.currentProfileId] && this.profiles[this.currentProfileId].data) {
            this.data = this.profiles[this.currentProfileId].data;
        } else {
            this.data = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            startDate: new Date().toISOString(),
            lastCheckIn: null,
            checkIns: [],
            cravings: [],
            goals: [],
            milestones: [],
            achievements: []
        };
    }

    loadData() {
        return this.data;
    }

    async saveData() {
        if (!this.currentProfileId) {
            // If no profile is selected, create a default one
            await this.createProfile('Default Profile', true);
            return;
        }

        // Update local cache
        if (this.profiles[this.currentProfileId]) {
            this.profiles[this.currentProfileId].data = this.data;
        }
        
        // Save to localStorage as backup
        this.saveProfilesToLocal();

        // Sync to backend if available
        if (this.useBackend && this.api) {
            try {
                await this.api.updateProfileData(this.currentProfileId, this.data);
            } catch (error) {
                console.error('Failed to save to backend:', error);
                this.useBackend = false;
            }
        }
    }

    async createProfile(name, switchToIt = false) {
        if (!name || name.trim() === '') {
            alert('Please enter a profile name.');
            return false;
        }

        // Check if profile name already exists
        const existingProfile = Object.values(this.profiles).find(p => 
            p.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (existingProfile) {
            alert('A profile with this name already exists.');
            return false;
        }

        let profileId;
        let newProfile;

        if (this.useBackend && this.api) {
            try {
                const backendProfile = await this.api.createProfile(name.trim());
                profileId = backendProfile.profileId;
                newProfile = {
                    id: profileId,
                    name: backendProfile.name,
                    createdAt: backendProfile.createdAt,
                    data: this.getDefaultData()
                };
            } catch (error) {
                console.error('Failed to create profile in backend:', error);
                this.useBackend = false;
                // Fall through to local creation
            }
        }

        if (!profileId) {
            // Create locally
            profileId = 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            newProfile = {
                id: profileId,
                name: name.trim(),
                createdAt: new Date().toISOString(),
                data: this.getDefaultData()
            };
        }

        this.profiles[profileId] = newProfile;
        await this.saveProfiles();

        if (switchToIt) {
            await this.switchProfile(profileId);
        } else {
            this.updateProfileSelector();
            this.updateProfilesList();
        }

        return true;
    }

    async switchProfile(profileId) {
        // Save current profile data before switching
        if (this.currentProfileId) {
            await this.saveData();
        }

        // Load new profile
        if (this.profiles[profileId]) {
            this.saveCurrentProfileId(profileId);
            await this.loadCurrentProfileDataAsync();
            this.updateProfileSelector();
            this.refreshAllViews();
        }
    }

    async deleteProfile(profileId) {
        if (!this.profiles[profileId]) return;

        if (Object.keys(this.profiles).length === 1) {
            alert('Cannot delete the last profile. Please create another profile first.');
            return;
        }

        if (confirm(`Are you sure you want to delete profile "${this.profiles[profileId].name}"? This cannot be undone.`)) {
            // Delete from backend if available
            if (this.useBackend && this.api) {
                try {
                    await this.api.deleteProfile(profileId);
                } catch (error) {
                    console.error('Failed to delete profile from backend:', error);
                }
            }

            delete this.profiles[profileId];
            await this.saveProfiles();

            // If deleted profile was current, switch to another
            if (this.currentProfileId === profileId) {
                const remainingProfiles = Object.keys(this.profiles);
                if (remainingProfiles.length > 0) {
                    await this.switchProfile(remainingProfiles[0]);
                } else {
                    this.saveCurrentProfileId(null);
                    this.data = this.getDefaultData();
                    this.refreshAllViews();
                }
            }

            this.updateProfileSelector();
            this.updateProfilesList();
            this.closeModal();
        }
    }

    async refreshAllViews() {
        this.updateDashboard();
        await this.checkMilestones();
        await this.checkAchievements();
        this.updateRecentActivity();
        this.updateCravingsList();
        this.updateGoalsList();
    }

    loadProfileSelector() {
        const select = document.getElementById('profile-select');
        if (!select) return;

        this.updateProfileSelector();
        
        select.addEventListener('change', (e) => {
            const profileId = e.target.value;
            if (profileId && profileId !== this.currentProfileId) {
                this.switchProfile(profileId);
            }
        });
    }

    updateProfileSelector() {
        const select = document.getElementById('profile-select');
        if (!select) return;

        select.innerHTML = '<option value="">Select Profile...</option>';
        
        Object.values(this.profiles).forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.id;
            option.textContent = profile.name;
            if (profile.id === this.currentProfileId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    updateProfilesList() {
        const list = document.getElementById('profiles-list');
        if (!list) return;

        const profilesArray = Object.values(this.profiles);
        
        if (profilesArray.length === 0) {
            list.innerHTML = '<p class="empty-state">No profiles yet. Create your first profile above!</p>';
            return;
        }

        list.innerHTML = profilesArray.map(profile => {
            const days = this.calculateDaysSober(profile.data);
            const isActive = profile.id === this.currentProfileId;
            
            return `
                <div class="profile-item ${isActive ? 'active' : ''}">
                    <div class="profile-item-info">
                        <h4>${profile.name} ${isActive ? '✓' : ''}</h4>
                        <p>Days Sober: ${days} | Created: ${new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="profile-item-actions">
                        ${!isActive ? `<button class="profile-action-btn switch" onclick="app.switchProfile('${profile.id}')">Switch</button>` : ''}
                        <button class="profile-action-btn manage" onclick="app.openProfileModal('${profile.id}')">Manage</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    calculateDaysSober(data) {
        if (!data || !data.startDate) return 0;
        const start = new Date(data.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        const diffTime = today - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    openProfileModal(profileId) {
        const profile = this.profiles[profileId];
        if (!profile) return;

        const modal = document.getElementById('profile-modal');
        const modalName = document.getElementById('modal-profile-name');
        
        modalName.textContent = profile.name;
        modal.classList.add('show');
        modal.dataset.profileId = profileId;

        // Setup modal buttons
        document.getElementById('switch-profile-btn').onclick = () => {
            this.switchProfile(profileId);
            this.closeModal();
        };

        document.getElementById('delete-profile-btn').onclick = () => {
            this.deleteProfile(profileId);
        };

        document.getElementById('cancel-modal-btn').onclick = () => {
            this.closeModal();
        };

        document.querySelector('.modal-close').onclick = () => {
            this.closeModal();
        };
    }

    closeModal() {
        const modal = document.getElementById('profile-modal');
        modal.classList.remove('show');
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Quick actions
        document.getElementById('quick-checkin-btn')?.addEventListener('click', () => {
            this.switchTab('checkin');
        });

        document.getElementById('log-craving-btn')?.addEventListener('click', () => {
            this.switchTab('cravings');
        });

        // Mood selector
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Energy level slider
        const energySlider = document.getElementById('energy-level');
        if (energySlider) {
            energySlider.addEventListener('input', (e) => {
                document.getElementById('energy-value').textContent = e.target.value;
            });
        }

        // Craving intensity slider
        const intensitySlider = document.getElementById('craving-intensity');
        if (intensitySlider) {
            intensitySlider.addEventListener('input', (e) => {
                document.getElementById('intensity-value').textContent = e.target.value;
            });
        }

        // Submit check-in
        document.getElementById('submit-checkin')?.addEventListener('click', () => {
            this.submitCheckIn();
        });

        // Submit craving
        document.getElementById('submit-craving')?.addEventListener('click', () => {
            this.submitCraving();
        });

        // Add goal
        document.getElementById('add-goal-btn')?.addEventListener('click', () => {
            this.addGoal();
        });

        // Refresh quote
        document.getElementById('refresh-quote')?.addEventListener('click', () => {
            this.showRandomQuote();
        });

        // Create profile
        document.getElementById('create-profile-btn')?.addEventListener('click', () => {
            this.createProfileFromForm();
        });

        // Manage profiles button
        document.getElementById('manage-profiles-btn')?.addEventListener('click', () => {
            this.switchTab('profiles');
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('profile-modal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    async createProfileFromForm() {
        const nameInput = document.getElementById('new-profile-name');
        const name = nameInput.value.trim();
        
        const success = await this.createProfile(name, true);
        if (success) {
            nameInput.value = '';
            alert(`Profile "${name}" created and switched to! 🎉`);
            this.switchTab('dashboard');
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // If switching to profiles tab, update the list
        if (tabName === 'profiles') {
            this.updateProfilesList();
        }
    }

    // Dashboard Functions
    updateDashboard() {
        if (!this.currentProfileId) {
            // Show message to create/select profile
            document.getElementById('days-sober').textContent = '0';
            document.getElementById('current-streak').textContent = '0';
            document.getElementById('cravings-today').textContent = '0';
            document.getElementById('welcome-message').textContent = 'Please create or select a profile to start tracking your journey.';
            return;
        }

        const daysSober = this.getDaysSober();
        const streak = this.getCurrentStreak();
        const cravingsToday = this.getCravingsToday();

        document.getElementById('days-sober').textContent = daysSober;
        document.getElementById('current-streak').textContent = streak;
        document.getElementById('cravings-today').textContent = cravingsToday;

        this.updateWelcomeMessage(daysSober);
        this.updateProgress(daysSober);
    }

    getDaysSober() {
        const start = new Date(this.data.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        const diffTime = today - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    getCurrentStreak() {
        if (!this.data.checkIns || this.data.checkIns.length === 0) return 0;
        
        const sortedCheckIns = [...this.data.checkIns].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const checkIn of sortedCheckIns) {
            const checkInDate = new Date(checkIn.date);
            checkInDate.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((currentDate - checkInDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === streak) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (diffDays > streak) {
                break;
            }
        }

        return streak;
    }

    getCravingsToday() {
        if (!this.data.cravings) return 0;
        const today = new Date().toDateString();
        return this.data.cravings.filter(c => 
            new Date(c.date).toDateString() === today
        ).length;
    }

    updateWelcomeMessage(days) {
        const messages = [
            "You're doing amazing! Keep up the great work! 🌟",
            "Every day is a victory. You've got this! 💪",
            "Your commitment is inspiring! Keep going! ✨",
            "One day at a time. You're stronger than you know! 🦋",
            "Progress, not perfection. You're on the right track! 🎯"
        ];
        const message = messages[days % messages.length];
        document.getElementById('welcome-message').textContent = message;
    }

    updateProgress(days) {
        const milestones = [1, 7, 14, 30, 60, 90, 180, 365];
        let nextMilestone = milestones.find(m => m > days) || 365;
        const progress = (days / nextMilestone) * 100;
        
        document.getElementById('progress-fill').style.width = `${Math.min(100, progress)}%`;
        document.getElementById('progress-text').textContent = 
            `${days} days down, ${nextMilestone - days} days to ${nextMilestone}-day milestone!`;
    }

    // Check-in Functions
    async submitCheckIn() {
        if (!this.currentProfileId) {
            alert('Please create or select a profile first.');
            return;
        }

        const moodBtn = document.querySelector('.mood-btn.selected');
        const cravings = document.querySelector('input[name="cravings"]:checked');
        const energyLevel = document.getElementById('energy-level').value;
        const gratitude = document.getElementById('gratitude').value.trim();
        const notes = document.getElementById('notes').value.trim();

        if (!moodBtn || !cravings) {
            alert('Please complete all required fields.');
            return;
        }

        const checkIn = {
            date: new Date().toISOString(),
            mood: moodBtn.dataset.mood,
            cravings: cravings.value,
            energyLevel: parseInt(energyLevel),
            gratitude: gratitude,
            notes: notes
        };

        // Initialize arrays if needed
        if (!this.data.checkIns) this.data.checkIns = [];

        // Check if check-in already exists for today
        const today = new Date().toDateString();
        this.data.checkIns = this.data.checkIns.filter(c => 
            new Date(c.date).toDateString() !== today
        );

        this.data.checkIns.push(checkIn);
        this.data.lastCheckIn = checkIn.date;
        await this.saveData();

        // Reset form
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('input[name="cravings"]').forEach(r => r.checked = false);
        document.getElementById('energy-level').value = 5;
        document.getElementById('energy-value').textContent = 5;
        document.getElementById('gratitude').value = '';
        document.getElementById('notes').value = '';

        alert('Check-in submitted successfully! 🎉');
        this.updateDashboard();
        this.updateRecentActivity();
        this.checkMilestones();
        this.checkAchievements();
    }

    // Craving Functions
    async submitCraving() {
        if (!this.currentProfileId) {
            alert('Please create or select a profile first.');
            return;
        }

        const intensity = document.getElementById('craving-intensity').value;
        const trigger = document.getElementById('trigger-select').value;
        const coping = document.getElementById('coping-strategy').value;
        const notes = document.getElementById('craving-notes').value.trim();

        if (!trigger || !coping) {
            alert('Please fill in all required fields.');
            return;
        }

        const craving = {
            date: new Date().toISOString(),
            intensity: parseInt(intensity),
            trigger: trigger,
            copingStrategy: coping,
            notes: notes
        };

        // Initialize array if needed
        if (!this.data.cravings) this.data.cravings = [];

        this.data.cravings.push(craving);
        await this.saveData();

        // Reset form
        document.getElementById('craving-intensity').value = 5;
        document.getElementById('intensity-value').textContent = 5;
        document.getElementById('trigger-select').value = '';
        document.getElementById('coping-strategy').value = '';
        document.getElementById('craving-notes').value = '';

        alert('Craving logged successfully! 💪');
        this.updateDashboard();
        this.updateCravingsList();
    }

    updateCravingsList() {
        const list = document.getElementById('cravings-list');
        if (!this.data.cravings || this.data.cravings.length === 0) {
            list.innerHTML = '<p class="empty-state">No cravings logged yet.</p>';
            return;
        }

        const sorted = [...this.data.cravings].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        ).slice(0, 10);

        list.innerHTML = sorted.map(craving => {
            const date = new Date(craving.date);
            return `
                <div class="craving-item">
                    <div class="craving-header">
                        <span class="craving-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span class="craving-intensity">Intensity: ${craving.intensity}/10</span>
                    </div>
                    <p><strong>Trigger:</strong> ${this.capitalizeFirst(craving.trigger)}</p>
                    <p><strong>Coping Strategy:</strong> ${this.capitalizeFirst(craving.copingStrategy)}</p>
                    ${craving.notes ? `<p>${craving.notes}</p>` : ''}
                </div>
            `;
        }).join('');
    }

    // Goals Functions
    async addGoal() {
        if (!this.currentProfileId) {
            alert('Please create or select a profile first.');
            return;
        }

        const name = document.getElementById('goal-name').value.trim();
        const days = parseInt(document.getElementById('goal-days').value);

        if (!name || !days || days < 1) {
            alert('Please enter a valid goal name and number of days.');
            return;
        }

        const goal = {
            id: Date.now(),
            name: name,
            targetDays: days,
            createdAt: new Date().toISOString(),
            achieved: false
        };

        // Initialize array if needed
        if (!this.data.goals) this.data.goals = [];

        this.data.goals.push(goal);
        await this.saveData();

        // Reset form
        document.getElementById('goal-name').value = '';
        document.getElementById('goal-days').value = '';

        alert('Goal added successfully! 🎯');
        this.updateGoalsList();
    }

    updateGoalsList() {
        const list = document.getElementById('goals-list');
        if (!this.data.goals || this.data.goals.length === 0) {
            list.innerHTML = '<p class="empty-state">No goals set yet. Add your first goal above!</p>';
            return;
        }

        const daysSober = this.getDaysSober();
        
        list.innerHTML = this.data.goals.map(goal => {
            const progress = Math.min(100, (daysSober / goal.targetDays) * 100);
            const isAchieved = daysSober >= goal.targetDays && !goal.achieved;
            
            if (isAchieved) {
                goal.achieved = true;
                this.saveData(); // Note: async but we don't await here to avoid blocking UI
            }

            return `
                <div class="goal-item">
                    <div class="goal-header">
                        <h4>${goal.name}</h4>
                        <button class="delete-btn" onclick="app.deleteGoal(${goal.id})">Delete</button>
                    </div>
                    <p>Target: ${goal.targetDays} days | Progress: ${daysSober}/${goal.targetDays} days</p>
                    <div class="goal-progress">
                        <div class="goal-progress-bar">
                            <div class="goal-progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    ${goal.achieved ? '<p style="color: var(--secondary-color); font-weight: bold;">✓ Achieved!</p>' : ''}
                </div>
            `;
        }).join('');
    }

    async deleteGoal(id) {
        if (confirm('Are you sure you want to delete this goal?')) {
            if (!this.data.goals) this.data.goals = [];
            this.data.goals = this.data.goals.filter(g => g.id !== id);
            await this.saveData();
            this.updateGoalsList();
        }
    }

    // Milestones & Achievements
    async checkMilestones() {
        if (!this.data) return;
        
        const days = this.getDaysSober();
        const milestoneDays = [1, 3, 7, 14, 30, 60, 90, 180, 365];
        
        if (!this.data.milestones) this.data.milestones = [];

        for (const day of milestoneDays) {
            if (days >= day && !this.data.milestones.includes(day)) {
                this.data.milestones.push(day);
                await this.saveData();
                this.showMilestoneNotification(day);
            }
        }

        this.updateMilestonesDisplay();
    }

    updateMilestonesDisplay() {
        const container = document.getElementById('milestones-list');
        if (!container) return;
        
        const milestoneDays = [1, 3, 7, 14, 30, 60, 90, 180, 365];
        const days = this.getDaysSober();
        const milestones = this.data.milestones || [];

        container.innerHTML = milestoneDays.map(day => {
            const unlocked = milestones.includes(day);
            return `
                <div class="milestone-item ${unlocked ? 'unlocked' : ''}">
                    <div class="milestone-icon">${unlocked ? '🏆' : '🔒'}</div>
                    <h4>${day} Days</h4>
                    ${unlocked ? '<p>Unlocked!</p>' : `<p>${Math.max(0, day - days)} days to go</p>`}
                </div>
            `;
        }).join('');
    }

    async checkAchievements() {
        if (!this.data) return;
        
        const days = this.getDaysSober();
        const streak = this.getCurrentStreak();
        const achievements = [];

        if (!this.data.achievements) this.data.achievements = [];

        // Day achievements
        if (days >= 1 && !this.data.achievements.includes('first_day')) {
            achievements.push({ id: 'first_day', name: 'First Day', desc: 'Completed your first day!' });
            this.data.achievements.push('first_day');
        }
        if (days >= 7 && !this.data.achievements.includes('one_week')) {
            achievements.push({ id: 'one_week', name: 'One Week Strong', desc: 'One week down!' });
            this.data.achievements.push('one_week');
        }
        if (days >= 30 && !this.data.achievements.includes('one_month')) {
            achievements.push({ id: 'one_month', name: 'One Month Champion', desc: '30 days achieved!' });
            this.data.achievements.push('one_month');
        }

        // Streak achievements
        if (streak >= 7 && !this.data.achievements.includes('week_streak')) {
            achievements.push({ id: 'week_streak', name: 'Week Warrior', desc: '7-day check-in streak!' });
            this.data.achievements.push('week_streak');
        }

        // Check-in achievements
        const checkInCount = (this.data.checkIns || []).length;
        if (checkInCount >= 10 && !this.data.achievements.includes('checkin_10')) {
            achievements.push({ id: 'checkin_10', name: 'Consistent', desc: '10 check-ins completed!' });
            this.data.achievements.push('checkin_10');
        }

        if (achievements.length > 0) {
            await this.saveData();
            achievements.forEach(ach => {
                setTimeout(() => {
                    alert(`Achievement Unlocked: ${ach.name} - ${ach.desc} 🏆`);
                }, 500);
            });
        }

        this.updateAchievementsDisplay();
    }

    updateAchievementsDisplay() {
        const container = document.getElementById('achievements-list');
        if (!container) return;
        
        const allAchievements = [
            { id: 'first_day', name: 'First Day', desc: 'Completed your first day!', icon: '🌱' },
            { id: 'one_week', name: 'One Week Strong', desc: 'One week down!', icon: '⭐' },
            { id: 'one_month', name: 'One Month Champion', desc: '30 days achieved!', icon: '👑' },
            { id: 'week_streak', name: 'Week Warrior', desc: '7-day check-in streak!', icon: '🔥' },
            { id: 'checkin_10', name: 'Consistent', desc: '10 check-ins completed!', icon: '📝' }
        ];

        const achievements = this.data.achievements || [];

        container.innerHTML = allAchievements.map(ach => {
            const unlocked = achievements.includes(ach.id);
            return `
                <div class="achievement-item ${unlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon">${unlocked ? ach.icon : '🔒'}</div>
                    <h4>${ach.name}</h4>
                    <p>${ach.desc}</p>
                </div>
            `;
        }).join('');
    }

    showMilestoneNotification(days) {
        setTimeout(() => {
            alert(`🎉 Congratulations! You've reached ${days} days sober! 🎉`);
        }, 500);
    }

    // Motivation Functions
    loadQuotes() {
        this.quotes = [
            "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would.",
            "Every day is a fresh start. Each sunrise is a new beginning.",
            "You are stronger than your addiction. You are braver than your fear.",
            "Small steps every day lead to big changes over time.",
            "Your past doesn't define you. Your strength and courage do.",
            "One day at a time, one moment at a time. That's how recovery works.",
            "You didn't come this far to only come this far.",
            "Recovery is about progress, not perfection.",
            "The hardest part is starting. You've already done that. Keep going.",
            "Every craving that passes makes you stronger for the next one.",
            "You are not alone in this journey. Reach out when you need support.",
            "Healing takes time. Be patient and kind to yourself.",
            "Your future self will thank you for the choices you make today.",
            "Strength doesn't come from what you can do. It comes from overcoming what you once thought you couldn't.",
            "You are worthy of a life free from addiction."
        ];
        this.showRandomQuote();
    }

    showRandomQuote() {
        if (!this.quotes) return;
        const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        const quoteElement = document.getElementById('daily-quote');
        if (quoteElement) {
            quoteElement.textContent = `"${quote}"`;
        }
    }

    // Activity Functions
    updateRecentActivity() {
        const list = document.getElementById('recent-activity-list');
        if (!list) return;
        
        const activities = [];

        // Add recent check-ins
        const checkIns = this.data.checkIns || [];
        const recentCheckIns = [...checkIns]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(c => ({
                type: 'checkin',
                date: c.date,
                text: `Daily check-in - Mood: ${this.capitalizeFirst(c.mood)}`
            }));

        // Add recent cravings
        const cravings = this.data.cravings || [];
        const recentCravings = [...cravings]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(c => ({
                type: 'craving',
                date: c.date,
                text: `Logged craving - Trigger: ${this.capitalizeFirst(c.trigger)}`
            }));

        activities.push(...recentCheckIns, ...recentCravings);
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (activities.length === 0) {
            list.innerHTML = '<p class="empty-state">No activity yet. Start by completing your daily check-in!</p>';
            return;
        }

        list.innerHTML = activities.slice(0, 10).map(activity => {
            const date = new Date(activity.date);
            return `
                <div class="activity-item">
                    <div class="activity-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div>${activity.text}</div>
                </div>
            `;
        }).join('');
    }

    // Utility Functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AddictionApp();
});

// Helper function to view stored data (can be called from browser console)
window.viewStoredData = function() {
    const profiles = JSON.parse(localStorage.getItem('addictionAppProfiles') || '{}');
    const currentProfile = localStorage.getItem('addictionAppCurrentProfile');
    
    console.log('=== Addiction App Data ===');
    console.log('Current Profile ID:', currentProfile);
    console.log('Number of Profiles:', Object.keys(profiles).length);
    console.log('\nAll Profiles:', profiles);
    
    if (currentProfile && profiles[currentProfile]) {
        console.log('\nCurrent Profile Data:', profiles[currentProfile]);
    }
    
    return {
        currentProfile,
        profiles,
        currentProfileData: currentProfile ? profiles[currentProfile] : null
    };
};

// Helper function to export data as JSON
window.exportData = function() {
    const profiles = JSON.parse(localStorage.getItem('addictionAppProfiles') || '{}');
    const currentProfile = localStorage.getItem('addictionAppCurrentProfile');
    
    const exportData = {
        exportedAt: new Date().toISOString(),
        currentProfile,
        profiles
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `addiction-app-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('Data exported successfully!');
    return exportData;
};
