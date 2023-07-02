<template lang="">
    <div class="calendar-container">
        <DatePicker v-model.range="range" mode="dateTime" />
    </div>
</template>
<script>
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";

export default {
    components: {
        DatePicker,
    },
    data() {
        return {
            range: { start: "", end: "" },
        };
    },
};
</script>

<style scoped>
.calendar-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
