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
  <div class="users-overflow">
    <div class="users-container">
      <div class="user-card" v-for="user in users">
        <div
          class="user-image"
          :style="{ backgroundImage: `url(${user.imageUrl})` }"
        ></div>
        <div class="user-info">
          {{ user.username + ` (${user.firstName + ' ' + user.lastName})` }}
        </div>
        <div class="user-role">{{ user.role }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sortOrder: 'descending',
      users: [],
    }
  },
  methods: {
    changeSortOrder() {
      if (this.sortOrder === 'descending') {
        this.sortOrder = 'ascending'
        return
      }
      this.sortOrder = 'descending'
    },
  },
  async mounted() {
    try {
      this.users = (
        await this.axios.get('http://localhost:8080/api/user/all')
      ).data
    } catch (err) {
      console.log(err.response.data)
    }
  },
}
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
  cursor: pointer;
  transform: scale(1.02);
}
</style>
