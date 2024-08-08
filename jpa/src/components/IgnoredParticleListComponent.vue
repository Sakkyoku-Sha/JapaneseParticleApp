<script setup lang="ts">
import { withDefaults, defineProps,ref } from 'vue';
import { ValidateSubmittedTag } from '@/parsing/SubmittedTagValidation';

const props = withDefaults(defineProps<{
  isVisible: boolean,
  onClose: (tags : string[]) => void,
  ignoredParticles: Array<string>,
}>(), {});


const tags = ref<string[]>(props.ignoredParticles);
const newTag = ref<string>('');
const position = ref<{top : number, left : number}>({ top: 50, left: 50 });
const isDragging = ref<boolean>(false);
const dragStart = ref<{x : number, y : number}>({ x: 0, y: 0 });
const isValidTag = ref<boolean>(true);
const shakeClass = ref<string>('');

const addTag = () => {
        
    const validTag = ValidateSubmittedTag(newTag.value, tags.value);
    if(validTag){
        tags.value.push(newTag.value.trim());
        newTag.value = '';
    }
    else{
        triggerShake();
    }
    isValidTag.value = validTag; 
};

const triggerShake = () => {
    shakeClass.value = ' shake';
    setTimeout(() => {
        shakeClass.value = '';
    }, 500); // Duration of the shake animation
};

const removeTag = (index : number) => {
    tags.value.splice(index, 1);
};
const startDrag = (event : MouseEvent) => {
    isDragging.value = true;
    dragStart.value.x = event.clientX - position.value.left;
    dragStart.value.y = event.clientY - position.value.top;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
};
const onDrag = (event : MouseEvent) => {
    if (isDragging.value) {
        position.value.left = event.clientX - dragStart.value.x;
        position.value.top = event.clientY - dragStart.value.y;
    }
};
const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
};

const onClose = (tags : string[]) => {
    newTag.value = '';
    isValidTag.value = true;
    props.onClose(tags);
}

</script>

<template>
    <div v-if="isVisible"
      class="popout-menu"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      @mousedown="startDrag"
    >
    <div class="popout-header">
        <h3>Ignored Particles</h3>
        <button class="close-button" @click="onClose(tags)">x</button>
    </div>
    <div class="tags-list">
        <div v-for="(tag, index) in tags" :key="index" class="tag">
          {{ tag }}
          <button class="remove-tag" @click="removeTag(index)">x</button>
        </div>
    </div>
    <input
        v-model="newTag"
        @keyup.enter="addTag"
        placeholder="Type a 助詞 and press enter"
        :class="'tag-input' + (isValidTag ? '' : ' invalid') + (shakeClass)"
    />
    </div>
</template>
  
<style scoped>
.popout-menu {
    position: absolute;
    width: 300px;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #433d3d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}
  
.popout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px; /* Reduced padding */
  margin-bottom: 5px;  /* Reduced margin */
}

.popout-header h3 {
  margin: 0;          /* Remove default margin */
  font-size: 12px;    /* Adjust font size if needed */
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: white;
}

  
.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}
  
.tag {
    display: flex;
    align-items: center;
    padding: 5px;
    background-color: #2a2828;
    border-radius: 3px;
    color: white;
}

.remove-tag {
    margin-left: 5px;
    background: none;
    border: none;
    cursor: pointer;
    color: white;
}

.tag-input {
    width: 100%;
    padding: 5px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    box-sizing: border-box;
    font-size: 14px;
}

.invalid {
  color: red !important;
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
</style>