# AI Website Generator

A Vue 3 application that dynamically generates webpages using Pollinations AI based on the current route.

## Features

- 🤖 **AI-Powered Content Generation**: Uses Pollinations AI to generate complete webpages
- 🔄 **Universal Route Handling**: Handles any route dynamically
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Loading**: Includes loading states and caching
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔄 **Content Regeneration**: Ability to regenerate content for any route
- 📋 **Error Handling**: Graceful error handling with fallback content

## How It Works

1. **Route Navigation**: When you navigate to any route (e.g., `/about`, `/contact`, `/services`)
2. **API Call**: The app makes a GET request to `https://text.pollinations.ai/{prompt}`
3. **Content Generation**: The AI generates a complete HTML webpage based on the route
4. **Display**: The generated HTML is displayed using Vue's `v-html` directive
5. **Caching**: Generated content is cached to avoid repeated API calls

## API Integration

The application uses the Pollinations Text-To-Text API:

```javascript
const fetchWebsiteForRoute = async (routePath) => {
  const prompt = `Generate a complete webpage in HTML code for the route: ${routePath}`;
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://text.pollinations.ai/${encodedPrompt}`;
  
  const response = await fetch(url);
  const htmlCode = await response.text();
  return htmlCode;
};
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Usage

1. **Homepage**: Visit `/` to see an AI-generated homepage
2. **Any Route**: Navigate to any route like `/about`, `/contact`, `/services`, `/blog`
3. **Custom Routes**: Try creative routes like `/portfolio`, `/pricing`, `/team`
4. **Regenerate**: Use the regenerate button to get new AI-generated content
5. **Navigation**: Use the header navigation or manually type routes in the URL

## Project Structure

```
src/
├── components/
│   ├── Header.vue          # Navigation header
│   └── UniversalRoute.vue  # Main component handling AI generation
├── App.vue                 # Root component
└── main.js                 # Application entry point
```

## Key Features Explained

### Universal Route Handling
The router uses a catch-all pattern (`/:pathMatch(.*)*`) to handle any route dynamically.

### AI Content Generation
- **Homepage**: Special prompt for generating homepage content
- **Other Routes**: Generates content based on route name (e.g., `/contact` → "Contact page")
- **Intelligent Prompts**: Context-aware prompts for better content generation

### Caching System
Generated content is cached in memory to avoid redundant API calls for the same route.

### Security Features
- Script tags are removed from generated HTML for security
- External links open in new tabs
- Internal links use Vue Router navigation

### Error Handling
- Loading states with animated spinners
- Error messages with retry functionality
- Fallback content when API is unavailable

## Customization

### Modify AI Prompts
Edit the prompt generation logic in `UniversalRoute.vue`:

```javascript
// For homepage
if (routePath === '/' || routePath === '') {
  prompt = 'Your custom homepage prompt here';
} else {
  prompt = `Your custom prompt for ${routePath}`;
}
```

### Styling
The application uses scoped CSS with a modern gradient design. Customize colors and styles in the respective `.vue` components.

### Add More Navigation Links
Add more navigation links in `Header.vue`:

```html
<router-link to="/your-route" class="nav-link">Your Page</router-link>
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations

- Generated content depends on Pollinations AI availability
- Some complex interactive features might not work in generated HTML
- Content quality varies based on AI service performance

## Contributing

Feel free to contribute by:
- Adding new features
- Improving error handling
- Enhancing the UI/UX
- Optimizing performance

## License

This project is open source and available under the MIT License.
