<template>
  <div>
    <!-- 查询分类简历 -->
    <div class="search">
      <div class="left">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            职位
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- 职位菜单按钮 -->
            <el-dropdown-item command="all">全部</el-dropdown-item>
            <el-dropdown-item v-for="item in dropDowns" :command="item" :key="item">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 根据简历情况查询情况的tab -->
        <template v-if="clickSearch">
          <el-tag
            size="small"
            @click="search_allResume()"
            :effect="this.searchType === 'allResume' ? 'dark' : 'plain'"
          >全部</el-tag>
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
            @click="search_quit()"
            :effect="this.searchType === 'quit' ? 'dark' : 'plain'"
          >已放弃</el-tag>
        </template>
        <template v-if="!clickSearch">
          <el-tag
            size="small"
            @click="search_allResume()"
            :effect="this.searchType === 'allResume' ? 'dark' : 'plain'"
          >全部</el-tag>
        </template>
      </div>
      <div class="right" style="display:flex">
        <el-input
          placeholder="请输入姓名或电话"
          class="input-with-select"
          clearable
          v-model="searchForm.keyword"
          @clear="clearSearch"
        ></el-input>
        <el-button
          type="primary"
          slot="append"
          icon="el-icon-search"
          @click="searchKeyword(searchForm.keyword)"
        >搜索</el-button>
      </div>
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
        <el-table-column prop="stateName" label="简历状态"></el-table-column>
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
              <el-dropdown-menu>
                <el-dropdown-item @click.native="sendOffer(scope.row.applicationId)">发送offer</el-dropdown-item>
                <el-dropdown-item @click.native="quit(scope.row.applicationId)">放弃</el-dropdown-item>
                <el-dropdown-item @click.native="interview(scope.row.applicationId)">安排面试</el-dropdown-item>
                <el-dropdown-item @click.native="onlineResume(scope.row)">简历在线预览</el-dropdown-item>
                <el-dropdown-item @click.native="downResume(scope.row)">简历下载</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>

    <!-- 简历对话框 -->
    <el-dialog title="简历详情" :visible.sync="ResumeVisible" width="40%">
      <!-- <span>专业能力</span> -->
      <label for="ability">专业能力</label>
      <div class="resumeDetail">{{ this.ability}}</div>
      <label for="internship">实习经历</label>
      <div class="resumeDetail">{{ this.internship}}</div>
      <label for="workExperience">工作经历</label>
      <div class="resumeDetail">{{ this.workExperience}}</div>
      <label for="certificate">获奖荣誉</label>
      <div class="resumeDetail">{{ this.certificate}}</div>
      <label for="jobDesire">就职期望</label>
      <div class="resumeDetail">{{ this.jobDesire}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ResumeVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 安排面试对话框 -->
    <el-dialog title="安排面试" :visible.sync="dialogInterview" width="40%">
      <el-form
        :model="formIterview"
        :label-width="formIterviewLabelWidth"
        :rules="rulesInterview"
        ref="formIterview"
      >
        <el-form-item label="面试的描述:" prop="description">
          <el-input
            v-model="formIterview.description"
            placeholder="如:5月19号晚上8点七天酒店"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="面试轮数:" :label-width="formIterviewLabelWidth" prop="rounds">
          <el-select v-model="formIterview.rounds" placeholder="请选择面试轮数">
            <el-option label="一面" value="1"></el-option>
            <el-option label="二面" value="2"></el-option>
            <el-option label="三面" value="3"></el-option>
            <el-option label="四面" value="4"></el-option>
            <el-option label="五面" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInterview = false">取 消</el-button>
        <el-button type="primary" @click="dialogInterviewConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 发送offer对话框 -->
    <el-dialog title="发送offer" :visible.sync="dialogSendoffer" width="40%">
      <el-form
        :model="formSendoffer"
        :label-width="formSendofferLabelWidth"
        :rules="rulesSendoffer"
        ref="formSendoffer"
      >
        <el-form-item label="发送消息:" prop="description">
          <el-input
            v-model="formSendoffer.description"
            placeholder="如:恭喜通过面试，喜获offer！"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSendoffer = false">取 消</el-button>
        <el-button type="primary" @click="dialogSendofferConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入hr模块的请求
import hrApi from "@/api/hr/hr";

export default {
  name: "Resume",
  data() {
    return {
      // 是否点击搜索框
      clickSearch: true,
      // 搜索框表单
      searchForm: {
        keyword: ""
      },
      // 保存applicationId
      applicationId: 0,

      // 发送offer对话框
      dialogSendoffer: false,
      formSendofferLabelWidth: "120px",
      formSendoffer: { description: "" },
      rulesSendoffer: {
        description: [
          { required: true, message: "请输入面试描述", trigger: "blur" }
        ]
      },
      // 安排面试对话框
      dialogInterview: false,
      formIterviewLabelWidth: "120px",
      formIterview: { description: "", rounds: "" },
      /*自定义表单验证规则*/
      rulesInterview: {
        description: [
          { required: true, message: "请输入面试描述", trigger: "blur" }
        ],
        rounds: [{ required: true, message: "请选择面试轮数", trigger: "blur" }]
      },
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
        total: 100,
        loading: false,
        lastPage: 1
      }
    };
  },
  methods: {
    // 获取表格中的简历数据
    getList() {
      this.config.loading = true;
      let params = {
        page: this.config.page,
        limit: 8
      };
      // 全部
      if (this.searchType === "allResume") {
        let url = "/resumeInfo";
        hrApi.getRequest1(url, params).then(res => {
          // 给表格数据赋值
          this.tableData = res.data.resumeInfo.list.map(item => {
            item.gender = item.gender === 1 ? "女" : "男";
            return item;
          });
          // 分页的参数赋值
          // this.lastPage = res.data.resumeInfo.lastPage;
        });
      } else if (this.searchType === "newResume") {
        let url = "/resume/0";
        hrApi.getRequest1(url, params).then(res => {
          // 给表格数据赋值
          this.tableData = res.data.resumes.list.map(item => {
            item.gender = item.gender === 1 ? "女" : "男";
            return item;
          });
          // 分页的参数赋值
          // this.lastPage = res.data.resumes.lastPage;
        });
      } else if (this.searchType === "beiXuan") {
        let url = "/resume/1";
        hrApi.getRequest(url).then(res => {
          this.tableData = res.data.resumes.list.map(item => {
            item.gender = item.gender === 1 ? "女" : "男";
            return item;
          });
        });
      } else if (this.searchType === "quit") {
        let url = "/resume/-1";
        hrApi.getRequest(url).then(res => {
          this.tableData = res.data.resumes.list.map(item => {
            item.gender = item.gender === 1 ? "女" : "男";
            return item;
          });
        });
      }
    },

    // 获取查询的职位菜单
    getPositionList() {
      let url = "/position/Combo";
      hrApi.getRequest(url).then(res => {
        // 给查询的下拉菜单赋值
        this.dropDowns = res.data.titles;
      });
    },
    // 分职位类别查询简历
    handleCommand(position) {
      // 点击按职位分类查询简历时,则简历查看情况的tab不加深显示
      this.searchType = "allResume";
      this.clickSearch = true;
      let url = "/position/category";
      let params = {
        page: 1,
        limit: 8
      };
      let url1 = "/resumeInfo/";
      hrApi.getRequest3(url, position).then(res => {
        res;
        hrApi.getRequest2(url1, params).then(res => {
          this.tableData = res.data.resumeInfo.list.map(item => {
            item.gender = item.gender === 1 ? "女" : "男";
            return item;
          });
        });
      });

      this.$message("click on  " + position);
    },
    // 取消搜索
    clearSearch() {
      this.clickSearch = true;
      this.getList();
    },
    // 搜索框搜索简历
    searchKeyword(keyword) {
      this.clickSearch = false;
      let url = "/search";
      let params = "keyword=" + keyword;
      hrApi.postRequest(url, params).then(res => {
        this.tableData = res.data.posInfo.list.map(item => {
          item.gender = item.gender === 1 ? "女" : "男";
          return item;
        });
      });
    },
    // hr通知发送offer
    dialogSendofferConfirm() {
      this.dialogSendoffer = false;
      this.$refs.formSendoffer.validate(valid => {
        /*会自动根据rules进行校验*/
        if (valid) {
          // url 为接口网址
          let url = "/sendNews/" + this.applicationId;
          let params =
            "interviewsDesc=" + this.formSendoffer.description + "&state=" + -3;
          hrApi.putRequest1(url, params).then(res => {
            res;
            this.getList();
          });
          this.$message.success("成功发送offer!");
        } else {
          this.$message.error("未发送提供offer信息!");
          return false;
        }
      });
    },
    // hr通知安排面试信息输入
    dialogInterviewConfirm() {
      this.dialogInterview = false;
      this.$refs.formIterview.validate(valid => {
        /*会自动根据rules进行校验*/
        if (valid) {
          // url 为接口网址
          let url = "/interview/" + this.applicationId;
          let params =
            "flag=" +
            this.formIterview.rounds +
            "&interviewsDesc=" +
            this.formIterview.description;
          hrApi.putRequest1(url, params).then(res => {
            if (res.statusText === "OK") {
              this.$message.success("安排面试成功!");

              this.getList();
            }
          });
          this.$refs.formIterview.resetFields();
        } else {
          this.$message.error("安排面试失败!未填写完整的面试通知信息!");
          return false;
        }
      });
    },
    //  分简历查看情况查询简历的方法
    search_allResume() {
      // 全部简历
      this.searchType = "allResume";
      this.getList();
    },
    search_newResume() {
      // 新简历
      this.searchType = "newResume";
      this.getList();
    },
    search_beiXuan() {
      // 备选
      this.searchType = "beiXuan";
      this.getList();
    },
    search_quit() {
      // 放弃
      this.searchType = "quit";
      this.getList();
    },

    // 操作栏方法

    // 发送offer
    sendOffer(applicationId) {
      this.dialogSendoffer = true;
      this.applicationId = applicationId;
    },
    // 放弃简历
    quit(id) {
      let url = "/removeresume/" + id;
      hrApi.putRequest(url).then(res => {
        res;
      });
    },
    // 安排面试
    interview(applicationId) {
      this.dialogInterview = true;
      this.applicationId = applicationId;
    },
    // 简历在线预览
    onlineResume(data) {
      let url = "/hr/resume/download/" + data.userId + "/inline";
      this.$http.get(url).then(res => {
        // 跳转到预览界面
        res;
        window.location.href = "http:localhost:8080" + url;
        // this.$router.push(res.config.url);
      });
    },
    // 简历下载
    downResume(data) {
      let url = "/hr/resume/download/" + data.userId + "/download";
      this.$http.get(url).then(res => {
        // 跳转到下载页面
        res;
        window.location.href = "http:localhost:8080" + url;
      });
    },

    // 显示简历的详细信息
    DisplayResume(applicationId) {
      let url = "/resume/ResumeDesc";
      let parms = "applicationId=" + applicationId;
      hrApi.postRequest(url, parms).then(res => {
        let resumeEntity = res.data.resumeEntity;
        this.ability = resumeEntity.ability;
        this.internship = resumeEntity.internship;
        this.workExperience = resumeEntity.workExperience;
        this.certificate = resumeEntity.certificate;
        this.jobDesire = resumeEntity.jobDesire;
      });

      this.ResumeVisible = true;
    }
  },
  created() {
    // 默认分页查询 查的是所有简历的范围
    this.searchType = "allResume";
    // 进入加载简历信息
    this.getList();
    // 进入加载职位信息
    this.getPositionList();
  }
};
</script>

<style lang="scss" scoped>
// 查询操作div
.search {
  display: flex;
  justify-content: space-between;
  margin-left: 10px;
  margin-bottom: 10px;
  .el-tag {
    margin-left: 10px;
  }
}
// 简历详情dialog
.el-dialog {
  .resumeDetail {
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
