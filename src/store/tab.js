export default {
  state: {
    currentMenu: null,
    menu: [{
        path: "/person_info",
        name: "person_info",
        label: "个人中心",
        icon: "s-home",
        url: "person_info"
      },
      {
        path: "/resume",
        name: "resume",
        label: "简历管理",
        icon: "video-play",
        url: "resume"
      },
      {
        path: "/position",
        name: "position",
        label: "职位管理",
        icon: "user",
        url: "position"
      }
    ],
    tabsList: [{
      path: "/person_info",
      name: "person_info",
      label: "个人中心",
      icon: "s-home"
    }]
  },
  mutations: {
    addMenu(state, router) {
      // if (!Cookie.get("menu")) {
      //   return;
      // }
      // let menu = JSON.parse(Cookie.get("menu"));
      // state.menu = menu;
      let currentMenu = [{
        path: "/",
        component: () => import(`@/components/Hr_Index`),
        children: []
      }];
      this.menu.forEach(item => {
        if (item.children) {
          item.children = item.children.map(item => {
            item.component = () => import(`@/components/hr/${item.url}`);
            return item;
          });
          currentMenu[0].children.push(...item.children);
        } else {
          item.component = () => import(`@/components/hr/${item.url}`);
          currentMenu[0].children.push(item);
        }
      });
      router.addRoutes(currentMenu);
    },
    // setMenu(state, val) {
    //   state.menu = val;
    //   Cookie.set("menu", JSON.stringify(val));
    //   console.log(val, "vuex");
    // },
    // clearMenu(state) {
    //   state.menu = [];
    //   Cookie.remove("menu");
    // },
    selectMenu(state, val) {
      if (val.name !== "person_info") {
        state.currentMenu = val;
        let result = state.tabsList.findIndex(item => item.name === val.name);
        result === -1 ? state.tabsList.push(val) : "";
      } else {
        state.currentMenu = null;
      }
      val.name === "person_info" ?
        (state.currentMenu = null) :
        (state.currentMenu = val);
    },
    closeTab(state, val) {
      let result = state.tabsList.findIndex(item => item.name === val.name);
      state.tabsList.splice(result, 1);
    }
  },
  actions: {}
};