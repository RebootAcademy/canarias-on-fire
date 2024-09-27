<template>
  <!-- <div class="flex justify-center items-center cursor-pointer mx-4" @click="toggleTheme">
    <Sun v-if="theme === 'light'" class="transform transition duration-300" size="28"/>
    <Moon v-else class="transform transition duration-300" size="28"/>
  </div> -->

  <div :class="['tdnn', themeClass]" @click="toggleTheme">
       <div class="moon" :class="themeIconClass"></div>
  </div>
</template>

<script setup>
/* import { Sun, Moon } from 'lucide-vue-next'
 */
const theme = ref('dark')
const themeIconClass = computed(() => (theme.value === 'dark' ? 'moon' : 'sun'))
const themeClass = computed(() => (theme.value === 'light' ? 'bg-sun' : 'bg-moon'))


function toggleTheme() {
  if (theme.value === 'dark') {
    document.body.classList.add('light');
    theme.value = 'light';
  } else {
    document.body.classList.remove('light');
    theme.value = 'dark';
  }
}
</script>

<style scoped>

.bg-moon {
  background: rgba(125, 125, 125, 0.20);
}

.bg-sun {
  background: #FBB03B;
}
.tdnn {
  font-size: 4px;
  cursor: pointer;
  position: relative;
  height: 30px;
  width: 60px;
  border-radius: 16em;
  transition: all 500ms ease-in-out;
}

.moon {
  position: absolute;
  display: block;
  border-radius: 50%;
  transition: all 400ms ease-in-out;
  
  top: 4px;
  left: 6px;
  transform: rotate(-75deg);
  width: 22px;
  height: 24px;
  background: rgba(125, 125, 125, 0);
  box-shadow: 
    1.5em 2.3em 0 0em #D9FBFF inset, /* Ajuste proporcional */
    rgba(255, 255, 255, 0.61) 1.8em 4em 0 -2.7em, /* Ajuste proporcional */
    rgba(255, 255, 255, 0.61) 1.2em 9.5em 0 -3.3em, /* Ajuste proporcional */
    rgba(255, 255, 255, 0.61) 1.8em 1.2em 0 -2.5em, /* Ajuste proporcional */
    rgba(255, 255, 255, 0.61) 4.7em 4.7em 0 -2.7em, /* Ajuste proporcional */
    rgba(255, 255, 255, 0.61) 3.5em 7.7em 0 -2.7em, /* Ajuste proporcional */
    rgba(255, 255, 255, 0.61) -2.4em 4.2em 0 -2.7em, /* Ajuste proporcional */
    rgba(255, 255, 255, 0.61) -0.6em 6em 0 -2.7em; /* Ajuste proporcional */
}
.sun {
  top: 6px;
  left: 35px;
  transform: rotate(0deg);
  width: 18px;
  height: 18px;
  background: #fff;
  box-shadow: 
     1.67em 1.67em 0 2.8em #ffff inset, 
    0 -2.8em 0 -1.5em #ffff, 
    2em -2em 0 -1.67em #ffff, 
    2.8em 0 0 -1.5em #ffff, 
    2em 2em 0 -1.67em #ffff, 
    0 2.8em 0 -1.5em #ffff, 
    -2em 2em 0 -1.67em #ffff, 
    -2.8em 0 0 -1.5em #ffff, 
    -2em -2em 0 -1.67em #ffff; 
}

</style>