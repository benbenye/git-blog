<template>
  <div class="new">
    <marked-editor :editor="editor" :type="'create'"></marked-editor>
  </div>
</template>

<script>
import MarkedEditor from "../components/marked-editor.vue";
import Data from "../store/data";

export default {
  name: "new-blog",
  components: {
    MarkedEditor
  },
  data() {
    return {
      editor: {}
    };
  },
  created() {
    Data.path = this.$route.path;
  }
};
</script>

<style scoped lang="scss" type="text/scss">
</style>
