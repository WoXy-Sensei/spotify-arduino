<script setup lang="ts">
const { session, refresh, remove, reset, update, overwrite } = await useSession();

const store = useUserStore();
const route = useRoute();
const { notify } = useNotification();

const isAuthenticated = ref(store.isAuthenticated);
const user = ref({});

const devicesList = ref([]);
const deviceId = ref("");
const spotifyDeviceId = ref("");

if (!isAuthenticated.value && session.value.accessToken && session.value.refreshToken) {
  store.login(session.value.accessToken, session.value.refreshToken);
  isAuthenticated.value = store.isAuthenticated;
  await reset();
}

const loginSpotify = async () => {
  await navigateTo("api/auth", { external: true });
};

const logout = async () => {
  store.logout();
  await reset();
  isAuthenticated.value = store.isAuthenticated;
  window.location.reload();
};

const showDevices = async () => {
  const devicesData = await $fetch("api/devices", {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    method: "GET",
  });

  devicesList.value = devicesData.devices;
};

const setupDevice = async () => {
  if (deviceId.value && spotifyDeviceId.value && deviceId.value.length > 10) {
    const deviceData = $fetch("api/setup", {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
      body: {
        accessToken: store.accessToken,
        refreshToken: store.refreshToken,
        deviceId: deviceId.value,
        spotifyDeviceId: spotifyDeviceId.value,
      },
    });
    notify({
      title: "Success",
      message: "Device setup successfully",
      type: "success",
    });
    deviceId.value = "";

    return deviceData;
  } else {
    notify({
      title: "Error",
      message: "Please enter a valid device ID",
      type: "error",
    });
  }
};

const getUser = async () => {
  const userData = await $fetch("api/user", {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    method: "GET",
  });

  user.value = userData;
  user.value.image = userData.images[1].url;
  return user;
};

onMounted(() => {
  if (isAuthenticated.value) {
    getUser();
    showDevices();
  }
});
</script>

<template>
  <div class="container">
    <div v-if="!isAuthenticated">
      <button @click="loginSpotify">Login</button>
    </div>
    <div v-else>
      <div class="user">
        <img :src="user.image" alt="" />
        <h1>{{ user.display_name }}</h1>
      </div>
      <br />
      <input
        type="text"
        name="deviceId"
        v-model="deviceId"
        placeholder="Enter Device ID"
        style="width: 400px"
      />
      <br />

      <div class="devices">
        <h2>Spotify Devices</h2>
        <div v-for="device in devicesList">
          <div class="device">
            <input
              name="radio"
              :id="device.id"
              type="radio"
              :value="device.id"
              v-model="spotifyDeviceId"
            />
            <label :for="device.id">{{ device.name }}</label>
          </div>
        </div>
      </div>

      <button @click="setupDevice" style="width: 400px">Setup!</button>
      <button @click="logout">logout</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.device label:before {
  background: var(--primary-color);
  height: 20px;
  width: 20px;
  left: 21px;
  top: calc(50% - 10px);
  transform: scale(5);
  opacity: 0;
  visibility: hidden;
  transition: 0.4s ease-in-out 0s;
}

.user {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 20px;
  }
}

div {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  .devices {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .device [type="radio"] {
      display: none;
    }
    .device {
      label {
        display: block;
        padding: 20px 60px;
        background: #141414;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        font-weight: 400;
        min-width: 250px;
        white-space: nowrap;
        position: relative;
        transition: 0.4s ease-in-out 0s;
        margin-top: 10px;
        &:after,
        &:before {
          content: "";
          position: absolute;
          border-radius: 50%;
        }
        &:after {
          height: 19px;
          width: 19px;
          border: 2px solid var(--primary-color);
          left: 20px;
          top: calc(50% - 12px);
        }
      }
    }
  }
}
</style>
