<template>
  <v-app dark>
    <v-navigation-drawer :color=" authenticated? '' : 'banner'" v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" temporary app>
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
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact @click="closeDrawer">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-spacer />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app :color=" authenticated? '' : 'banner'">
      <v-app-bar-nav-icon @click.stop=" drawer=!drawer" />
      <v-toolbar-title style="cursor:pointer" v-text="title" @click="gotoHome()" />
      <v-spacer />
      <v-btn v-if="!authenticated" @click="gotoLogin()" color="banner_item elevation-2" class="mr-2">
        <v-icon>mdi-lock</v-icon> Login
      </v-btn>

      <!-- Usuario -->
      <v-menu v-if="authenticated" v-model="menu" offset-y :close-on-content-click="true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ml-3" small fab color="blue white--text" v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/account'">
            <v-list-item-content>
              <v-list-item-title>{{user.name}} {{ user.last_name }}</v-list-item-title>
              <v-list-item-subtitle>{{user.email}} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <!-- <v-list-item @click="roleDialog = true; menu = false" v-if="roles.length > 1">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon color="green" class="mr-1">{{role.icon_class}}</v-icon> {{ role.description }}
                <template v-if="housing">
                  - {{ housing.name }}
                </template>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
          <!-- <v-list-item v-else>
            <v-list-item-title>
              <v-icon class="mr-1">mdi-layers</v-icon> {{ role.description }}
              <template v-if="housing">
                - {{ housing.name }}
              </template>
            </v-list-item-title>
          </v-list-item> 
          <v-divider></v-divider> -->
          <v-list-item @click="logout()">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>mdi-logout</v-icon> Cerrar Sesión

              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <div class="snackbar-wrapper">
      <v-snackbar absolute :color="snackbar.color" v-model="snackbar_display" shaped multi-line right bottom :timeout="3800">
        <span class="text-subtitle-1 font-weight-bold">{{ snackbar.text }}</span>
        <template v-slot:action="{ attrs }">
          <v-btn color="grey" v-bind="attrs" fab small @click="closeSnackbar">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
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
    </v-navigation-drawer> -->
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
      // items: [
      //   {
      //     icon: 'mdi-home',
      //     title: 'Inicio',
      //     to: '/'
      //   },

      // ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      menu: false,
      title: 'RC DESARROLLADORA'
    };
  },
  computed: {
    snackbar_display: {
      get() {
        return this.snackbar.display;
      }, set() {
        this.$store.dispatch("closeNotify");
      }
    },
    items() {
      let menu = [];
      if (this.authenticated) { // logged
        menu.unshift({
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
          to: '/dashboard'
        },
          {
            icon: 'mdi-account',
            title: 'Usuarios',
            to: '/users'
          },
          {
            icon: 'mdi-redhat',
            title: 'Roles',
            to: '/roles'
          },
          {
            icon: 'mdi-key',
            title: 'Permisos',
            to: '/permissions'
          }
        );
      } else {
        menu.push(
          {
            icon: 'mdi-home',
            title: 'Inicio',
            to: '/'
          },
          {
            icon: 'mdi-message-text-lock',
            title: 'Aviso de privacidad',
            to: '/aviso-privacidad'
          },
          {
            icon: 'mdi-account-voice',
            title: 'Contacto',
            to: '/contacto'
          });
      }
      return menu;
    }
  },
  methods: {
    closeDrawer() {
      this.drawer = false;
    },
    gotoLogin() {
      this.$router.push('/login');
    },
    gotoHome() {
      this.$router.push('/');
    },
    logout() {
      this.menu = false;
      this.$auth.logout();
    },
    closeSnackbar() {
      this.$store.dispatch("closeNotify");
    }
  }
}
</script>
<style>
.snackbar-wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  pointer-events: none;
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>

