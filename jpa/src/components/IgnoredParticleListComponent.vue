<template>
    <div
      v-if="isVisible"
      class="popout-menu"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      @mousedown="startDrag"
    >
      <div class="popout-header">
        <h3>Ignored Particles</h3>
        <button class="close-button" @click="onClose(this.tags)">x</button>
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
        placeholder="Type a word and press enter"
        class="tag-input"
      />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      onClose: {
        type: Function,
        args: ['newParticleIgnoreList'],
        required: true
      }, 
      ignoredParticles: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tags: this.ignoredParticles,
        newTag: '',
        position: { top: 50, left: 50 },
        isDragging: false,
        dragStart: { x: 0, y: 0 }
      };
    },
    methods: {
      addTag() {
        if (this.newTag.trim() !== '') {
          this.tags.push(this.newTag.trim());
          this.newTag = '';
        }
      },
      removeTag(index) {
        this.tags.splice(index, 1);
      },
      startDrag(event) {
        this.isDragging = true;
        this.dragStart.x = event.clientX - this.position.left;
        this.dragStart.y = event.clientY - this.position.top;
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
      },
      onDrag(event) {
        if (this.isDragging) {
          this.position.left = event.clientX - this.dragStart.x;
          this.position.top = event.clientY - this.dragStart.y;
        }
      },
      stopDrag() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
      }
    }
};
  </script>
  
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
  </style>