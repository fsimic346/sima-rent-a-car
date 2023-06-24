<template>
    <div class="search-bar">
        <input type="text" class="search" placeholder="Search..." />
        <div class="search-options">
            <div class="filter">
                <div>Filter:</div>
                <select name="filter" id="filter">
                    <option value="none">None</option>
                    <option value="customers">Customers</option>
                    <option value="managers">Managers</option>
                    <option value="admins">Admins</option>
                    <option value="bronze">Bronze Customers</option>
                    <option value="silver">Silver Customers</option>
                    <option value="gold">Gold Customers</option>
                </select>
            </div>
            <div class="sort">
                <div>Sort by:</div>
                <select name="sort" id="sort">
                    <option value="none">None</option>
                    <option value="firstname">First Name</option>
                    <option value="lastname">Last Name</option>
                    <option value="username">Username</option>
                    <option value="points">Points</option>
                </select>

                <i
                    class="fa-solid"
                    :class="{
                        'fa-arrow-down-short-wide': sortOrder === 'descending',
                        'fa-arrow-up-short-wide': sortOrder === 'ascending',
                    }"
                    id="order"
                    @click="changeSortOrder"
                ></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            sortOrder: "descending",
        };
    },
    methods: {
        changeSortOrder() {
            if (this.sortOrder === "descending") {
                this.sortOrder = "ascending";
                return;
            }
            this.sortOrder = "descending";
        },
    },
};
</script>
<style scoped src="../../static/css/tabContent.css"></style>

<style scoped>
.search-bar {
    display: flex;
    width: 100%;
    min-height: 5rem;
    padding-inline: 1rem;
    align-items: center;
    font-size: 1.2rem;
    color: rgb(var(--clr-text));
    justify-content: space-around;
    border-bottom: 1px solid rgb(var(--clr-text));
}

.search {
    height: max-content;
    width: 30ch;
}

.filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sort {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.search-options {
    display: flex;
    gap: 1rem;
}

i:hover {
    cursor: pointer;
}
</style>
