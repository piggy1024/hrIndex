<template>
  <div>
    <el-container style="height:100%">
      <el-aside style="width: 200px">
        <el-menu router background-color="#545c64" text-color="#fff" default-active="/Person_Info">
          <div class="title">Hr管理中心</div>
          <el-menu-item
            :index="item.path"
            v-for="item in menu"
            :key="item.path"
            @click="clickMenu(item)"
          >
            <i :class="'el-icon-' + item.icon"></i>
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="homeHeader">
          <div>
            <!-- // 面包屑 -->
            <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>活动管理</el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>-->
          </div>
          <div>
            <el-button
              icon="el-icon-setting"
              type="text"
              style="margin-right: 8px;color: #fff;"
              size="normal"
            ></el-button>
            <el-dropdown class="userInfo" @command="commandHandler">
              <span class="el-dropdown-link">
                设置
                <!--双引号里一般解释为字符串，但用v-bind绑定后就可以当成变量-->
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command="个人中心">个人中心</el-dropdown-item>
                <el-dropdown-item command="设置">设置</el-dropdown-item>-->
                <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <!-- <common-tab></common-tab> -->
        <div class="tabs">
          <el-tag
            :key="tag.name"
            v-for="(tag, index) in tags"
            :closable="tag.name !== 'person_info'"
            :disable-transitions="false"
            @close="handleClose(tag, index)"
            size="medium"
            @click="changeMenu(tag)"
            type="primary"
            :effect="$route.name === tag.name ? 'dark' : 'plain'"
          >{{ tag.label }}</el-tag>
        </div>

        <el-main style="height:700px">
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <!-- <div class="line"></div> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import hrApi from "@/api/hr/hr";

export default {
  name: "Hr_Index",
  components: {},
  data() {
    return {
      activeIndex: "4",
      user: JSON.parse(window.sessionStorage.getItem("user"))
    };
  },
  computed: {
    // store返回显示左边的菜单
    menu() {
      return this.$store.state.tab.menu;
    },
    ...mapState({
      tags: state => state.tab.tabsList
    })
  },
  created() {
    // 登陆后显示的页面为个人中心页面
    this.$router.push("/Person_Info");
    // 刷新的时候将tab的菜单清空
    this.currentMenu = [];
  },
  methods: {
    // 点击tab菜单项跳转页面
    changeMenu(item) {
      this.$router.push({ name: item.name });
      this.$store.commit("selectMenu", item);
    },

    clickMenu(item) {
      this.$router.push({ name: item.name });
      this.$store.commit("selectMenu", item);
    },

    ...mapMutations({
      close: "closeTab"
    }),

    // tab的方法
    handleClose(tag, index) {
      let length = this.tags.length - 1;
      this.close(tag);

      // 如果关闭的标签不是当前路由的话，就不跳转
      if (tag.name !== this.$route.name) {
        return;
      }
      // 关闭的标签是最右边的话，往左边跳转一个
      if (index === length) {
        this.$router.push({ name: this.tags[index - 1].name });
      } else {
        // 否则往右边跳转
        this.$router.push({ name: this.tags[index].name });
      }
    },

    // 右上角登出按钮的方法
    commandHandler(cmd) {
      if (cmd == "logout") {
        this.$confirm("此操作将退出登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            hrApi.postRequest0("/logout").then(() => {
              window.sessionStorage.removeItem("user");
              // this.$store.commit("initRoutes", []);
              this.$router.replace("/");
              this.$message({
                type: "success",
                message: "成功退出!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.homeHeader {
  background: #333;
  display: flex; /*弹性布局*/
  align-items: center;
  font-size: 30px;
  justify-content: space-between;
}
.title {
  font-family: 华文行楷;
  color: white;
  font-size: 35px;
  text-align: center;
  margin: 15px 0;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #f2fcff;
}
.el-dropdown-link img {
  width: 48px;
  height: 48px;
  /*设置圆弧*/
  border-radius: 24px;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.userInfo {
  cursor: pointer;
}
.homeItem {
  font-size: 30px;
  text-align: center;
  color: dodgerblue;
  font-family: 华文行楷;
  padding-top: 250px;
}

/* 左侧导航页占满高度 */
.el-menu {
  height: 100%;
}
/* tab样式 */

.tabs {
  padding: 15px 15px 0 15px;
  .el-tag {
    margin-right: 15px;
  }
}
</style>
