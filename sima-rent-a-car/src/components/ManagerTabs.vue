<template>
    <Tab
        text="Agency Overview"
        ref="AgencyOverview"
        icon="fa-solid fa-building"
        @selectedTabChanged="selectedTabChanged"
    ></Tab>
    <Tab
        text="Add Vehicle"
        ref="AddVehicle"
        icon="fa-solid fa-car"
        @selectedTabChanged="selectedTabChanged"
    ></Tab>
    <Tab
        text="Rentals"
        ref="Rentals"
        icon="fa-solid fa-file-invoice"
        @selectedTabChanged="selectedTabChanged"
    ></Tab>
    <Tab
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
