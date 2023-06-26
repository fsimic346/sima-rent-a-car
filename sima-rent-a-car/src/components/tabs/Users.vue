<template>
    <div class="search-bar">
        <input
            type="text"
            class="search"
            placeholder="Search..."
            @keyup="search($event)"
        />
        <div class="search-options">
            <div class="filter">
                <div>Filter:</div>
                <select name="filter" id="filter" v-model="filter">
                    <option value="none" selected>None</option>
                    <option value="customer">Customers</option>
                    <option value="manager">Managers</option>
                    <option value="admin">Admins</option>
                    <option value="bronze">Bronze Customers</option>
                    <option value="silver">Silver Customers</option>
                    <option value="gold">Gold Customers</option>
                </select>
            </div>
            <div class="sort">
                <div>Sort by:</div>
                <select name="sort" id="sort" v-model="sort">
                    <option value="none" selected>None</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
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
    <div class="users-overflow">
        <div class="users-container">
            <div class="user-card" v-for="user in users">
                <div
                    class="user-image"
                    :style="{ backgroundImage: `url(${user.imageUrl})` }"
                ></div>
                <div class="user-info">
                    {{
                        user.username +
                        ` (${user.firstName + " " + user.lastName})`
                    }}
                </div>
                <div class="user-role">{{ user.role }}</div>
                <i class="fa-solid fa-ban" @click="banUser(user)"></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            sortOrder: "descending",
            searchParams: "",
            filter: "none",
            sort: "none",
            users: [],
            allUsers: [],
        };
    },
    methods: {
        changeSortOrder() {
            if (this.sortOrder === "descending") {
                this.sortOrder = "ascending";
                this.filterUsers();
                return;
            }
            this.sortOrder = "descending";
            this.filterUsers();
        },
        search(e) {
            this.searchParams = e.target.value.toLowerCase();

            this.filterUsers();
        },
        filterUsers() {
            this.users = this.allUsers.filter(x => {
                return (
                    x.firstName.toLowerCase().includes(this.searchParams) ||
                    x.lastName.toLowerCase().includes(this.searchParams) ||
                    x.username.toLowerCase().includes(this.searchParams)
                );
            });

            if (this.filter !== "none" && this.filter !== "") {
                this.users = this.users.filter(x => {
                    if (this.filter in ["bronze", "silver", "gold"]) {
                        return (
                            x.role.toLowerCase() === "customer" &&
                            x.customerType.toLowerCase() ===
                                this.filter.toLowerCase()
                        );
                    }
                    return x.role.toLowerCase() === this.filter.toLowerCase();
                });
            }

            if (this.sort !== "none") {
                this.users = this.users.sort((a, b) => {
                    if (this.sort === "points")
                        return this.sortOrder === "ascending"
                            ? b.points - a.points
                            : a.points - b.points;

                    let sortVal = 0;
                    if (a[this.sort].toLowerCase() < b[this.sort].toLowerCase())
                        sortVal = 1;
                    else if (
                        a[this.sort].toLowerCase() > b[this.sort].toLowerCase()
                    )
                        sortVal = -1;
                    return this.sortOrder === "ascending"
                        ? sortVal
                        : sortVal * -1;
                });
            }
        },
        banUser(user) {
            try {
                const res = this.axios.get(
                    "http://localhost:8080/api/user/ban/" + user.username,
                );
            } catch (error) {
                console.log(error);
            }
            // oznaciti banovane korisnike
            alert(`${user.username} banned.`);
        },
    },
    async mounted() {
        try {
            this.allUsers = (
                await this.axios.get("http://localhost:8080/api/user/all")
            ).data;
            this.users = this.allUsers;
        } catch (err) {
            console.log(err.response.data);
        }
    },
    watch: {
        filter(val) {
            this.filterUsers();
        },
        sort(val) {
            this.filterUsers();
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

.users-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    padding: 2rem;
    height: 100%;
}

.users-overflow {
    overflow-y: auto;
    width: 100%;
    height: 100%;
}

.user-card {
    display: flex;
    align-items: center;
    gap: 2rem;
    color: rgb(var(--clr-text));
    margin-inline: auto;
    font-size: 1.2rem;
    border: 1px solid rgb(var(--clr-neutral-500));
    border-radius: 10px;
    padding: 0.6rem 1rem;
    transition: 0.3s ease-in-out;
}

.user-card i {
    color: rgb(var(--clr-error));
    font-size: 2rem;
    transition: 0.1s;
}

.user-card i:hover {
    filter: contrast(1.2);
    transform: scale(1.1);
    cursor: pointer;
}

.user-image {
    width: 4rem;
    height: 4rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
}

.user-info {
    width: 40ch;
    display: flex;
    align-items: center;
}

.user-role {
    width: 10ch;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-card:hover {
    transform: scale(1.02);
}
</style>
