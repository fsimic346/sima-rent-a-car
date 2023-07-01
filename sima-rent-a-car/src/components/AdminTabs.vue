<template>
    <Tab
        text="Create Manager"
        ref="CreateManager"
        icon="fa-solid fa-user-tie"
        @selectedTabChanged="selectedTabChanged"
    ></Tab>
    <Tab
        text="Create Agency"
        ref="CreateAgency"
        icon="fa-solid fa-car"
        @selectedTabChanged="selectedTabChanged"
    ></Tab>
    <Tab
        text="Users"
        ref="Users"
        icon="fa-solid fa-users"
        @selectedTabChanged="selectedTabChanged"
    ></Tab
    ><Tab
        text="Comments"
        ref="Comments"
        icon="fa-solid fa-comment"
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
