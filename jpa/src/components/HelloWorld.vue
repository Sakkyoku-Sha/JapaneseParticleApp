<template>
  <div class="home-page">
    <header class="header">
      <img src="@/assets/logo.png" alt="Logo" class="logo">
    </header>
    <main class="main-content">
      <textarea class="text-area"></textarea>
      <button class="submit-button">Submit</button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.header {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
}

.logo {
  width: 50px;
  height: auto;
}

.main-content {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-area {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
}

.submit-button {
  width: 100%;
  background-color: blue;
  color: white;
  border: none;
  padding: 15px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: darkblue;
}
</style>