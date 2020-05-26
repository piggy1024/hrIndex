<template>
  <!-- 职位管理 -->
  <div class="manage">
    <!-- 发布职位的弹出框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      :title="dialogType=='add' ? '发布职位':'修改职位'"
      class="addDialog"
      @close="closeAddDialog"
    >
      <!-- 表单 -->
      <el-form
        ref="operateFormRef"
        :model="operateForm"
        :rules="operateRules"
        label-width="80px"
        class="operateForm"
      >
        <el-form-item
          v-for="item in operateFormLabel"
          :key="item.model"
          :label="item.label"
          :prop="item.model"
        >
          <!-- 时间 -->
          <el-date-picker
            v-if="item.type == 'date'"
            v-model="operateForm[item.model]"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
          ></el-date-picker>
          <!-- 下拉框 -->
          <el-select
            v-else-if="item.type == 'select'"
            v-model="operateForm[item.model]"
            placeholder="请选择"
            @change="selectChange"
          >
            <el-option
              v-for="each in item.options"
              :key="each.value"
              :label="each.label"
              :value="each.value"
            ></el-option>
          </el-select>
          <!-- 普通输入框 -->
          <el-input v-else v-model="operateForm[item.model]" :type="item.inputType"></el-input>
        </el-form-item>
        <!-- 其他类别输入框 -->
        <el-input
          class="otherInput"
          :style="operateForm.categoryId == -1 ? 'display:block' : 'display: none'"
          autofocus
        ></el-input>
      </el-form>
      <!-- 脚部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddDialog">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 头部的新增按钮和搜索框 -->
    <div class="manage-header">
      <el-row type="flex" justify="space-between" style="width: 100%">
        <!-- 添加 -->
        <el-col :span="6">
          <el-button icon="el-icon-plus" type="primary" @click="addJob">发布职位</el-button>
        </el-col>
        <!-- 搜索 -->
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="searchForm.keyword"
            class="input-with-select"
            clearable
            @clear="getList"
          >
            <el-button type="primary" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <!-- 表格卡片区域 -->
    <el-card>
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <!-- 序号列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 内容列 -->
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : 80"
        ></el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作">
          <template slot-scope="slot">
            <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
              <el-button
                type="success"
                icon="el-icon-view"
                size="mini"
                @click="toDetails(slot.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editJob(slot.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteJob(slot.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="config.total"
        :current-page.sync="config.page"
        :page-size="config.limit"
        class="tablePagination"
        @current-change="getList()"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
// import hrApi from "@/api/hr/hr";

