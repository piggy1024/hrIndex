import Cookie from "js-cookie"
export default {
  state: {
    isRoot: false,
    currentMenu: null,
    menu: [
      // {
      //   path: "/person_info",
      //   name: "person_info",
      //   label: "个人中心",
      //   icon: "s-home",
      //   url: "person_info"
      // },
      // {
      //   path: "/resume",
      //   name: "resume",
      //   label: "简历管理",
      //   icon: "video-play",
      //   url: "resume"
      // },
      // {
      //   path: "/position",
      //   name: "position",
      //   label: "职位管理",
      //   icon: "user",
      //   url: "position"
      // },
      // {
      //   path: "/interview",
      //   name: "interview",
      //   label: "面试管理",
      //   icon: "video-play",
      //   url: "interview"
      // },
      // {
      //   path: "/employ",
      //   name: "employ",
      //   label: "录用管理",
      //   icon: "video-play",
      //   url: "employ"
      // },
      // {
      //   path: "/talent",
      //   name: "talent",
      //   label: "人才库",
      //   icon: "video-play",
      //   url: "talent"
      // }

    ],
    tabsList: [{
      path: "/person_info",
      name: "person_info",
      label: "个人中心",
      icon: "s-home"
    }]
  },
  mutations: {
    // 根据登陆时的是root还是普通HR 给menu赋值
    handleMenu(state, menu) {
      state.menu = menu
      Cookie.set("menu", menu)
    },
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
      // this.menu.forEach(item => {
      //   if (item.children) {
      //     item.children = item.children.map(item => {
      //       item.component = () => import(`@/components/hr/${item.url}`);
      //       return item;
      //     });
      //     currentMenu[0].children.push(...item.children);
      //   } else {
      //     if (item.name === "talant") {
      //       console.log("1")
      //     } else {
      //       item.component = () => import(`@/components/hr/${item.url}`);
      //       currentMenu[0].children.push(item);
      //     }

      //   }
      // });
      router.addRoutes(currentMenu);
    },
    // setMenu(state, val) {
    //   state.menu = val;
    //   Cookie.set("menu", JSON.stringify(val));
    //   console.log(val, "vuex");
    // },
    // clearMenu(state) {
    //   state.currentMenu = [];
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