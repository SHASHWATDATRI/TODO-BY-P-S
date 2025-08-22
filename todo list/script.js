// Todo App JavaScript
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.renderTodos();
        this.updateStats();
        this.updateActionsVisibility();
        
        // Start real-time updates for time information
        this.startTimeUpdates();
        
        // Check if custom image theme was previously set
        if (this.currentTheme === 'custom-image') {
            this.applyCustomImageBackground();
        }
    }

    setupEventListeners() {
        // Form submission
        const todoForm = document.getElementById('todo-form');
        todoForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Clear buttons
        const clearCompletedBtn = document.getElementById('clear-completed');
        const clearAllBtn = document.getElementById('clear-all');
        
        clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        clearAllBtn.addEventListener('click', () => this.clearAll());

        // Input focus and validation
        const todoInput = document.getElementById('todo-input');
        todoInput.addEventListener('input', (e) => this.handleInput(e));
        todoInput.addEventListener('keypress', (e) => this.handleKeyPress(e));

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Anime theme toggle
        const animeToggle = document.getElementById('anime-toggle');
        animeToggle.addEventListener('click', () => this.toggleAnimeTheme());
        
        // Image theme toggle and upload
        const imageToggle = document.getElementById('image-toggle');
        const imageUpload = document.getElementById('image-upload');
        
        imageToggle.addEventListener('click', () => this.toggleImageTheme());
        imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('todo-input');
        const text = input.value.trim();
        
        if (text) {
            this.addTodo(text);
            input.value = '';
            input.focus();
        }
    }

    handleInput(e) {
        const input = e.target;
        const addBtn = document.querySelector('.add-btn');
        
        if (input.value.trim()) {
            addBtn.style.opacity = '1';
            addBtn.style.transform = 'scale(1)';
        } else {
            addBtn.style.opacity = '0.7';
            addBtn.style.transform = 'scale(0.95)';
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.target.blur();
        }
    }

    handleFilterClick(e) {
        const clickedBtn = e.target;
        const filter = clickedBtn.dataset.filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedBtn.classList.add('active');
        
        this.currentFilter = filter;
        this.renderTodos();
    }

    addTodo(text) {
        const nameInput = document.getElementById('name-input');
        const deadlineInput = document.getElementById('deadline-input');
        const name = nameInput.value.trim() || 'Anonymous';
        const deadline = deadlineInput.value ? new Date(deadlineInput.value).toISOString() : null;
        
        const todo = {
            id: Date.now(),
            text: text,
            name: name,
            completed: false,
            createdAt: new Date().toISOString(),
            deadline: deadline,
            completedAt: null,
            timeSpent: null
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.updateActionsVisibility();
        
        // Clear inputs
        deadlineInput.value = '';
        nameInput.value = '';
        
        // Show success animation
        this.showNotification('Todo added successfully!', 'success');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            
            if (todo.completed) {
                todo.completedAt = new Date().toISOString();
                // Calculate time spent
                const created = new Date(todo.createdAt);
                const completed = new Date(todo.completedAt);
                todo.timeSpent = completed - created;
            } else {
                todo.completedAt = null;
                todo.timeSpent = null;
            }
            
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.updateActionsVisibility();
            
            const message = todo.completed ? 'Todo completed!' : 'Todo marked as pending';
            this.showNotification(message, 'info');
        }
    }

    deleteTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.updateActionsVisibility();
            
            this.showNotification('Todo deleted!', 'warning');
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount > 0) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.updateActionsVisibility();
            
            this.showNotification(`${completedCount} completed todos cleared!`, 'info');
        }
    }

    clearAll() {
        if (this.todos.length > 0) {
            if (confirm('Are you sure you want to delete all todos?')) {
                const totalCount = this.todos.length;
                this.todos = [];
                this.saveTodos();
                this.renderTodos();
                this.updateStats();
                this.updateActionsVisibility();
                
                this.showNotification(`All ${totalCount} todos cleared!`, 'warning');
            }
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todo-list');
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            return;
        }

        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''} ${this.isOverdue(todo) ? 'overdue' : ''}" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="todoApp.toggleTodo(${todo.id})"
                >
                <div class="todo-content">
                    <div class="todo-header">
                        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                        <span class="todo-author">by ${this.escapeHtml(todo.name)}</span>
                    </div>
                    <div class="todo-time-info">
                        <div class="time-item">
                            <i class="fas fa-clock"></i>
                            <span>Created: ${this.formatDate(todo.createdAt)}</span>
                        </div>
                        ${todo.deadline ? `
                            <div class="time-item ${this.isOverdue(todo) ? 'overdue' : ''}">
                                <i class="fas fa-calendar-times"></i>
                                <span>Deadline: ${this.formatDate(todo.deadline)}</span>
                                ${!todo.completed ? `<span class="time-duration">${this.getTimeUntilDeadline(todo)}</span>` : ''}
                            </div>
                        ` : ''}
                        ${todo.completed ? `
                            <div class="time-item completed">
                                <i class="fas fa-check-circle"></i>
                                <span>Completed: ${this.formatDate(todo.completedAt)}</span>
                            </div>
                            ${todo.timeSpent ? `
                                <div class="time-item completed">
                                    <i class="fas fa-hourglass-half"></i>
                                    <span>Time taken: <span class="time-duration">${this.formatDuration(todo.timeSpent)}</span></span>
                                </div>
                            ` : ''}
                        ` : ''}
                    </div>
                </div>
                <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})" title="Delete todo">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;
        const overdue = this.todos.filter(t => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length;

        document.getElementById('total-todos').textContent = total;
        document.getElementById('completed-todos').textContent = completed;
        document.getElementById('pending-todos').textContent = pending;
        document.getElementById('overdue-todos').textContent = overdue;
    }

    updateActionsVisibility() {
        const actionsDiv = document.getElementById('todo-actions');
        const hasTodos = this.todos.length > 0;
        const hasCompleted = this.todos.some(t => t.completed);

        if (hasTodos) {
            actionsDiv.style.display = 'flex';
        } else {
            actionsDiv.style.display = 'none';
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

        // Add button styles
        const closeBtn = notification.querySelector('button');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    toggleTheme() {
        if (this.currentTheme === 'anime') {
            this.currentTheme = 'light';
        } else {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        }
        this.applyTheme();
        this.saveTheme();
        
        const message = this.currentTheme === 'dark' ? 'Dark mode enabled!' : 'Light mode enabled!';
        this.showNotification(message, 'info');
    }

    toggleAnimeTheme() {
        this.currentTheme = 'anime';
        this.applyTheme();
        this.saveTheme();
        
        this.showNotification('Jujutsu Kaisen theme enabled! 🧙‍♂️⚡', 'success');
    }

    toggleImageTheme() {
        // Trigger file upload
        document.getElementById('image-upload').click();
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                this.setCustomImageTheme(imageData);
            };
            reader.readAsDataURL(file);
        }
    }

    setCustomImageTheme(imageData) {
        this.currentTheme = 'custom-image';
        
        // Store the image data
        localStorage.setItem('customImage', imageData);
        
        // Apply the theme with custom image
        this.applyTheme();
        this.saveTheme();
        
        this.showNotification('Custom image theme enabled! 🖼️✨', 'success');
    }

    applyCustomImageBackground() {
        const customImage = localStorage.getItem('customImage');
        if (customImage) {
            // Set CSS custom property for the image
            document.documentElement.style.setProperty('--custom-image-bg', `url(${customImage})`);
            
            // Apply background image to body
            document.body.style.backgroundImage = `url(${customImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
        }
    }

    applyTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const animeToggle = document.getElementById('anime-toggle');
        const imageToggle = document.getElementById('image-toggle');
        const themeIcon = themeToggle.querySelector('i');
        const animeIcon = animeToggle.querySelector('i');
        const imageIcon = imageToggle.querySelector('i');
        
        // Remove all theme attributes first
        body.removeAttribute('data-theme');
        
        // Reset all toggle button styles
        animeToggle.style.background = '';
        animeToggle.style.borderColor = '';
        imageToggle.style.background = '';
        imageToggle.style.borderColor = '';
        
        if (this.currentTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            themeToggle.title = 'Switch to light mode';
            animeToggle.title = 'Switch to anime mode';
            imageToggle.title = 'Set custom image theme';
        } else if (this.currentTheme === 'anime') {
            body.setAttribute('data-theme', 'anime');
            themeIcon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to light mode';
            animeToggle.title = 'Switch to dark mode';
            imageToggle.title = 'Set custom image theme';
        } else if (this.currentTheme === 'custom-image') {
            body.setAttribute('data-theme', 'custom-image');
            themeIcon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to light mode';
            animeToggle.title = 'Switch to anime mode';
            imageToggle.title = 'Change custom image';
            
            // Apply custom image background
            this.applyCustomImageBackground();
        } else {
            // Light theme
            body.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to dark mode';
            animeToggle.title = 'Switch to anime mode';
            imageToggle.title = 'Set custom image theme';
        }
        
        // Update toggle button icons and styles based on current theme
        if (this.currentTheme === 'anime') {
            animeIcon.className = 'fas fa-magic';
            animeToggle.style.background = 'rgba(124, 58, 237, 0.6)';
            animeToggle.style.borderColor = 'rgba(124, 58, 237, 0.8)';
        } else {
            animeIcon.className = 'fas fa-star';
        }
        
        if (this.currentTheme === 'custom-image') {
            imageIcon.className = 'fas fa-image';
            imageToggle.style.background = 'rgba(34, 197, 94, 0.6)';
            imageToggle.style.borderColor = 'rgba(34, 197, 94, 0.8)';
        } else {
            imageIcon.className = 'fas fa-image';
        }
    }

    saveTheme() {
        localStorage.setItem('theme', this.currentTheme);
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    formatDuration(milliseconds) {
        if (!milliseconds) return '';
        
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    isOverdue(todo) {
        return !todo.completed && todo.deadline && new Date(todo.deadline) < new Date();
    }

    getTimeUntilDeadline(todo) {
        if (!todo.deadline || todo.completed) return '';
        
        const now = new Date();
        const deadline = new Date(todo.deadline);
        const diff = deadline - now;
        
        if (diff < 0) {
            return 'Overdue';
        }
        
        return this.formatDuration(diff);
    }

    startTimeUpdates() {
        // Update time information every minute
        setInterval(() => {
            this.updateStats();
            // Re-render todos to update time displays
            if (this.todos.some(t => t.deadline && !t.completed)) {
                this.renderTodos();
            }
        }, 60000); // Update every minute
    }
}

// Initialize the app when DOM is loaded
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
    
    // Add some sample todos if none exist
    if (todoApp.todos.length === 0) {
        setTimeout(() => {
            todoApp.addTodo('Welcome to your Todo App!');
            
            // Add a todo with deadline
            const deadlineInput = document.getElementById('deadline-input');
            const futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + 2);
            deadlineInput.value = futureDate.toISOString().slice(0, 16);
            todoApp.addTodo('Complete this task within 2 hours');
            
            todoApp.addTodo('Click the checkbox to mark as complete');
            todoApp.addTodo('Use filters to organize your tasks');
        }, 1000);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'n':
                e.preventDefault();
                document.getElementById('name-input').focus();
                break;
            case 'o':
                e.preventDefault();
                document.getElementById('todo-input').focus();
                break;
            case 'f':
                e.preventDefault();
                document.querySelector('[data-filter="all"]').click();
                break;
            case 't':
                e.preventDefault();
                document.getElementById('theme-toggle').click();
                break;
            case 'a':
                e.preventDefault();
                document.getElementById('anime-toggle').click();
                break;
            case 'i':
                e.preventDefault();
                document.getElementById('image-toggle').click();
                break;
        }
    }
    
    // Escape key to clear input
    if (e.key === 'Escape') {
        const input = document.getElementById('todo-input');
        if (input === document.activeElement) {
            input.value = '';
            input.blur();
        }
    }
});

// Add some helpful tooltips
document.addEventListener('DOMContentLoaded', () => {
    // Add tooltip to name input
    const nameInput = document.getElementById('name-input');
    nameInput.title = 'Press Ctrl+N to focus here quickly';
    
    // Add tooltip to todo input
    const input = document.getElementById('todo-input');
    input.title = 'Press Ctrl+O to focus here quickly';
    
    // Add tooltip to filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        const filter = btn.dataset.filter;
        switch (filter) {
            case 'all':
                btn.title = 'Show all todos (Ctrl+F)';
                break;
            case 'active':
                btn.title = 'Show only pending todos';
                break;
            case 'completed':
                btn.title = 'Show only completed todos';
                break;
        }
    });

    // Add tooltip to theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.title = 'Toggle dark mode (Ctrl+T)';
    
    // Add tooltip to anime toggle
    const animeToggle = document.getElementById('anime-toggle');
    animeToggle.title = 'Toggle anime mode (Ctrl+A)';
    
    // Add tooltip to image toggle
    const imageToggle = document.getElementById('image-toggle');
    imageToggle.title = 'Set custom image theme (Ctrl+I)';
});