export default {
  data() {
    return {
      dialogType: "add",
      // 控制发布职位的dialog
      addDialogVisible: false,
      operateForm: {
        title: "",
        requirement: "",
        quantity: "",
        salaryDown: 0,
        salaryUp: 0,
        workCity: "",
        validDate: null,
        departmentId: "",
        hrIdPub: "",
        statePub: 1,
        categoryId: ""
      },
      operateFormLabel: [
        {
          model: "categoryId",
          label: "职位类别",
          options: [],
          type: "select"
        },
        {
          model: "title",
          label: "职位名称"
        },
        {
          model: "requirement",
          label: "工作要求",
          inputType: "textarea"
        },
        {
          model: "quantity",
          label: "招聘人数",
          inputType: "number"
        },
        {
          model: "workCity",
          label: "工作城市"
        },
        {
          model: "salaryDown",
          label: "最低月薪",
          inputType: "number"
        },
        {
          model: "salaryUp",
          label: "最高月薪",
          inputType: "number"
        },
        {
          model: "validDate",
          label: "截止时间",
          type: "date"
        }
      ],
      // 表单验证
      operateRules: {
        categoryId: [
          { required: true, message: "请选择职位分类", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
        requirement: [
          { required: true, message: "请填写工作要求", trigger: "blur" }
        ],
        quantity: [
          { required: true, message: "请输入招聘人数", trigger: "blur" }
        ],
        workCity: [
          { required: true, message: "请输入工作城市", trigger: "blur" }
        ],
        validDate: [
          { required: true, message: "请选择截止时间", trigger: "blur" }
        ]
      },
      // 列表的数据
      tableData: [],
      // 列表的行头数据
      tableLabel: [
        {
          prop: "title",
          label: "职位名称",
          width: 130
        },
        {
          prop: "quantity",
          label: "招聘人数"
        },
        {
          prop: "hits",
          label: "浏览量"
        },
        {
          prop: "workCity",
          label: "工作城市"
        },
        {
          prop: "requirement",
          label: "工作要求",
          width: 250
        },
        {
          prop: "money",
          label: "月薪",
          width: 120
        },
        {
          prop: "releaseDate",
          label: "发布时间",
          width: 120
        },
        {
          prop: "validDate",
          label: "截止时间",
          width: 120
        }
      ],
      // 控制列表的页码
      config: {
        page: 1,
        limit: 8,
        total: 20,
        loading: false
      },
      formLabel: [
        {
          model: "keyword",
          label: ""
        }
      ],
      searchForm: {
        keyword: ""
      },
      // hr的信息
      hrInfo: {}
    };
  },
  methods: {
    // 获取表单数据
    async getList() {
      this.config.loading = true;
      const res = await this.$http.get("/hr/position/" + this.config.page, {
        params: { limit: this.config.limit }
      });
      if (res.status == 200) {
        this.tableData = res.data.positions.list;
        this.tableData.forEach(item => {
          item.releaseDate = this.getDate(item.releaseDate.time);
          if (item.validDate) {
            item.validDate = this.getDate(item.validDate.time);
          }
          item.money = item.salaryDown + "~" + item.salaryUp;
        });
        this.config.total = res.data.positions.total;
        this.hrInfo = res.data.hr;
        // console.log(res);
        this.config.loading = false;
      } else {
        this.$message.error("获取职位列表数据失败！");
      }
    },
    // 跳转到详情页
    toDetails(row) {
      this.$message.info("跳转到详情页");
      // console.log(row);
      window.open("position/" + row.positionId, "_blank");
    },
    // 编辑修改职位
    async editJob(row) {
      this.dialogType = "edit";
      this.addDialogVisible = true;
      Object.assign(this.operateForm, row);
      // console.log("operateForm", this.operateForm)
      this.operateForm.positionId = row.positionId;
      this.operateForm.validDate = null;
    },
    // 撤回该职位
    deleteJob(row) {
      this.$confirm("此操作将永久撤回该职位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let id = row.positionId;
          const res = await this.$http.post("/position" + id + "/delete");
          if (res.status == 200) {
            this.getList();
            this.$message.success("删除成功");
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 发布职位
    addJob() {
      this.dialogType = "add";
      this.operateForm.departmentId = this.hrInfo.departmentId;
      this.operateForm.hrIdPub = this.hrInfo.hrId;
      this.operateForm.statePub = 1;
      this.operateForm.validDate = null;
      this.addDialogVisible = true;
    },
    // 监听选择类别的对话框
    selectChange() {},
    // 确定发布职位
    confirmAddDialog() {
      this.operateForm.salaryDown = parseInt(this.operateForm.salaryDown);
      this.operateForm.salaryUp = parseInt(this.operateForm.salaryUp);

      this.$refs.operateFormRef.validate(async valid => {
        if (valid) {
          var res;
          // 发布职位
          if (this.dialogType == "add") {
            var url = "/hr/position/create?";
            for (var key in this.operateForm) {
              url += key + "=" + this.operateForm[key] + "&";
            }
            url = url.slice(0, -1);
            res = await this.$http.post(url);
            // console.log(res)
          } else if (this.dialogType == "edit") {
            // 修改职位
            url =
              "/position" +
              this.operateForm.positionId +
              "/update/?title=" +
              this.operateForm.title +
              "&requirement=" +
              this.operateForm.requirement +
              "&quantity=" +
              this.operateForm.quantity +
              "&workCity=" +
              this.operateForm.workCity +
              "&salaryDown=" +
              this.operateForm.salaryDown +
              "&salaryUp=" +
              this.operateForm.salaryUp +
              "&validDate=" +
              this.operateForm.validDate +
              "&categoryId=" +
              this.operateForm.categoryId;
            res = await this.$http.post(url);
            // console.log(res)
          }
          if (res.status == 200) {
            this.addDialogVisible = false;
            this.$message.success("发布成功");
            this.getList();
          } else {
            this.$message.error("发布失败");
          }
        } else {
          this.$message.info("请填写完整必要项");
        }
      });
    },
    // 关闭发布职位对话框
    closeAddDialog() {
      this.$refs.operateFormRef.resetFields();
    },

    // 获取时间戳的时间
    getDate(time) {
      if (time) {
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        var day = date.getDate();
        if (day < 10) {
          day = "0" + day;
        }
        return year + "/" + month + "/" + day;
      }
      return null;
    },

    // 获取职位分类
    async getCategory() {
      const res = await this.$http.get("/hr/getCategory");
      if (res.status == 200) {
        res.data.categoryEntities.forEach(item => {
          var obj = {};
          obj.value = item.categoryId;
          obj.label = item.categoryName;
          this.operateFormLabel[0].options.push(obj);
        });
        var obj = {};
        obj.value = -1;
        obj.label = "其他";
        this.operateFormLabel[0].options.push(obj);
      }
      // console.log(res);
    }
  },
  created() {
    this.getList();
    this.getCategory();
  }
};
</script>
<style lang="scss" scoped>
.manage {
  min-width: 1250px;
}
.manage-header {
  margin-bottom: 15px;
}
.tablePagination {
  margin-top: 15px;
}
.operateForm {
  position: relative;

  .otherInput {
    position: absolute;
    top: 1px;
    left: 290px;
    width: 150px;
  }
}
</style>
