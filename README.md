# Todo Application

A modern, responsive todo application built with vanilla JavaScript, HTML, and CSS. This application provides a clean and intuitive interface for managing your daily tasks.

## Features

### ✨ Core Functionality
- **Add Todos**: Create new tasks with a simple input form, optional names, and optional deadlines
- **Mark Complete**: Check off completed tasks with smooth animations
- **Delete Todos**: Remove individual tasks or clear all at once
- **Filter Views**: Switch between All, Active, and Completed tasks
- **Statistics**: Real-time count of total, completed, pending, and overdue todos
- **Time Tracking**: Monitor creation time, completion time, time spent, and deadlines
- **User Attribution**: Track who created each task with personalized names

### 🎨 User Experience
- **Modern Design**: Beautiful gradient background with glassmorphism effects
- **Multiple Themes**: Light, dark, Jujutsu Kaisen, and custom image themes with persistent preference
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Visual Feedback**: Success notifications and hover states
- **Accessibility**: Keyboard shortcuts and focus management

### 💾 Data Persistence
- **Local Storage**: Todos are automatically saved to your browser
- **Session Persistence**: Your tasks remain even after closing the browser
- **Data Integrity**: Safe handling of special characters and HTML

### ⌨️ Keyboard Shortcuts
- `Ctrl + N`: Focus on the name input field
- `Ctrl + O`: Focus on the todo input field
- `Ctrl + F`: Reset to "All" filter view
- `Ctrl + T`: Toggle dark/light mode
- `Ctrl + A`: Toggle anime mode
- `Ctrl + I`: Set custom image theme
- `Enter`: Submit a new todo
- `Escape`: Clear the input field

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Start typing in the input field to add your first todo
3. Press Enter or click the + button to add the todo

### Managing Todos
- **Complete a Todo**: Click the checkbox next to any todo
- **Delete a Todo**: Hover over a todo and click the trash icon
- **Filter Todos**: Use the filter buttons (All, Active, Completed)
- **Set Deadlines**: Use the datetime picker to set task deadlines
- **Clear Completed**: Remove all completed todos at once
- **Clear All**: Remove all todos (with confirmation)

### Understanding the Interface
- **Header**: App title, description, and theme toggle buttons (dark mode, Jujutsu Kaisen mode, and custom image mode)
- **Input Section**: Add new todos with optional name and deadline setting
- **Statistics**: Shows counts of total, completed, pending, and overdue todos
- **Filters**: Switch between different views of your todos
- **Todo List**: Your actual tasks with detailed time information and creator attribution
- **Actions**: Bulk operations for managing todos

## Technical Details

### Architecture
- **Class-based JavaScript**: Organized using ES6 classes for maintainability
- **Event-driven**: Responsive to user interactions with proper event handling
- **Modular Design**: Separated concerns between HTML, CSS, and JavaScript

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features supported
- Local Storage API required
- CSS Grid and Flexbox for layout

### Performance Features
- Efficient DOM manipulation
- Debounced input handling
- Optimized rendering with minimal reflows
- Local storage for data persistence

## File Structure

```
todo-list/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- Adjust the gradient background in the body selector
- Customize button colors and hover effects

### Functionality
- Add new features in `script.js` by extending the TodoApp class
- Implement additional filters or sorting options
- Add categories or priority levels to todos

### Localization
- Update text content in `index.html` and `script.js`
- Modify placeholder text and button labels
- Adjust date/time formatting if needed

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES6 Classes | ✅ | ✅ | ✅ | ✅ |
| Local Storage | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |
| CSS Animations | ✅ | ✅ | ✅ | ✅ |

## Future Enhancements

Potential features that could be added:
- **Categories/Tags**: Organize todos by project or priority
- **Due Dates**: Set deadlines for tasks
- **Search Functionality**: Find specific todos quickly
- **Export/Import**: Backup and restore your todo list
- **Dark Mode**: Toggle between light and dark themes
- **Drag & Drop**: Reorder todos by priority
- **Subtasks**: Break down complex todos into smaller parts

## Contributing

Feel free to enhance this application by:
1. Adding new features
2. Improving the design
3. Optimizing performance
4. Adding accessibility improvements
5. Creating additional themes

## License

This project is open source and available under the MIT License.

---

**Enjoy organizing your tasks with this beautiful and functional todo application!** 🎉
