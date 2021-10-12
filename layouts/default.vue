<template>
  <v-app dark>
    <v-navigation-drawer color="banner" v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" temporary app>
      <v-list>
        <v-list-item>
          <v-list-item-action class="mr-2">
            <v-img class="logo" width="35px" src="/rc_desarrolladora_logo.jpg"></v-img>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{title}}
            </v-list-item-title>
          </v-list-item-content>

        </v-list-item>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-spacer />

        <!-- <v-list-item>
          <v-list-item-content>
            Aviso
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            Contacto
          </v-list-item-content>
        </v-list-item> -->

        <!-- .d-none .d-sm-flex -->
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="banner">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>-->
      <v-toolbar-title style="cursor:pointer" v-text="title" @click="gotoHome()" />
      <v-spacer />
      <!-- <v-btn color="banner_item elevation-2" class="mr-2">Aviso de privacidad</v-btn>
      <v-btn color="banner_item elevation-2" class="mr-2">Contacto</v-btn> -->
      <v-btn @click="gotoLogin()" color="banner_item elevation-2" class="mr-2">
        <v-icon>mdi-lock</v-icon> Login
      </v-btn>
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false, // footer
      items: [
        {
          icon: 'mdi-home',
          title: 'Inicio',
          to: '/'
        },
        {
          icon: 'mdi-message-text-lock',
          title: 'Aviso de privacidad',
          to: '/privacy_notice'
        },
        {
          icon: 'mdi-account-voice',
          title: 'Contacto',
          to: '/contact'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'RC DESARROLLADORA'
    }
  },
  methods: {
    gotoLogin() {
      this.$router.push('/login')
    },
    gotoHome() {
      this.$router.push('/')
    }
  }
}
</script>
<style>
</style>

