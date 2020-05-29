<template>
  <!-- RootHR管理页面 -->
  <div class="manage">
    <!-- 发布职位的弹出框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      :title="dialogType=='add' ? '增加HR':'修改HR信息'"
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

          <!-- 普通输入框 -->
          <el-input
            v-else
            v-model="operateForm[item.model]"
            :type="item.inputType"
            :disabled="item.readonly"
          ></el-input>
        </el-form-item>
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
          <el-button icon="el-icon-plus" type="primary" @click="addHR">增加HR</el-button>
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
            <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editHR(slot.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteHR(slot.row)"
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
export default {
  data() {
    return {
      // 记录点击哪个HR的ID
      markHRID: 0,
      // 弹框类型
      dialogType: "add",
      // 控制修改子HR信息的dialog
      addDialogVisible: false,
      operateForm: {
        name: "",
        hrID: "",
        mobile: "",
        email: "",
        description: "",
        password: "",
        departmentId: ""
      },
      operateFormLabel: [
        {
          model: "name",
          label: "姓名"
        },
        {
          model: "hrID",
          label: "hrID",
          readonly: true
        },
        {
          model: "mobile",
          label: "手机号码"
        },
        {
          model: "email",
          label: "邮箱"
        },
        {
          model: "description",
          label: "描述"
        },
        {
          model: "departmentId",
          label: "部门编号"
        },
        {
          model: "password",
          label: "密码"
        }
      ],
      // 表单验证
      operateRules: {
        name: [{ required: true, message: "请输入该HR名字", trigger: "blur" }],
        hrID: [{ required: true, message: "请输入该HRID", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输出如该HR手机号码", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入该HR邮箱", trigger: "blur" }],
        description: [
          { required: true, message: "请输入该HR的描述", trigger: "blur" }
        ],
        departmentId: [
          { required: true, message: "请输入该HR的部门编号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入该HR的重置密码", trigger: "blur" }
        ]
      },
      // 列表的数据
      tableData: [
        {
          name: "Piggy",
          hrID: 11,
          mobile: "15819091730",
          email: "piggy1024@qq.com",
          description: "HR管理",
          departmentId: 0
        }
      ],
      // 列表的行头数据
      tableLabel: [
        {
          prop: "name",
          label: "姓名",
          width: 130
        },
        {
          prop: "hrID",
          label: "hrID",
          width: 120
        },
        {
          prop: "mobile",
          label: "手机号码",
          width: 200
        },
        {
          prop: "email",
          label: "邮箱",
          width: 250
        },
        {
          prop: "description",
          label: "描述",
          width: 250
        },
        {
          prop: "departmentId",
          label: "部门编号",
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
      }
    };
  },
  methods: {
    closeAddDialog() {},
    selectChange() {},
    confirmAddDialog() {
      if (this.dialogType === "edit") {
        console.log("edit");
        let url =
          "hr/info/update/" +
          this.markHRID +
          "?hrid=" +
          this.operateForm.hrID +
          "&hrMobile=" +
          this.operateForm.mobile +
          "&hrPassword=" +
          this.operateForm.password +
          "&hrName=" +
          this.operateForm.name +
          "&hrEmail=" +
          this.operateForm.email +
          "&description=" +
          this.operateForm.description +
          "&departmentId=" +
          this.operateForm.departmentId;
        this.$http.post(url).then(res => {
          res;
          // console.log(res);
        });
      } else {
        // console.log("add");
      }
    },
    // 添加HR
    addHR() {},
    // 修改HR信息
    editHR(data) {
      this.dialogType = "edit";
      this.addDialogVisible = true;
      this.operateForm = data;
      // 记录所编辑的HR的ID   data为scope.row
      this.markHRID = data.hrID;
    },
    // 删除HR
    deleteHR(data) {
      // console.log(data);
      let url = "roothr/delete/" + data.hrID;
      this.$http.post(url).then(res => {
        res;
      });
    },
    // 获取列表信息
    getList() {
      let url = "/roothr/search?" + "page=" + this.config.page + "&limit=" + 8;
      this.$http.post(url).then(res => {
        console.log(res.data);
        this.tableData = res.data.posInfo.list;
      });
    }
  },
  created() {
    // 已进入页面即加载列表数据
    // this.getList();
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