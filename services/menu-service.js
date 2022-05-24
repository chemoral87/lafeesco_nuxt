export class MenuService {
  constructor(authenticated, permissions) {
    this.authenticated = authenticated;
    this.permissions = permissions;
    console.log(this.permissions);
  }

  hasPermission(permission) {
    console.log("hasPermission ", permission);
    return this.permissions.includes(permission);
  }

  getMenu() {
    let menu = [];
    if (this.authenticated) {
      // logged
      menu.push({
        icon: "mdi-view-dashboard",
        title: "Dashboard",
        to: "/dashboard"
      });
      if (this.hasPermission("user-index"))
        menu.push({ icon: "mdi-account", title: "Usuarios", to: "/users" });
      if (this.hasPermission("role-index"))
        menu.push({ icon: "mdi-redhat", title: "Roles", to: "/roles" });
      if (this.hasPermission("permission-index"))
        menu.push({ icon: "mdi-key", title: "Permisos", to: "/permissions" });
      if (this.hasPermission("investment-index"))
        menu.push({
          icon: "mdi-pencil-box",
          title: "Inversiones",
          to: "/investment"
        });

      if (this.hasPermission("investment-my-profile")) {
        menu.push({
          icon: "mdi-account",
          title: "Perfil Inversor",
          to: "/investment-my/profile"
        });
      }
      if (this.hasPermission("investment-my-index")) {
        menu.push({
          icon: "mdi-pencil-box",
          title: "Inversiones",
          to: "/investment-my"
        });
      }
      if (this.hasPermission("credit-index")) {
        menu.push({ icon: "mdi-cash", title: "Creditos", to: "/credit" });
      }
      if (this.hasPermission("consolidador-index")) {
        menu.push({
          icon: "mdi-account-plus",
          title: "Consolidar",
          to: "/consolidate"
        });
      }
    } else {
      menu.push(
        {
          icon: "mdi-home",
          title: "Inicio",
          to: "/"
        },
        {
          icon: "mdi-lock",
          title: "Inicia Sesión ",
          to: "/login"
        }
      );
    }
    return menu;
  }
}
