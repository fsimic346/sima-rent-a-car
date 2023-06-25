<template>
  <div class="container" id="container">
    <div class="profile-container" id="profileContainer">
      <div class="user-info">
        <div class="row">
          <div
            class="profile-image"
            @click="editImage()"
            :style="{ backgroundImage: `url('${user.imageUrl}')` }"
          >
            <div class="image-overlay" id="imageOverlay">
              <i class="fa-solid fa-pen"></i>
            </div>
          </div>
          <div class="credentials">
            <div class="full-name">
              <div>{{ user.firstName }} {{ user.lastName }}</div>
            </div>
            <div class="username">
              <h2>@{{ user.username }}</h2>
            </div>
          </div>
        </div>
        <div class="row space-around">
          <div class="info-container">
            <div class="label">Role</div>
            <div class="data">{{ user.role }}</div>
          </div>
          <div class="info-container">
            <div class="label">
              <span>Gender</span>
              <i class="fa-solid fa-pen" @click="showGenderModal()"></i>
            </div>
            <div class="data">{{ user.gender }}</div>
            <div class="gender-overlay" id="genderOverlay">
              <div class="gender-container male" @click="setGender('Male')">
                <i class="fa-solid fa-mars"></i>
                <span>Male</span>
              </div>
              <div class="gender-container female" @click="setGender('Female')">
                <i class="fa-solid fa-venus"></i>
                <span>Female</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="about-headher">
            <div class="user-icon">
              <i class="fa-solid fa-circle-info"></i>
            </div>
            <h3>About</h3>
          </div>
        </div>
        <div class="row space-around">
          <div class="info-container">
            <div class="label">Email</div>
            <div class="data">{{ user.email }}</div>
            <div class="label">
              <span>Date of birth</span>
              <i
                class="fa-solid fa-pen"
                @click="enableEdit('dateOfBirthInput')"
              ></i>
            </div>
            <div class="data">
              <input
                type="date"
                hidden
                id="dateOfBirthInput"
                v-model="user.dateOfBirth"
                disabled
                @blur="disableEdit('dateOfBirthInput')"
                @keypress="disableEditOnEnter($event, 'dateOfBirthInput')"
              />
            </div>
            <div class="label">
              <span>Phone number</span>
              <i
                class="fa-solid fa-pen"
                @click="enableEdit('phoneNumberInput')"
              ></i>
            </div>
            <div class="data">
              <input
                type="text"
                id="phoneNumberInput"
                v-model="user.phoneNumber"
                disabled
                @focusout="disableEdit('phoneNumberInput')"
                @keypress="disableEditOnEnter($event, 'phoneNumberInput')"
                @keyup="checkIfNumber()"
              />
            </div>
            <div class="error-msg">{{ error }}</div>
          </div>
        </div>
        <div class="row push-bottom">
          <Button :text="saveText" @click="edit" ref="saveBtn"></Button>
        </div>
      </div>
    </div>
    <div class="roles-commands">
      <div class="tabs-overflow">
        <div class="tabs-container">
          <AdminTabs
            v-if="user.role === 'Admin'"
            @selectedTabChanged="selectedTabChanged"
          />
          <ManagerTabs
            v-if="user.role === 'Manager'"
            @selectedTabChanged="selectedTabChanged"
          />
        </div>
      </div>
      <div class="tab-content">
        <CreateAgency v-if="selectedTab === 'CreateAgency'" />
        <CreateManager v-if="selectedTab === 'CreateManager'" />
        <AgencyOverview
          v-if="selectedTab === 'AgencyOverview'"
          :agency="user.agency"
        />
        <Users v-if="selectedTab === 'Users'" />
      </div>
    </div>
  </div>
  <vue-final-modal
    v-model="showImageModal"
    classes="modal-container"
    content-class="modal-content"
  >
    <ImageForm @imageChanged="val => (this.user.imageUrl = val)" />
  </vue-final-modal>
