<template>
  <div class="container" id="cardContainer">
    <div class="filter-container"><h2>search</h2></div>
    <div class="card-container">
      <div
        class="agency-card"
        v-for="agency in agencies"
        :class="{ open: agency.isOpen }"
        :key="agency.id"
      >
        <div
          class="agency-logo"
          style="background-image: url('https://picsum.photos/200')"
        ></div>
        <div class="agency-info">
          <div class="agency-column">
            <div class="agency-colum">
              <div class="agency-name">{{ agency.name }}</div>
              <div class="agency-rating">
                <i class="fa-solid fa-star"></i> 4.8
              </div>
            </div>
            <div class="agency-hours">
              <i class="fa-solid fa-clock"></i>
              {{ agency.businessHours }}
            </div>
          </div>
          <div class="agency-column">
            <div class="agency-location">
              <i class="fa-solid fa-location-dot"></i>
              {{ ` ${agency.location.address}, ${agency.location.city}` }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      agencies: [],
    }
  },
  async beforeMount() {
    const res = await this.axios.get('http://localhost:8080/api/agency/all')
    const agencies = res.data

    const currentDate = new Date()
    const currentHour = currentDate.getHours()
    const currentMinute = currentDate.getMinutes()

    for (const agency of agencies) {
      agency.isOpen = isOpen(getBusinessHours(agency.businessHours.split(' ')))
    }

    agencies.sort((a, b) => {
      if (a.isOpen && !b.isOpen) return -1
      if (!a.isOpen && b.isOpen) return 1
      return 0
    })

    this.agencies = agencies
    console.log(agencies)

    function getBusinessHours(hours) {
      const openingHour =
        parseInt(hours[0].split(':')[0]) + (hours[1] === 'PM' ? 12 : 0)
      const closingHour =
        parseInt(hours[3].split(':')[0]) + (hours[4] === 'PM' ? 12 : 0)
      const openingMinute = parseInt(hours[0].split(':')[1])
      const closingMinute = parseInt(hours[3].split(':')[1])
      return { openingHour, closingHour, openingMinute, closingMinute }
    }

    function isOpen(hours) {
      if (hours.openingHour < currentHour) {
        if (hours.closingHour > currentHour) {
          return true
        }

        if (hours.closingHour === currentHour) {
          if (hours.closingMinute > currentMinute) {
            return true
          }
        }
      } else if (hours.openingHour === currentHour) {
        if (hours.openingMinute < currentMinute) {
          return true
        }
      }
      return false
    }
  },
  mounted() {
    const navHeight = document.querySelector('nav').clientHeight + 1
    document.getElementById(
      'cardContainer',
    ).style.height = `calc(100% - ${navHeight}px)`
  },
}
</script>
<style scoped src="../static/css/agencies.css"></style>
