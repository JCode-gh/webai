<template>
  <div class="universal-route">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8">
      <div class="loading-spinner w-12 h-12 border-4 border-white border-opacity-30 border-t-white rounded-full mb-6"></div>
      <h2 class="text-2xl font-semibold mb-3 text-center">🎨 Generating AI-powered webpage...</h2>
      <p class="text-white text-opacity-90 mb-2 text-center">Creating content for: <strong>{{ currentRoute }}</strong></p>
      <p class="text-white text-opacity-75 mb-8 text-center text-sm">Using model: <strong>{{ $route.query.model || 'openai' }}</strong></p>
      <div class="w-72 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
        <div class="loading-progress h-full bg-white bg-opacity-80 rounded-full"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white p-8">
      <div class="text-6xl mb-6">⚠️</div>
      <h2 class="text-2xl font-semibold mb-4 text-center">Oops! Something went wrong</h2>
      <p class="text-white text-opacity-90 mb-8 text-center max-w-md">{{ error }}</p>
      <button @click="retryGeneration" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
        🔄 Try Again
      </button>
    </div>

    <!-- Generated Content -->
    <div v-else class="content-container min-h-screen">
      <!-- AI Generated HTML Content -->
      <div 
        v-html="htmlContent" 
        class="generated-content min-h-screen"
        @click="handleContentClick"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'UniversalRoute',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const error = ref(null)
    const htmlContent = ref('')
    const currentRoute = ref('')

    const fetchWebsiteForRoute = async (routePath) => {
      try {
        loading.value = true
        error.value = null

        // Get model from query parameters
        const modelParam = route.query.model || 'openai' // Default to openai model

        // Determine the prompt based on route
        let prompt
        const randomSeed = Math.floor(Math.random() * 1000000)
        const timestamp = Date.now()
        
        if (routePath === '/' || routePath === '') {
          prompt = 'Create a comprehensive, full-featured HTML homepage using Tailwind CSS. This must be a complete, production-ready website with substantial content. Include the Tailwind CSS CDN link in the head section. REQUIREMENTS: Must include ALL of the following sections: 1) Professional navigation header with logo and menu items, 2) Hero section with compelling headline, subheadline, and call-to-action buttons, 3) About/Company section with detailed description, 4) Services/Features section with at least 4-6 service cards, 5) Testimonials section with multiple customer reviews, 6) Portfolio/Projects showcase, 7) Team section with staff profiles, 8) FAQ section with common questions, 9) Contact section with form and contact details, 10) Comprehensive footer with links, social media, and company info. Each section should be fully populated with realistic, detailed content - not placeholder text. Use modern Tailwind utility classes for professional styling. Include proper meta tags and viewport settings. IMPORTANT: All navigation links, footer links, and any other internal links must use proper routing paths like /about, /services, /contact, /portfolio, /blog, etc. Do not use # or external URLs for internal navigation. Return only clean HTML code without any explanations, markdown formatting, or commentary. Unique ID: ' + randomSeed + '-' + timestamp
        } else {
          const pageName = routePath.replace('/', '').replace(/[-_]/g, ' ')
          prompt = 'Create a comprehensive, full-featured HTML ' + pageName + ' page using Tailwind CSS. This must be a complete, production-ready page with substantial content relevant to ' + pageName + '. Include the Tailwind CSS CDN link in the head section. REQUIREMENTS: Must include ALL of the following sections: 1) Professional navigation header matching the site theme, 2) Page hero/banner section with relevant headline, 3) Detailed main content section with comprehensive information about ' + pageName + ', 4) Multiple sub-sections breaking down different aspects of ' + pageName + ', 5) Call-to-action sections, 6) Related services or features section, 7) FAQ or common questions about ' + pageName + ', 8) Contact or next steps section, 9) Comprehensive footer. Each section must be fully populated with realistic, detailed, and relevant content - not placeholder text. The page should feel like a real, professional website page. Use modern Tailwind utility classes for professional styling. Include proper navigation, main content sections, and footer. IMPORTANT: All navigation links, footer links, and any other internal links must use proper routing paths like /home, /about, /services, /contact, /portfolio, /blog, etc. Do not use # or external URLs for internal navigation. Return only clean HTML code without any explanations, markdown formatting, or commentary. Unique ID: ' + randomSeed + '-' + timestamp
        }

        const encodedPrompt = encodeURIComponent(prompt)
        const url = `https://text.pollinations.ai/${encodedPrompt}?model=${modelParam}`

        console.log('Fetching content for route:', routePath)
        console.log('Using model:', modelParam)
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
        const tailwindCDN = '<script src="https://cdn.tailwindcss.com"><\/script>'
        if (cleaned.includes('<head>')) {
          cleaned = cleaned.replace('<head>', '<head>\n    ' + tailwindCDN)
        } else if (cleaned.includes('<!DOCTYPE html>')) {
          const htmlWrapper = '<!DOCTYPE html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    ' + tailwindCDN + '\n</head>\n<body>\n' + cleaned + '\n</body>\n</html>'
          cleaned = htmlWrapper
        }
      }
      
      // Ensure full height styling
      const fullHeightStyle = '<style>html, body { height: 100%; min-height: 100vh; margin: 0; padding: 0; }</style>'
      if (cleaned.includes('<head>')) {
        cleaned = cleaned.replace('<head>', '<head>\n    ' + fullHeightStyle)
      } else {
        cleaned = fullHeightStyle + cleaned
      }
      
      // Fallback: ensure basic styling if no Tailwind classes detected
      if (!cleaned.includes('class=') && !cleaned.includes('<style>')) {
        const fallbackStyle = '\n          <style>\n            body { font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }\n            h1, h2, h3 { color: #333; margin-bottom: 16px; }\n            p { margin-bottom: 16px; color: #666; }\n            .container { max-width: 1200px; margin: 0 auto; }\n          </style>\n          ' + cleaned
        cleaned = fallbackStyle
      }
      
      return cleaned.trim()
    }

    const generateFallbackContent = (routePath) => {
      const pageName = routePath === '/' ? 'Home' : routePath.replace('/', '').replace(/[-_]/g, ' ')
      
      return '<div style="padding: 40px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">' +
        '<h1 style="color: #667eea; margin-bottom: 20px;">🚧 ' + pageName + ' Page</h1>' +
        '<p style="color: #666; font-size: 18px; margin-bottom: 30px;">This page is temporarily unavailable. The AI service might be experiencing issues.</p>' +
        '<div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin: 20px 0;">' +
        '<h2 style="color: #333;">About This Route: ' + routePath + '</h2>' +
        '<p>This content would normally be generated by AI based on the current route.</p>' +
        '</div>' +
        '<button onclick="window.location.reload()" style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; transition: background 0.3s ease;">🔄 Reload Page</button>' +
        '</div>'
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
          router.push(href)
        } else if (href && (href.startsWith('http') || href.startsWith('mailto'))) {
          // Open external links in new tab
          window.open(href, '_blank')
        }
      }
    }

    // Watch for route changes (path and query parameters)
    watch(
      () => [route.path, route.query.model],
      ([newPath, newModel]) => {
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

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-progress {
  animation: loading 2s ease-in-out infinite;
}

@keyframes loading {
  0% { width: 0%; }
  50% { width: 100%; }
  100% { width: 0%; }
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
  min-height: 100vh !important;
}

.generated-content :deep(html) {
  height: 100% !important;
}

.generated-content :deep(a) {
  cursor: pointer;
}
</style>
