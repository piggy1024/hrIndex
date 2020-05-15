<template>
  <div>
    <el-card shadow="hover">
      <el-row :gutter="20">
        <el-col :span="8" class="oo">
          <div class="user">
            <img :src="userImg" />
          </div>
          <div>
            <div>
              <p class="name">
                姓名：
                {{ this.userlist.hrName }}
              </p>
              <!-- <p class="access">{{ this.userlist.access }}</p> -->
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="userinfo">
            <p class="title">个人信息</p>
            <p>
              ID：
              {{ this.userlist.hrId }}
            </p>
            <p>
              手机：
              {{ this.userlist.hrMobile }}
            </p>
            <p>
              邮箱：
              {{ this.userlist.hrEmail }}
            </p>
            <p>
              描述：
              {{ this.userlist.description }}
            </p>
          </div>
        </el-col>
        <el-col :span="4">
          <!-- 这里 showEditDialog()里面要传个不能改变的ID  下面的用showEditDialog(id)接收-->
          <el-button type="primary" @click="showEditDialog()">修改信息</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 修改信息对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="ID">
          <!-- ID不可以修改 -->
          <el-input v-model="editForm.hrId" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.hrName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.hrEmail"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.hrMobile"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.hrPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import hrApi from "@/api/hr/hr";
export default {
  data() {
    return {
      userImg: require("../../assets/images/user.png"),
      userlist: {
        hrName: "Nick",
        access: "HR管理员",
        hrId: "",
        hrMobile: "",
        hrEmail: "",
        description: "",
        password: ""
      },
      // 控制修改个人信息对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的个人信息对象
      editForm: {}
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      hrApi.postRequest1("/info").then(res => {
        this.userlist = res.data.hr;
        // 给修改页面的dialog赋值
        this.editForm = this.userlist;
        // console.log(res.data.hr);
      });
    },
    // 个人信息修改按钮监听事件
    showEditDialog() {
      this.editDialogVisible = true;
    },
    editUserInfo() {
      let url = "/info/update";
      // post请求参数拼接
      let params =
        "hrMobile=" +
        this.editForm.hrMobile +
        "&hrPassword=" +
        this.editForm.password +
        "&hrName=" +
        this.editForm.hrName +
        "&hrEmail=" +
        this.editForm.hrEmail +
        "&description=" +
        this.editForm.description +
        "&departmentId=" +
        this.editForm.departmentId;
      hrApi.postRequest(url, params).then(res => {
        // console.log(res);
        if (res.status === 200) {
          this.$message.success("修改个人信息成功");
          // 刷新数据
          this.getUserList();
        }
      });
      // 提交前的预验证
      // this.$refs.editFoemRef.validata(async vaild => {
      //   if (!vaild) return;
      //   // 发起个人信息修改的请求
      //   const { data: res } = await this.$http.get('users/' + this.editForm.id, {
      //     email: this.editForm.email,
      //     mobile: this.editForm.mobile
      //   })
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('修改个人信息失败');
      //   } else {
      //     // 关闭对话框
      //     this.editDialogVisible = false;
      //     // 更新数据列表
      //     this.getUserList();
      //     // 提示修改成功
      //     return this.$message.success('修改个人信息成功');
      //   }
      // })
      this.editDialogVisible = false;
    }
  }
};
</script>
<style scoped>
.oo {
  text-align: center;
}
.user {
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.user img {
  text-align: center;
  height: 150px;
  width: 150px;
  border-radius: 50%;
  vertical-align: middle;
}
.name {
  font-size: 16px;
  margin-bottom: 10px;
  text-align: center;
}

.access {
  color: #999;
  text-align: center;
}
.title {
  font-size: 20px;
  color: black;
  padding-bottom: 10px;
}
.userinfo p {
  padding-bottom: 15px;
}
</style>
