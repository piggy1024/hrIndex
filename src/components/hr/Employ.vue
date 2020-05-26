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
      </div>
      <div class="right" style="display:flex">
        <el-input
          placeholder="请输入姓名或电话"
          class="input-with-select"
          clearable
          v-model="searchForm.keyword"
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
                <el-dropdown-item @click.native="interview(scope.row.applicationId)">安排下一场面试</el-dropdown-item>
                <el-dropdown-item @click.native="quit(scope.row.applicationId)">面试未通过进人才库</el-dropdown-item>
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
    <!-- <el-dialog title="安排面试" :visible.sync="dialogInterview" width="40%">
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
    </el-dialog>-->
    <!-- 发送offer对话框 -->
    <!-- <el-dialog title="发送offer" :visible.sync="dialogSendoffer" width="40%">
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
    </el-dialog>-->
  </div>
</template>

<script>
// 引入hr模块的请求
import hrApi from "@/api/hr/hr";

export default {
  name: "Resume",
  data() {
    return {
      // 是否点击了点击了搜索框进行搜索
      isSearch: false,
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
      let url = "/resume/-3";
      let params = "page=" + this.config.page + "limit=" + 8;
      hrApi.getRequest1(url, params).then(res => {
        // console.log(res);
        this.tableData = res.data.resumes.list.map(item => {
          item.gender = item.gender === 1 ? "女" : "男";
          return item;
        });
      });
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
      // 点击职位搜索 就不是处理搜索框搜索的状态
      this.isSearch = false;

      // 点击按职位分类查询简历时,则简历查看情况的tab不加深显示
      this.searchType = "allResume";
      let url = "/position/category";
      let params = "page=" + this.config.page + "&limit=" + 8;
      let url1 = "/interview/all";
      hrApi.getRequest3(url, position).then(res => {
        res;
        hrApi.getRequest(url1, params).then(res => {
          this.tableData = res.data.interviews.list.map(item => {
            item.gender = item.gender === 1 ? "女" : "男";
            return item;
          });
        });
      });
      this.$message("click on item " + position);
    },
    // 搜索框搜索简历
    searchKeyword(keyword) {
      // 处于搜索框搜索状态,点击一面搜索是在搜索出的内容里找一面的简历
      this.isSearch = true;

      this.searchType = "allResume";
      let url = "/search";
      let params =
        "keyword=" + keyword + "&page=" + this.config.page + "&limit=" + 8;
      hrApi.postRequest(url, params).then(res => {
        this.tableData = res.data.posInfo.list.map(item => {
          item.gender = item.gender === 1 ? "女" : "男";
          return item;
        });
      });
    },
    // hr通知发送offer
    // dialogSendofferConfirm() {
    //   this.dialogSendoffer = false;
    //   this.$refs.formSendoffer.validate(valid => {
    //     /*会自动根据rules进行校验*/
    //     if (valid) {
    //       // url 为接口网址
    //       let url = "/sendnews/" + this.applicationId;
    //       let params =
    //         "interviewsDesc=" + this.formSendoffer.description + "&state=" + -3;
    //       hrApi.putRequest1(url, params).then(res => {
    //         res;
    //         this.getList();
    //       });
    //       this.$message.success("成功发送offer!");
    //     } else {
    //       this.$message.error("未发送提供offer信息!");
    //       return false;
    //     }
    //   });
    // },
    // // hr通知安排面试信息输入
    // dialogInterviewConfirm() {
    //   this.dialogInterview = false;
    //   this.$refs.formIterview.validate(valid => {
    //     /*会自动根据rules进行校验*/
    //     if (valid) {
    //       // console.log("应该是3吧+" + this.applicationId);
    //       // console.log(this.formIterview.rounds);

    //       // url 为接口网址
    //       let url = "/Interview/" + this.applicationId;
    //       let params =
    //         "flag=" +
    //         this.formIterview.rounds +
    //         "&interviewsDesc=" +
    //         this.formIterview.description +
    //         "applicationId" +
    //         this.applicationId;
    //       hrApi.putRequest1(url, params).then(res => {
    //         if (res.statusText === "OK") {
    //           this.getList();
    //         }
    //       });
    //     } else {
    //       this.$message.error("安排面试失败!未填写完整的面试通知信息!");
    //       return false;
    //     }
    //   });
    // },
    // //  分简历查看情况查询简历的方法
    // search_allResume() {
    //   // 全部简历
    //   this.searchType = "allResume";
    //   this.getList();
    // },
    // search_first() {
    //   // 一面
    //   this.searchType = "first";
    //   this.getList();
    // },
    // search_second() {
    //   // 二面
    //   this.searchType = "second";
    //   this.getList();
    // },
    // search_third() {
    //   // 三面
    //   this.searchType = "third";
    //   this.getList();
    // },
    // search_more() {
    //   // 更多面
    //   this.searchType = "more";
    //   this.getList();
    // },
    // // 发送offer
    // sendOffer(applicationId) {
    //   this.dialogSendoffer = true;
    //   this.applicationId = applicationId;
    // },
    // // 放弃简历  url需要修改为/abandon/
    // quit(id) {
    //   let url = "/interview/" + id;
    //   // let params = id;
    //   hrApi.putRequest(url).then(res => {
    //     this.$message.success(res.data);
    //   });
    //   // console.log("行数" + id);
    // },

    // // 安排面试
    // interview(applicationId) {
    //   this.dialogInterview = true;
    //   this.applicationId = applicationId;
    // },

    // 显示简历的详细信息
    DisplayResume(applicationId) {
      let url = "/resume/ResumeDesc";
      let parms = "applicationId=" + applicationId;
      hrApi.postRequest(url, parms).then(res => {
        // console.log(res.data.resumeEntity);
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
    this.searchType = "allResume";
    this.getList();

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
