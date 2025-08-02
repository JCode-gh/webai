<template>
  <div class="universal-route">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8">
  
      <h2 class="text-2xl font-semibold mb-3 text-center">🎨 Generating AI-powered webpage...</h2>
      <p class="text-white text-opacity-90 mb-2 text-center">Creating content for: <strong>{{ currentRoute }}</strong></p>
      <p class="text-white text-opacity-75 mb-2 text-center text-sm">Using model: <strong>{{ $route.query.model || 'openai' }}</strong></p>
      <p v-if="currentAttempt > 1" class="text-white text-opacity-70 mb-2 text-center text-sm">🔄 Retry attempt: <strong>{{ currentAttempt }}/{{ maxRetries }}</strong></p>
      <p class="text-white text-opacity-60 mb-8 text-center text-sm">⏱️ Generation time: <strong>{{ generationTime }}s</strong></p>
      <div class="w-72 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden mb-6">
        <div class="loading-progress h-full bg-white bg-opacity-80 rounded-full"></div>
      </div>
      <button @click="changeModel" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm">
        🔄 Change Model
      </button>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white p-8">
      <div class="text-6xl mb-6">⚠️</div>
      <h2 class="text-2xl font-semibold mb-4 text-center">Oops! Something went wrong</h2>
      <p class="text-white text-opacity-90 mb-4 text-center max-w-md">{{ error }}</p>
      <p v-if="currentAttempt > 1" class="text-white text-opacity-70 mb-8 text-center text-sm">
        Attempted {{ currentAttempt }} times with {{ generationTime }}s total
      </p>
      <button @click="retryGeneration" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
        🔄 Try Again
      </button>
    </div>

    <!-- Generated Content -->
    <div v-else class="content-container min-h-screen relative">
      <!-- AI Generated HTML Content -->
      <div 
        v-html="htmlContent" 
        class="generated-content min-h-screen"
        @click="handleContentClick"
      ></div>
      
      <!-- Floating Change Model Button -->
      <div class="fixed bottom-6 right-6 z-50">
        <button 
          @click="changeModel" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center space-x-2"
        >
          <span class="text-lg">🤖</span>
          <span class="font-medium">Change Model</span>
        </button>
      </div>
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
    const generationTime = ref(0)
    const startTime = ref(null)
    const timerInterval = ref(null)
    const currentAttempt = ref(0)
    const maxRetries = ref(3)

    const fetchWebsiteForRoute = async (routePath) => {
      currentAttempt.value = 0
      return await fetchWithRetry(routePath)
    }

    const fetchWithRetry = async (routePath, retryCount = 1) => {
      try {
        currentAttempt.value = retryCount
        
        if (retryCount === 1) {
          loading.value = true
          error.value = null
          generationTime.value = 0

          // Start the timer with timestamp
          startTime.value = Date.now()
          timerInterval.value = setInterval(() => {
            generationTime.value = Math.floor((Date.now() - startTime.value) / 1000)
          }, 100) // Update every 100ms for smoother display
        }

        // Get model from query parameters
        const modelParam = route.query.model || 'openai' // Default to openai model

        // Determine the prompt based on route
        let prompt
        const randomSeed = Math.floor(Math.random() * 1000000)
        const timestamp = Date.now()
        
        // Array of modern, unique design styles and approaches
        const designStyles = [
          'ultra-modern minimalist with bold geometric shapes and neon accents',
          'glassmorphism design with frosted glass effects and vibrant gradients',
          'dark mode cyberpunk aesthetic with electric blues and purples',
          'brutalist modern design with bold typography and asymmetrical layouts',
          'neumorphism soft UI with subtle shadows and organic shapes',
          'retro-futuristic with holographic elements and chrome accents',
          'art deco inspired modern with gold accents and elegant curves',
          'scandinavian modern with pastel colors and clean lines',
          'maximalist colorful with bold patterns and dynamic animations',
          'monochromatic modern with striking black and white contrasts'
        ]
        
        const selectedStyle = designStyles[Math.floor(Math.random() * designStyles.length)]
        
        // Smart route analysis for contextual page generation
        const analyzeRoute = (path) => {
          const segments = path.split('/').filter(s => s)
          const lastSegment = segments[segments.length - 1]
          const isNumeric = /^\d+$/.test(lastSegment)
          const hasId = isNumeric || /^[a-f0-9]{24}$|^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(lastSegment)
          
          return {
            segments,
            lastSegment,
            isNumeric,
            hasId,
            baseCategory: segments[0] || 'home',
            isDetailPage: hasId,
            isListingPage: segments.length === 1 && !hasId,
            itemId: hasId ? lastSegment : null
          }
        }
        
        if (routePath === '/' || routePath === '') {
          prompt = `Create an absolutely stunning, unique ${selectedStyle} homepage with custom CSS. This must be a jaw-dropping, modern website that stands out from typical corporate pages. Write your own high-quality CSS - DO NOT use Tailwind CSS or any external frameworks. 

CRITICAL ACCESSIBILITY REQUIREMENT - READ THIS FIRST:
CONTRAST IS MANDATORY! Every single text element MUST have proper contrast:
- White text (#ffffff, #f1f5f9, #e2e8f0) ONLY on dark backgrounds (#000000, #0f172a, #1e293b, #334155)
- Dark text (#000000, #0f172a, #1e293b) ONLY on light backgrounds (#ffffff, #f8fafc, #f1f5f9)
- NEVER EVER use dark text on dark backgrounds
- NEVER EVER use light text on light backgrounds
- ALL headings, paragraphs, labels, buttons, and navigation text MUST follow this rule
- Test every color combination before using it
- If unsure, use white text on dark background or black text on white background

CUSTOM CSS REQUIREMENTS: Write Tailwind-GRADE CSS quality - professional, modern, responsive utility-first approach but as custom CSS. Use advanced CSS features: CSS Grid, Flexbox, custom properties (CSS variables), modern animations, transitions, hover effects, responsive design with media queries. Your CSS should rival the quality of top frameworks but be completely custom-written. 

VISUAL REQUIREMENTS: Use real images from these sources ONLY - logos from logo.clearbit.com/[company].com (e.g. logo.clearbit.com/google.com), hero images from picsum.photos/1200/600, profile photos from randomuser.me/api/portraits/[men/women]/[1-99].jpg. For icons, create your own SVG code directly inline - DO NOT link to heroicons.com or any external icon services. Write clean, modern SVG icons with proper viewBox, paths, and styling. 

DESIGN MUST BE: Visually striking with bold colors, unique layouts, creative sections, modern typography, interactive elements, creative hover effects, dynamic gradients, and unconventional but professional design choices. 

SECTIONS: 1) Eye-catching navigation with creative logo placement 2) Hero section with dramatic visuals and compelling copy 3) Unique about section with creative storytelling 4) Services grid with innovative card designs 5) Dynamic testimonials with personality 6) Portfolio showcase with hover effects 7) Team section with creative profiles 8) Interactive FAQ with smooth animations 9) Contact form with modern styling 10) Footer with social links and creative elements. Use realistic content, never placeholders. Navigation links: /about, /services, /contact, /portfolio, /blog, /team, /products. 

IMPORTANT: Return ONLY complete, valid HTML starting with <!DOCTYPE html> and ending with </html>. Include all CSS embedded in <style> tags within the <head>. Include proper meta tags, viewport, and title. Ensure html and body have full height (100vh). No explanations, no markdown, no code blocks - just pure HTML code ready to render. Style: ${selectedStyle}. ID: ${randomSeed}-${timestamp}`
        } else {
          const routeInfo = analyzeRoute(routePath)
          const pageName = routePath.replace('/', '').replace(/[-_]/g, ' ')
          
          if (routeInfo.isDetailPage) {
            // Single item detail page (e.g., /products/123, /blog/my-post, /team/john-doe)
            const category = routeInfo.baseCategory
            const itemId = routeInfo.itemId
            
            prompt = `Create a stunning ${selectedStyle} individual ${category} detail page with custom CSS for item/ID: "${itemId}". This is a SINGLE ITEM detail page, not a listing. Write your own high-quality CSS - DO NOT use Tailwind CSS or any external frameworks. 

CRITICAL ACCESSIBILITY REQUIREMENT - READ THIS FIRST:
CONTRAST IS MANDATORY! Every single text element MUST have proper contrast:
- White text (#ffffff, #f1f5f9, #e2e8f0) ONLY on dark backgrounds (#000000, #0f172a, #1e293b, #334155)
- Dark text (#000000, #0f172a, #1e293b) ONLY on light backgrounds (#ffffff, #f8fafc, #f1f5f9)
- NEVER EVER use dark text on dark backgrounds
- NEVER EVER use light text on light backgrounds
- ALL headings, paragraphs, labels, buttons, and navigation text MUST follow this rule
- Test every color combination before using it
- If unsure, use white text on dark background or black text on white background

CUSTOM CSS REQUIREMENTS: Write Tailwind-GRADE CSS quality - professional, modern, responsive utility-first approach but as custom CSS. Use advanced CSS features: CSS Grid, Flexbox, custom properties (CSS variables), modern animations, transitions, hover effects, responsive design with media queries. Your CSS should rival the quality of top frameworks but be completely custom-written. 

VISUAL REQUIREMENTS: Use real images from logo.clearbit.com/[company].com, picsum.photos/[width]/[height], randomuser.me/api/portraits/[men/women]/[1-99].jpg. For icons, create your own SVG code directly inline - DO NOT link to heroicons.com or any external icon services. Write clean, modern SVG icons with proper viewBox, paths, and styling. 

PAGE TYPE: This is a detailed view of ONE specific ${category.slice(0, -1)} item. CONTENT STRUCTURE: 1) Navigation header with breadcrumbs showing ${category} > ${itemId} 2) Hero section showcasing THIS specific item with large images 3) Detailed specifications/information about this ONE item 4) Image gallery or media section for this item 5) Reviews/testimonials specific to this item 6) Related/similar items section 7) Purchase/contact/action buttons 8) Detailed description sections 9) Footer. 

IMPORTANT: Generate realistic, detailed content for ONE specific ${category.slice(0, -1)} item with ID "${itemId}". If products: show product details, specs, pricing. If blog: show full article content. If team: show person's bio, role, contact. Make it feel like a real individual item page, not a category listing. Navigation: /${category}, /about, /contact, /home. 

IMPORTANT: Return ONLY complete, valid HTML starting with <!DOCTYPE html> and ending with </html>. Include all CSS embedded in <style> tags within the <head>. Include proper meta tags, viewport, and title. Ensure html and body have full height (100vh). No explanations, no markdown, no code blocks - just pure HTML code ready to render. Style: ${selectedStyle}. Item: ${itemId}. ID: ${randomSeed}-${timestamp}`
          } else if (routeInfo.isListingPage) {
            // Category listing page (e.g., /products, /blog, /team)
            const category = routeInfo.baseCategory
            
            prompt = `Create a visually stunning ${selectedStyle} ${category} listing page with custom CSS. This is a CATEGORY LISTING page showing multiple ${category} items. Write your own high-quality CSS - DO NOT use Tailwind CSS or any external frameworks. 

CRITICAL ACCESSIBILITY REQUIREMENT - READ THIS FIRST:
CONTRAST IS MANDATORY! Every single text element MUST have proper contrast:
- White text (#ffffff, #f1f5f9, #e2e8f0) ONLY on dark backgrounds (#000000, #0f172a, #1e293b, #334155)
- Dark text (#000000, #0f172a, #1e293b) ONLY on light backgrounds (#ffffff, #f8fafc, #f1f5f9)
- NEVER EVER use dark text on dark backgrounds
- NEVER EVER use light text on light backgrounds
- ALL headings, paragraphs, labels, buttons, and navigation text MUST follow this rule
- Test every color combination before using it
- If unsure, use white text on dark background or black text on white background

CUSTOM CSS REQUIREMENTS: Write Tailwind-GRADE CSS quality - professional, modern, responsive utility-first approach but as custom CSS. Use advanced CSS features: CSS Grid, Flexbox, custom properties (CSS variables), modern animations, transitions, hover effects, responsive design with media queries. Your CSS should rival the quality of top frameworks but be completely custom-written. 

VISUAL REQUIREMENTS: Use real images from logo.clearbit.com/[company].com, picsum.photos/[width]/[height], randomuser.me/api/portraits/[men/women]/[1-99].jpg. For icons, create your own SVG code directly inline - DO NOT link to heroicons.com or any external icon services. Write clean, modern SVG icons with proper viewBox, paths, and styling. 

PAGE TYPE: This shows MULTIPLE ${category} in a grid/list format. CONTENT STRUCTURE: 1) Navigation header 2) Category hero section for ${category} 3) Filter/search bar for browsing ${category} 4) Grid of multiple ${category} cards/items (6-12 items) 5) Each card shows preview, title, brief description, and link to individual item 6) Pagination or load more section 7) Category sidebar with filters 8) Call-to-action sections 9) Footer. 

IMPORTANT: Generate multiple realistic ${category} items, each with unique names, descriptions, and preview content. If products: show various products with prices, images, brief descriptions. If blog: show multiple blog posts with titles, excerpts, dates. If team: show multiple team members with photos, names, roles. Each item should link to its detail page (e.g., /${category}/1, /${category}/2, etc.). Navigation: /home, /about, /contact, /${category}. 

IMPORTANT: Return ONLY complete, valid HTML starting with <!DOCTYPE html> and ending with </html>. Include all CSS embedded in <style> tags within the <head>. Include proper meta tags, viewport, and title. Ensure html and body have full height (100vh). No explanations, no markdown, no code blocks - just pure HTML code ready to render. Style: ${selectedStyle}. Category: ${category}. ID: ${randomSeed}-${timestamp}`
          } else {
            // Regular static page (e.g., /about, /contact, /services)
            prompt = `Create a visually stunning, completely unique ${selectedStyle} ${pageName} page with custom CSS. This must be an extraordinary, modern page that breaks away from boring templates. Write your own high-quality CSS - DO NOT use Tailwind CSS or any external frameworks. 

CRITICAL ACCESSIBILITY REQUIREMENT - READ THIS FIRST:
CONTRAST IS MANDATORY! Every single text element MUST have proper contrast:
- White text (#ffffff, #f1f5f9, #e2e8f0) ONLY on dark backgrounds (#000000, #0f172a, #1e293b, #334155)
- Dark text (#000000, #0f172a, #1e293b) ONLY on light backgrounds (#ffffff, #f8fafc, #f1f5f9)
- NEVER EVER use dark text on dark backgrounds
- NEVER EVER use light text on light backgrounds
- ALL headings, paragraphs, labels, buttons, and navigation text MUST follow this rule
- Test every color combination before using it
- If unsure, use white text on dark background or black text on white background

CUSTOM CSS REQUIREMENTS: Write Tailwind-GRADE CSS quality - professional, modern, responsive utility-first approach but as custom CSS. Use advanced CSS features: CSS Grid, Flexbox, custom properties (CSS variables), modern animations, transitions, hover effects, responsive design with media queries. Your CSS should rival the quality of top frameworks like Bootstrap, Tailwind, Bulma but be completely custom-written. 

VISUAL REQUIREMENTS: Use real images ONLY from these sources - logos from logo.clearbit.com/[company].com, content images from picsum.photos/[width]/[height], person photos from randomuser.me/api/portraits/[men/women]/[1-99].jpg. For icons, create your own SVG code directly inline - DO NOT link to heroicons.com or any external icon services. Write clean, modern SVG icons with proper viewBox, paths, and styling. 

DESIGN MUST BE: Absolutely unique and modern with creative layouts, bold color schemes, innovative sections, dramatic typography, smooth animations, creative hover effects, dynamic elements, and professional but unconventional design. 

CONTENT SECTIONS: 1) Creative navigation header 2) Dramatic hero section specific to ${pageName} 3) Multiple innovative content sections about ${pageName} 4) Interactive elements and creative components 5) Call-to-action areas with modern styling 6) Related services/features with unique presentation 7) FAQ or insights section 8) Contact/next steps with creative design 9) Modern footer. Use realistic, engaging content - never boring corporate speak or placeholders. Navigation links: /home, /about, /services, /contact, /portfolio, /blog, /products. 

IMPORTANT: Return ONLY complete, valid HTML starting with <!DOCTYPE html> and ending with </html>. Include all CSS embedded in <style> tags within the <head>. Include proper meta tags, viewport, and title. Ensure html and body have full height (100vh). No explanations, no markdown, no code blocks - just pure HTML code ready to render. Style: ${selectedStyle}. Topic: ${pageName}. ID: ${randomSeed}-${timestamp}`
          }
        }

        const encodedPrompt = encodeURIComponent(prompt)
        const url = `https://text.pollinations.ai/${encodedPrompt}?model=${modelParam}`

        console.log('Fetching content for route:', routePath)
        console.log('Using model:', modelParam)
        console.log('API URL:', url)

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
            "Authorization":"Bearer v58VDKB2ndNLDU67"
          }
        })

        if (!response.ok) {
          // Specific error handling for different status codes
          if (response.status === 429) {
            throw new Error(`Rate limited (429) - too many requests`)
          } else if (response.status >= 500) {
            throw new Error(`Server error (${response.status}) - service temporarily unavailable`)
          } else if (response.status === 404) {
            throw new Error(`Model not found (404) - the selected model may be unavailable`)
          } else {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }

        const generatedHtml = await response.text()
        
        if (!generatedHtml || generatedHtml.trim() === '') {
          throw new Error('Received empty response from AI service')
        }

        // Check if response looks like an error message instead of HTML
        if (generatedHtml.toLowerCase().includes('error') && generatedHtml.length < 200) {
          throw new Error('AI service returned an error response')
        }

        // Clean and enhance the generated HTML
        const cleanedHtml = cleanGeneratedHtml(generatedHtml)
        
        htmlContent.value = cleanedHtml
        
      } catch (err) {
        console.error(`Error fetching website (attempt ${retryCount}):`, err)
        
        // If we haven't reached max retries, try again
        if (retryCount < maxRetries.value) {
          console.log(`Retrying... (${retryCount + 1}/${maxRetries.value})`)
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
          return await fetchWithRetry(routePath, retryCount + 1)
        }
        
        // All retries exhausted, show error
        error.value = `Failed to generate webpage after ${maxRetries.value} attempts: ${err.message}`
        
        // Fallback content
        htmlContent.value = generateFallbackContent(routePath)
        
      } finally {
        // Only clear loading and timer on final attempt (success or all retries exhausted)
        if (retryCount >= maxRetries.value || htmlContent.value) {
          loading.value = false
          if (timerInterval.value) {
            clearInterval(timerInterval.value)
            timerInterval.value = null
          }
        }
      }
    }

    const cleanGeneratedHtml = (html) => {
      // Remove any potential script tags for security only
      let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      
      // Minimal cleaning - only remove obvious AI explanatory text if present
      if (cleaned.includes('```html')) {
        // Extract content between ```html and ``` if present
        const htmlMatch = cleaned.match(/```html\s*([\s\S]*?)\s*```/i)
        if (htmlMatch) {
          cleaned = htmlMatch[1]
        }
      }
      
      // Remove leading/trailing explanatory text only if HTML structure is present
      if (cleaned.includes('<!DOCTYPE html>') || cleaned.includes('<html>')) {
        const htmlStart = cleaned.search(/(<!DOCTYPE html|<html)/i)
        if (htmlStart > 0) {
          cleaned = cleaned.substring(htmlStart)
        }
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

    const changeModel = () => {
      // Navigate to the models page, preserving the current route for return
      const currentPath = route.path
      const returnUrl = encodeURIComponent(currentPath)
      router.push(`/ai/models?return=${returnUrl}`)
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
      generationTime,
      currentAttempt,
      maxRetries,
      retryGeneration,
      changeModel,
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
