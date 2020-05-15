<template>
  <div>
    <!-- 查询分类简历 -->
    <div class="search">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          职位
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in dropDowns" :command="item" :key="item">{{ item }}</el-dropdown-item>
          <!-- <el-dropdown-item command="a">黄金糕</el-dropdown-item>
          <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 根据简历情况查询情况的tab -->
      <template>
        <el-tag
          size="small"
          @click="search_newResume()"
          :effect="this.searchType === 'newResume' ? 'dark' : 'plain'"
        >新简历</el-tag>
        <el-tag
          size="small"
          @click="search_beiXuan()"
          :effect="this.searchType === 'beiXuan' ? 'dark' : 'plain'"
        >备选</el-tag>
        <el-tag
          size="small"
          @click="search_array()"
          :effect="this.searchType === 'array' ? 'dark' : 'plain'"
        >已安排</el-tag>
        <el-tag
          size="small"
          @click="search_quit()"
          :effect="this.searchType === 'quit' ? 'dark' : 'plain'"
        >已放弃</el-tag>
        <el-tag
          size="small"
          @click="search_pass()"
          :effect="this.searchType === 'pass' ? 'dark' : 'plain'"
        >通过</el-tag>
      </template>
    </div>
    <!-- 表格数据 -->
    <el-card>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column prop="eduDegree" label="学历"></el-table-column>
        <el-table-column prop="dirDesire" label="工龄"></el-table-column>
        <el-table-column prop="graduation" label="毕业院校"></el-table-column>
        <el-table-column prop="title" label="应聘职位"></el-table-column>
        <el-table-column label="个人简历" width="80">
          <template slot-scope="scope">
            <!-- 简历按钮 -->
            <el-button
              type="wraning"
              icon="el-icon-document-remove"
              size="mini"
              @click="DisplayResume(scope.row.applicationId)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-dropdown size="mini" split-button type="primary">
              操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="sendOffer(scope.applicationId)">发送offer</el-dropdown-item>
                <el-dropdown-item @click.native="quit(scope.applicationId)">放弃</el-dropdown-item>
                <el-dropdown-item @click.native="downloadResume(scope.applicationId)">下载简历</el-dropdown-item>
                <el-dropdown-item @click.native="shareResume(scope.applicationId)">推荐/共享</el-dropdown-item>
                <el-dropdown-item @click.native="interview(scope.applicationId)">安排面试</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 简历对话框 -->
    <el-dialog title="简历详情" :visible.sync="ResumeVisible" width="40%">
      <!-- <span>专业能力</span> -->
      <label for="ability">专业能力</label>
      <div>{{ this.ability}}</div>
      <label for="internship">实习经历</label>
      <div>{{ this.internship}}</div>
      <label for="workExperience">工作经历</label>
      <div>{{ this.workExperience}}</div>
      <label for="certificate">获奖荣誉</label>
      <div>{{ this.certificate}}</div>
      <label for="jobDesire">就职期望</label>
      <div>{{ this.jobDesire}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ResumeVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="config.total"
      :current-page.sync="config.page"
      :page-size="8"
      class="tablePagination"
      @current-change="getList()"
    ></el-pagination>
  </div>
</template>

<script>
// 引入hr模块的请求
import hrApi from "@/api/hr/hr";

export default {
  name: "Resume",
  data() {
    return {
      // 简历详情中的5个字段
      ability: "",
      internship: "",
      workExperience: "",
      certificate: "",
      jobDesire: "",
      // 简历状态查询类型
      searchType: "",
      // 职位查询下拉菜单
      dropDowns: [],
      // 简历显示
      ResumeVisible: false,
      // 表格的简历数据
      tableData: [],
      // 控制列表的页码
      config: {
        page: 1,
        total: 33,
        loading: false
      }
    };
  },
  methods: {
    //  分简历查看情况查询简历的方法
    search_newResume() {
      // 新简历
      this.searchType = "newResume";
      let url = "/resume/0";
      hrApi.getRequest(url).then(res => {
        this.tableData = res.data.resumes;
      });
    },
    search_beiXuan() {
      // 备选
      this.searchType = "beiXuan";
      let url = "/resume/1";
      hrApi.getRequest(url).then(res => {
        this.tableData = res.data.resumes;
      });
    },
    search_array() {
      // 已安排
      this.searchType = "array";
      let url = "/resume/2";
      hrApi.getRequest(url).then(res => {
        this.tableData = res.data.resumes;
      });
    },
    search_quit() {
      // 放弃
      this.searchType = "quit";
      let url = "/resume/-1";
      hrApi.getRequest(url).then(res => {
        this.tableData = res.data.resumes;
      });
    },
    search_pass() {
      // 通过
      this.searchType = "pass";
      let url = "/resume/-3";
      hrApi.getRequest(url).then(res => {
        this.tableData = res.data.resumes;
      });
    },
    getPosition() {
      // 给查询的下拉菜单赋值
      this.dropDowns = ["HR实习生", "前端实习生", "后端实习生"];
    },
    // 分职位类别查询简历
    handleCommand(command) {
      // 点击按职位分类查询简历时,则简历查看情况的tab不加深显示
      this.searchType = "";
      this.$message("click on item " + command);
    },
    // 发送offer
    sendOffer(row) {
      console.log("行数" + row.hrName);
    },
    // 放弃简历
    quit(row) {
      console.log("行数" + row);
    },
    // 下载简历
    downloadResume(row) {
      console.log("行数" + row);
    },
    // 推荐/共享简历
    shareResume(row) {
      console.log("行数" + row);
    },
    // 安排面试
    interview(row) {
      console.log("行数" + row);
    },

    // 显示简历的详细信息
    DisplayResume(id) {
      console.log(id);
      let url = "/resume/ResumeDesc";
      let parms = "applicationId=" + id;
      hrApi.postRequst(url, parms).then(res => {
        // console.log(res.data.resumeEntity);
        let resumeEntity = res.data.resumeEntity;
        this.ability = resumeEntity.ability;
        this.internship = resumeEntity.internship;
        this.workExperience = resumeEntity.workExperience;
        this.certificate = resumeEntity.certificate;
        this.jobDesire = resumeEntity.jobDesire;
      });

      this.ResumeVisible = true;
    },
    // 获取表格中的简历数据
    getList() {
      this.config.loading = true;
      let url = "/resumeInfo";
      hrApi.getRequest(url).then(res => {
        // console.log(res.data.resumeInfo);
        this.tableData = res.data.resumeInfo;
      });
    }
  },
  created() {
    this.getList();
    this.getPosition();
  }
};
</script>

<style lang="scss" scoped>
// 查询操作div
.search {
  padding-left: 10px;
  margin-bottom: 10px;
  .el-tag {
    margin-left: 10px;
  }
}
// 简历详情dialog
.el-dialog {
  div {
    height: 100px;
    border: 1px #0f0f0f solid;
    border-radius: 5px;
    margin-bottom: 15px;
    margin-top: 5px;
  }
}
.tablePagination {
  margin-top: 15px;
}
// 操作栏下拉菜单
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
