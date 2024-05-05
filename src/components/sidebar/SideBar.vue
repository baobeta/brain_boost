<script lang="ts" setup>
import SidebarField from './SidebarField.vue';
import SidebarLogo from './SidebarLogo.vue';
import {
  faHouse,
  faBolt,
  faChartSimple,
  faBarsProgress,
  faGear
} from '@fortawesome/free-solid-svg-icons'
</script>
<template>
  <aside class="flex flex-col w-64 border-r-2 ">
    <SidebarLogo/>
    <SidebarField :name="'Home'" :icon="faHouse" isCurrent page="home"/>
    <SidebarField :name="'Today'" :icon="faBolt" page="home"/>
    <SidebarField :name="'Statistics'" :icon="faChartSimple" page="home"/>
    <SidebarField :name="'Manage Cards'" :icon="faBarsProgress" page="home"/>
    <SidebarField :name="'Settings'" :icon="faGear" page="home"/>
  </aside>
</template>
