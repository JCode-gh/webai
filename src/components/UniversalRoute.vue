<template>
  <div class="universal-route">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <h2>🎨 Generating AI-powered webpage...</h2>
      <p>Creating content for: <strong>{{ currentRoute }}</strong></p>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Oops! Something went wrong</h2>
      <p class="error-message">{{ error }}</p>
      <button @click="retryGeneration" class="retry-button">
        🔄 Try Again
      </button>
    </div>

    <!-- Generated Content -->
    <div v-else class="content-container">
      <!-- AI Generated HTML Content -->
      <div 
        v-html="htmlContent" 
        class="generated-content"
        @click="handleContentClick"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'UniversalRoute',
  setup() {
    const route = useRoute()
    const loading = ref(false)
    const error = ref(null)
    const htmlContent = ref('')
    const currentRoute = ref('')

    const fetchWebsiteForRoute = async (routePath) => {
      try {
        loading.value = true
        error.value = null

        // Determine the prompt based on route
        let prompt
        const randomSeed = Math.floor(Math.random() * 1000000)
        const timestamp = Date.now()
        
        if (routePath === '/' || routePath === '') {
          prompt = `Create a complete HTML homepage using Tailwind CSS. Include the Tailwind CSS CDN link in the head section. Design should be modern, professional, and responsive with: navigation header, hero section, features/services section, testimonials, and footer. Use Tailwind utility classes for styling. Include proper meta tags and viewport settings. Return only clean HTML code without any explanations, markdown formatting, or commentary. Unique ID: ${randomSeed}-${timestamp}`
        } else {
          const pageName = routePath.replace('/', '').replace(/[-_]/g, ' ')
          prompt = `Create a complete HTML ${pageName} page using Tailwind CSS. Include the Tailwind CSS CDN link in the head section. Design should be modern, professional, and responsive with relevant content for ${pageName}. Use Tailwind utility classes for styling. Include proper navigation, main content sections, and footer. Include proper meta tags and viewport settings. Return only clean HTML code without any explanations, markdown formatting, or commentary. Unique ID: ${randomSeed}-${timestamp}`
        }

        const encodedPrompt = encodeURIComponent(prompt)
        const url = `https://text.pollinations.ai/${encodedPrompt}`

        console.log('Fetching content for route:', routePath)
        console.log('API URL:', url)

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const generatedHtml = await response.text()
        
        if (!generatedHtml || generatedHtml.trim() === '') {
          throw new Error('Received empty response from AI service')
        }

        // Clean and enhance the generated HTML
        const cleanedHtml = cleanGeneratedHtml(generatedHtml)
        
        htmlContent.value = cleanedHtml
        
      } catch (err) {
        console.error('Error fetching website:', err)
        error.value = `Failed to generate webpage: ${err.message}`
        
        // Fallback content
        htmlContent.value = generateFallbackContent(routePath)
        
      } finally {
        loading.value = false
      }
    }

    const cleanGeneratedHtml = (html) => {
      // Remove any potential script tags for security
      let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      
      // Remove unwanted text patterns that might be added by the AI
      cleaned = cleaned.replace(/^.*?Here's.*?```html\s*/i, '')
      cleaned = cleaned.replace(/```\s*.*$/i, '')
      cleaned = cleaned.replace(/^.*?Certainly!.*?:\s*/i, '')
      cleaned = cleaned.replace(/This page features.*$/i, '')
      cleaned = cleaned.replace(/Feel free to customize.*$/i, '')
      cleaned = cleaned.replace(/^\s*```html\s*/i, '')
      cleaned = cleaned.replace(/```\s*$/i, '')
      
      // Clean up any remaining unwanted prefixes/suffixes
      cleaned = cleaned.replace(/^[^<]*(?=<)/i, '') // Remove text before first HTML tag
      cleaned = cleaned.replace(/>([^<]*$)/i, '>') // Remove text after last HTML tag
      
      // Ensure Tailwind CSS is included if not already present
      if (!cleaned.includes('tailwindcss.com') && !cleaned.includes('tailwind')) {
        // Add Tailwind CSS CDN to the head if missing
        const tailwindCDN = '<script src="https://cdn.tailwindcss.com"></script>'
        if (cleaned.includes('<head>')) {
          cleaned = cleaned.replace('<head>', `<head>\n    ${tailwindCDN}`)
        } else if (cleaned.includes('<!DOCTYPE html>')) {
          const htmlWrapper = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${tailwindCDN}
</head>
<body>
${cleaned}
</body>
</html>`
          cleaned = htmlWrapper
        }
      }
      
      // Fallback: ensure basic styling if no Tailwind classes detected
      if (!cleaned.includes('class=') && !cleaned.includes('<style>')) {
        const fallbackStyle = `
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
            h1, h2, h3 { color: #333; margin-bottom: 16px; }
            p { margin-bottom: 16px; color: #666; }
            .container { max-width: 1200px; margin: 0 auto; }
          </style>
          ${cleaned}`
        cleaned = fallbackStyle
      }
      
      return cleaned.trim()
    }

    const generateFallbackContent = (routePath) => {
      const pageName = routePath === '/' ? 'Home' : routePath.replace('/', '').replace(/[-_]/g, ' ')
      
      return `
        <div style="padding: 40px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h1 style="color: #667eea; margin-bottom: 20px;">🚧 ${pageName} Page</h1>
          <p style="color: #666; font-size: 18px; margin-bottom: 30px;">
            This page is temporarily unavailable. The AI service might be experiencing issues.
          </p>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin: 20px 0;">
            <h2 style="color: #333;">About This Route: ${routePath}</h2>
            <p>This content would normally be generated by AI based on the current route.</p>
          </div>
          <button onclick="window.location.reload()" style="
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s ease;
          ">
            🔄 Reload Page
          </button>
        </div>
      `
    }

    const retryGeneration = () => {
      fetchWebsiteForRoute(currentRoute.value)
    }

    const handleContentClick = (event) => {
      // Prevent navigation for links in generated content
      if (event.target.tagName === 'A') {
        event.preventDefault()
        const href = event.target.getAttribute('href')
        if (href && href.startsWith('/')) {
          // Navigate using Vue Router
          route.push(href)
        } else if (href && (href.startsWith('http') || href.startsWith('mailto'))) {
          // Open external links in new tab
          window.open(href, '_blank')
        }
      }
    }

    // Watch for route changes
    watch(
      () => route.path,
      (newPath) => {
        currentRoute.value = newPath
        fetchWebsiteForRoute(newPath)
      },
      { immediate: true }
    )

    onMounted(() => {
      currentRoute.value = route.path
      fetchWebsiteForRoute(route.path)
    })

    return {
      loading,
      error,
      htmlContent,
      currentRoute,
      retryGeneration,
      handleContentClick
    }
  }
}
</script>

<style scoped>
.universal-route {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container h2 {
  color: white;
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.loading-container p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
}

.loading-bar {
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  animation: loading 2s ease-in-out infinite;
}

@keyframes loading {
  0% { width: 0%; }
  50% { width: 100%; }
  100% { width: 0%; }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-container h2 {
  color: white;
  margin-bottom: 15px;
}

.error-message {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  max-width: 500px;
}

.retry-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.content-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.generated-content {
  width: 100%;
  min-height: 100vh;
  overflow-x: auto;
}

/* Override styles for generated content */
.generated-content :deep(body) {
  margin: 0 !important;
  padding: 0 !important;
}

.generated-content :deep(a) {
  cursor: pointer;
}

@media (max-width: 768px) {
  .loading-bar {
    width: 250px;
  }
  
  .loading-container h2 {
    font-size: 1.3rem;
  }
}
</style>
