<template>
  <div class="models-page min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div v-if="returnUrl" class="mb-4">
          <button 
            @click="goBack" 
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            ← Back to page
          </button>
        </div>
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          {{ returnUrl ? '🔄 Change AI Model' : '🤖 Available AI Models' }}
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          {{ returnUrl 
            ? 'Select a different AI model to regenerate your content with.' 
            : 'Choose from available AI models to power your content generation. These models offer various capabilities and quality levels.' 
          }}
        </p>
        <div class="mt-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mr-2">
            🌟 Seed Tier
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            🆓 Anonymous Tier
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="loading-spinner w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full mb-4"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-4xl mb-4">⚠️</div>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Failed to load models</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchModels" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
          🔄 Retry
        </button>
      </div>

      <!-- Models Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="model in models" 
          :key="model.name"
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-2 hover:border-purple-300"
          :class="{ 'border-purple-500 bg-purple-50': selectedModel === model.name }"
          @click="selectModel(model)"
        >
          <!-- Model Name -->
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold text-gray-800">{{ model.name }}</h3>
            <div class="flex space-x-1">
              <span v-if="model.vision" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">👁️ Vision</span>
              <span v-if="model.audio" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">🔊 Audio</span>
              <span v-if="model.tools" class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">🛠️ Tools</span>
              <span v-if="model.reasoning" class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">🧠 Reasoning</span>
              <span v-if="model.community" class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">👥 Community</span>
              <span v-if="model.uncensored" class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">🔓 Uncensored</span>
            </div>
          </div>

          <!-- Model Description -->
          <p class="text-gray-600 mb-4 text-sm leading-relaxed">{{ model.description }}</p>

          <!-- Model Details -->
          <div class="space-y-2 text-xs text-gray-500">
            <div class="flex justify-between">
              <span>Provider:</span>
              <span class="font-medium">{{ model.provider }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tier:</span>
              <span class="font-medium capitalize">{{ model.tier }}</span>
            </div>
            <div v-if="model.maxInputChars" class="flex justify-between">
              <span>Max Input:</span>
              <span class="font-medium">{{ model.maxInputChars.toLocaleString() }} chars</span>
            </div>
            <div class="flex justify-between">
              <span>Input:</span>
              <span class="font-medium">{{ model.input_modalities?.join(', ') || 'text' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Output:</span>
              <span class="font-medium">{{ model.output_modalities?.join(', ') || 'text' }}</span>
            </div>
          </div>

          <!-- Select Button -->
          <div class="mt-6 pt-4 border-t border-gray-100">
            <button 
              class="w-full py-2 px-4 rounded-lg font-medium transition-all"
              :class="selectedModel === model.name 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700'"
            >
              {{ selectedModel === model.name ? '✓ Selected' : (returnUrl ? 'Use This Model' : 'Select Model') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Selected Model Info -->
      <div v-if="selectedModel" class="mt-12 bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">🎯 Selected Model: {{ selectedModel }}</h2>
        <p class="text-gray-600 mb-6">You can now use this model by adding <code class="bg-gray-100 px-2 py-1 rounded">?model={{ selectedModel }}</code> to any URL.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-gray-700 mb-3">🔗 Example URLs:</h3>
            <div class="space-y-2 text-sm">
              <div class="bg-gray-50 p-3 rounded-lg font-mono break-all">
                /?model={{ selectedModel }}
              </div>
              <div class="bg-gray-50 p-3 rounded-lg font-mono break-all">
                /about?model={{ selectedModel }}
              </div>
              <div class="bg-gray-50 p-3 rounded-lg font-mono break-all">
                /services?model={{ selectedModel }}
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-700 mb-3">🚀 Quick Actions:</h3>
            <div class="space-y-2">
              <button 
                @click="testModel('/')" 
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Test on Homepage
              </button>
              <button 
                @click="testModel('/about')" 
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Test on About Page
              </button>
              <button 
                @click="testModel('/services')" 
                class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Test on Services Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'ModelsPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const models = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedModel = ref(null)
    const returnUrl = ref(route.query.return || null)

    const fetchModels = async () => {
      try {
        loading.value = true
        error.value = null

        const response = await fetch('https://text.pollinations.ai/models')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        models.value = data;
        // // Filter to show models with tier "seed" or "anonymous"
        // const availableModels = data.filter(model => model.tier === 'seed' || model.tier === 'anonymous')
        // models.value = availableModels.sort((a, b) => {
        //   // Sort by tier (seed first), then by name
        //   if (a.tier !== b.tier) {
        //     return a.tier === 'seed' ? -1 : b.tier === 'seed' ? 1 : 0
        //   }
        //   return a.name.localeCompare(b.name)
        // })

      } catch (err) {
        console.error('Error fetching models:', err)
        error.value = `Failed to fetch models: ${err.message}`
      } finally {
        loading.value = false
      }
    }

    const selectModel = (model) => {
      selectedModel.value = model.name
      
      // If there's a return URL, automatically redirect with the selected model
      if (returnUrl.value) {
        const decodedReturnUrl = decodeURIComponent(returnUrl.value)
        router.push(`${decodedReturnUrl}?model=${model.name}`)
      }
    }

    const testModel = (route) => {
      if (selectedModel.value) {
        router.push(`${route}?model=${selectedModel.value}`)
      }
    }

    const goBack = () => {
      if (returnUrl.value) {
        const decodedReturnUrl = decodeURIComponent(returnUrl.value)
        router.push(decodedReturnUrl)
      } else {
        router.push('/')
      }
    }

    onMounted(() => {
      fetchModels()
    })

    return {
      models,
      loading,
      error,
      selectedModel,
      returnUrl,
      fetchModels,
      selectModel,
      testModel,
      goBack
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
