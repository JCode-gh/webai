<template>
  <header class="header">
    <div class="header-content">
      <h1 class="title">🤖 AI Website Generator</h1>
      <p class="subtitle">Powered by Pollinations AI</p>
      
      <nav class="navigation">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
        <router-link to="/services" class="nav-link">Services</router-link>
        <router-link to="/blog" class="nav-link">Blog</router-link>
      </nav>
      
      <div class="route-info">
        <span class="current-route">Current Route: {{ $route.path }}</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.route-info {
  margin-top: 15px;
}

.current-route {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .navigation {
    gap: 10px;
  }
  
  .nav-link {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
