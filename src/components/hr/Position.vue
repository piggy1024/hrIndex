<template>
  <!-- 职位管理 -->
  <div class="manage">
    <!-- 新增和更新的弹出框 -->
    <el-dialog
      :visible.sync="isShow"
      :title="operateType === 'add' ? '新增职位' : '更新职位'"
      class="mDialog"
      @close="closeDialog"
    >
      <!-- 表单 -->
      <el-form ref="operateRef" :model="operateForm" :rules="operateRules" label-width="80px">
        <el-form-item
          v-for="item in operateFormLabel"
          :key="item.model"
          :label="item.label"
          :prop="item.model"
        >
          <el-input v-model="operateForm[item.model]"></el-input>
        </el-form-item>
      </el-form>
      <!-- 脚部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
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
          :width="item.width ? item.width : 90"
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
        :page-size="8"
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
      // 控制编辑添加的dialog
      isShow: false,
      operateType: "add",
      operateForm: {
        company: "",
        companyDes: "",
        job: "",
        jobDirection: "",
        department: "",
        departmentDes: "",
        jobRequirement: "",
        peopleNum: "",
        benefits: "",
        money: "",
        city: ""
      },
      operateFormLabel: [
        {
          model: "company",
          label: "公司名称"
        },
        {
          model: "companyDes",
          label: "公司描述"
        },
        {
          model: "job",
          label: "职位名称"
        },
        {
          model: "jobDirection",
          label: "职位方向"
        },
        {
          model: "jobDes",
          label: "职位描述"
        },
        {
          model: "department",
          label: "工作部门"
        },
        {
          model: "jobRequirement",
          label: "任职要求"
        },
        {
          model: "peopleNum",
          label: "招聘人数"
        },
        {
          model: "benefits",
          label: "福利待遇"
        },
        {
          model: "money",
          label: "工资"
        },
        {
          model: "city",
          label: "工作城市",
          type: "",
          opts: [
            { value: "beijing", label: "北京" },
            { value: "shanghai", label: "上海" },
            { value: "guangzhou", label: "广州" },
            { value: "shenzhen", label: "深圳" },
            { value: "hangzhou", label: "杭州" }
          ]
        }
      ],
      // 表单验证
      operateRules: {
        company: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        job: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
        peopleNum: [
          { required: true, message: "请输入招聘人数", trigger: "blur" }
        ]
      },
      // 列表的数据
      tableData: [],
      // 列表的行头数据
      tableLabel: [
        {
          prop: "job",
          label: "职位名称",
          width: 200
        },
        {
          prop: "jobDirection",
          label: "职位方向",
          width: 260
        },
        {
          prop: "department",
          label: "工作部门"
        },
        {
          prop: "money",
          label: "工资"
        },
        {
          prop: "peopleNum",
          label: "招聘人数"
        },
        {
          prop: "city",
          label: "工作城市",
          width: 200
        }
      ],
      // 控制列表的页码
      config: {
        page: 1,
        total: 33,
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
    // 获取表单数据
    // getList(name = "") {
    getList() {
      this.config.loading = true;
      this.tableData = [
        {
          job: "算法工程师-自动驾驶",
          jobDirection: "数据挖掘,其他方向,计算机视觉",
          department: "研发部",
          money: "9k~12k",
          peopleNum: "7人",
          city: "北京市,杭州市,广州市"
        },
        {
          job: "算法工程师-自动驾驶",
          jobDirection: "数据挖掘,其他方向,计算机视觉",
          department: "研发部",
          money: "9k~12k",
          peopleNum: "7人",
          city: "北京市,杭州市,广州市"
        },
        {
          job: "算法工程师-自动驾驶",
          jobDirection: "数据挖掘,其他方向,计算机视觉",
          department: "研发部",
          money: "9k~12k",
          peopleNum: "7人",
          city: "北京市,杭州市,广州市"
        },
        {
          job: "算法工程师-自动驾驶",
          jobDirection: "数据挖掘,其他方向,计算机视觉",
          department: "研发部",
          money: "9k~12k",
          peopleNum: "7人",
          city: "北京市,杭州市,广州市"
        },
        {
          job: "算法工程师-自动驾驶",
          jobDirection: "数据挖掘,其他方向,计算机视觉",
          department: "研发部",
          money: "9k~12k",
          peopleNum: "7人",
          city: "北京市,杭州市,广州市"
        },
        {
          job: "算法工程师-自动驾驶",
          jobDirection: "数据挖掘,其他方向,计算机视觉",
          department: "研发部",
          money: "9k~12k",
          peopleNum: "7人",
          city: "北京市,杭州市,广州市"
        },
        {
          job: "算法工程师-自动驾驶",
          jobDirection: "数据挖掘,其他方向,计算机视觉",
          department: "研发部",
          money: "9k~12k",
          peopleNum: "7人",
          city: "北京市,杭州市,广州市"
        },
        {
          job: "算法工程师-自动驾驶",
          jobDirection: "数据挖掘,其他方向,计算机视觉",
          department: "研发部",
          money: "9k~12k",
          peopleNum: "7人",
          city: "北京市,杭州市,广州市"
        }
      ];
      this.config.loading = false;
    },
    // 跳转到详情页
    // toDetails(row) {
    toDetails() {
      this.$message.info("跳转到详情页");
    },
    // 编辑修改职位
    editJob(row) {
      this.operateType = "edit";
      this.isShow = true;
      Object.assign(this.operateForm, row);
      console.log("operateForm", this.operateForm);
      // this.operateForm = row;
    },
    // 撤回该职位
    deleteJob(row) {
      this.$confirm("此操作将永久撤回该职位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let id = row.id;

          // 调试添加
          id;

          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加职位
    addJob() {
      this.operateForm = {};
      this.operateType = "add";
      this.isShow = true;
    },
    confirm() {
      this.$refs.operateRef.validate(valid => {
        if (valid) {
          // 编辑
          if (this.operateType === "edit") {
            this.isShow = false;
            this.$message.success("修改成功");
          } else if (this.operateType === "add") {
            // 添加
            this.$http.post("/api/user/add", this.operateForm).then(res => {
              this.isShow = false;

              // 调试添加
              res;

              this.$message.success("添加成功");
              this.getList();
            });
          }
        } else {
          this.$message.info("请填写完整必要项");
        }
      });
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.operateRef.resetFields();
      // 清空表单数据
      for (var key in this.operateForm) {
        this.operateForm[key] = "";
      }
      console.log(this.operateForm);
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
// @import "@/assets/scss/common";
.manage {
  min-width: 1200px;
}
.manage-header {
  margin-bottom: 15px;
}
.tablePagination {
  margin-top: 15px;
}
</style>