</template>
<script>
import Button from '@/components/Button.vue'
import { VueFinalModal, ModalsContainer } from 'vue-final-modal'
import ImageForm from '@/components/ImageForm.vue'
import CreateManager from '@/components/tabs/CreateManager.vue'
import CreateAgency from '@/components/tabs/CreateAgency.vue'
import AdminTabs from '@/components/AdminTabs.vue'
import ManagerTabs from '@/components/ManagerTabs.vue'
import AgencyOverview from '@/components/tabs/AgencyOverview.vue'
import Users from '@/components/tabs/Users.vue'

export default {
  data() {
    return {
      user: {},
      showImageModal: false,
      genderModal: false,
      saveText: 'Save',
      error: '',
      selectedTab: '',
    }
  },
  components: {
    Button,
    VueFinalModal,
    ModalsContainer,
    ImageForm,
    CreateManager,
    CreateAgency,
    AdminTabs,
    ManagerTabs,
    AgencyOverview,
    Users,
  },
  mounted() {
    if (this.user.dateOfBirth !== null) {
      document.getElementById('dateOfBirthInput').hidden = false
    }
    if (this.user.dateOfBirth === undefined) {
      document.getElementById('dateOfBirthInput').hidden = true
    }
    const navHeight = document.querySelector('nav').clientHeight + 1
    document.getElementById(
      'container',
    ).style.height = `calc(100% - ${navHeight}px)`

    this.user = JSON.parse(localStorage.getItem('user'))
    document.addEventListener('click', e => {
      let element = document.getElementById('genderOverlay')
      if (element == null) {
        return
      }

      if (element !== e.target && this.genderModal) {
        element.style.opacity = 0
        this.genderModal = false
        setTimeout(() => {
          document.getElementById('genderOverlay').style.display = 'none'
        }, 200)
      }
    })
  },
  methods: {
    async edit() {
      try {
        this.saveText = ''
        this.$refs.saveBtn.enabled = false
        await this.axios.patch('http://localhost:8080/api/user', this.user)
        this.$refs.saveBtn.enabled = true
        this.saveText = 'Save'
      } catch (err) {
        this.saveText = 'Save'
        this.$refs.saveBtn.enabled = true
        this.error = err.response.data
      }
    },
    enableEdit(id) {
      const element = document.getElementById(id)
      element.disabled = false
      if (id === 'dateOfBirthInput') {
        element.hidden = false
        setTimeout(() => {
          element.showPicker()
        }, 1)
      }
      element.focus()
      element.parentElement.previousElementSibling.classList.toggle('selected')
    },
    disableEdit(id) {
      const element = document.getElementById(id)
      element.disabled = true
      element.parentElement.previousElementSibling.classList.toggle('selected')
      if (this.user.dateOfBirth == undefined && id === 'dateOfBirthInput') {
        element.hidden = true
      }
    },
    disableEditOnEnter(e, id) {
      const element = document.getElementById(id)
      if (e.keypress === 'Enter' || e.keyCode === 13) {
        element.disabled = true
      }
    },
    showGenderModal() {
      document.getElementById('genderOverlay').style.display = 'flex'
      setTimeout(() => {
        this.genderModal = true
        document.getElementById('genderOverlay').style.opacity = 1
      }, 10)
    },
    setGender(gender) {
      this.user.gender = gender
      document.getElementById('genderOverlay').style.opacity = 0
      setTimeout(() => {
        document.getElementById('genderOverlay').style.display = 'none'
      }, 200)
      this.genderModal = false
    },
    editImage() {
      this.showImageModal = true
    },
    checkIfNumber() {
      if (this.user.phoneNumber !== null && isNaN(this.user.phoneNumber)) {
        this.error = 'Invalid phone number'
        this.$refs.saveBtn.enabled = false
        return
      }

      this.$refs.saveBtn.enabled = true
      this.error = ''
    },
    selectedTabChanged(ref) {
      if (ref === this.selectedTab) return
      this.selectedTab = ref
    },
  },
}
</script>
<style scoped src="../static/css/profile.css"></style>
<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  display: flex;
  flex-direction: column;
  margin: 0;
  border: none;
  border-radius: 0.25rem;
  max-width: max-content;
}
</style>
