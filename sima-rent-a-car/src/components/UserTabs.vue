<template>
    <Tab
        text="Orders"
        ref="Orders"
        icon="fa-solid fa-user-tie"
        @selectedTabChanged="selectedTabChanged"
    ></Tab>
</template>

<script>
import Tab from "./Tab.vue";
export default {
    data() {
        return {
            selectedTab: "",
        };
    },
    emits: ["selectedTabChanged"],
    components: { Tab },
    methods: {
        selectedTabChanged(ref) {
            if (this.selectedTab !== "") {
                this.$refs[this.selectedTab].selected = false;
            }
            this.selectedTab = ref;
            this.$emit("selectedTabChanged", ref);
        },
    },
};
</script>
