<template>
  <a-select
      show-search
      placeholder="Select a person"
      option-filter-prop="children"
      style="width: 200px"
      :filter-option="filterOption"
      @change="handleChange"
  >
    <a-select-option value="jack">
      Jack
    </a-select-option>
  </a-select>
</template>
<script>
export default {
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>
