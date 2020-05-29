<template>
  <div class="container">
    <div class="left half">
      <h4>注册hr账号</h4>
      <!-- 注册表单 第一步-->
      <el-form
        v-if="flag === 0"
        :model="companyForm"
        :rules="companyRules"
        ref="companyRef"
        label-width="0px"
        class="registerForm"
      >
        <el-form-item prop="CompanyCode">
          <el-input v-model="companyForm.CompanyCode" size="middle" placeholder="请输入公司邀请码"></el-input>
        </el-form-item>
      </el-form>
      <!-- 注册表单 第二步-->
      <el-form
        v-else
        :model="registerForm"
        :rules="registerRules"
        ref="registerRef"
        label-width="0px"
        class="registerForm"
      >
        <el-form-item :prop="item.model" v-for="item in registerFormLabel" :key="item.model">
          <el-input
            v-model="registerForm[item.model]"
            size="middle"
            :placeholder="item.label"
            :type="item.type"
            :show-password="item.type === 'password' ? true: false"
          ></el-input>
        </el-form-item>
      </el-form>
      <button class="btn_nextStep" @click="submit">{{btn_nextStep}}</button>
    </div>
    <div class="right half"></div>
  </div>
</template>

<script>
import hrApi from "@/api/hr/hr";
export default {
  data() {
    return {
      //   当前表单  0---第一个  1---第二个
      flag: 0,
      companyForm: { CompanyCode: "" },
      companyRules: {
        CompanyCode: [
          { required: true, message: "请输入公司邀请码", trigger: "blur" }
        ]
      },

      // 表单数据
      registerForm: {
        hrMobile: "",
        hrPassword: "",
        hrName: "",
        hrEmail: ""
      },
      // 表单属性
      registerFormLabel: [
        {
          model: "hrMobile",
          label: "请输入你的手机号码",
          type: "number"
        },
        {
          model: "hrPassword",
          label: "请输入你的密码",
          type: "password"
        },
        {
          model: "hrName",
          label: "请输入你的昵称",
          type: "text"
        },
        {
          model: "hrEmail",
          label: "请输入你的电子邮箱",
          type: "text"
        }
      ],
      // 表单验证
      registerRules: {
        hrMobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号码", trigger: "blur" }
        ],
        hrPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度为 6 ~ 20 个字符", trigger: "blur" }
        ],
        hrName: [
          { required: true, message: "请输入个人昵称", trigger: "blur" },
          { min: 1, max: 15, message: "个人昵称过长", trigger: "blur" }
        ],
        hrEmail: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" }
        ]
      },
      // 按钮
      btn_nextStep: "下一步"
    };
  },
  methods: {
    //   点击按钮
    submit() {
      if (this.flag === 0) {
        this.$refs["companyRef"].validate(valid => {
          if (valid) {
            // 滴滴邀请码DD36526  测试
            let params = "CompanyCode=" + this.companyForm.CompanyCode;
            hrApi
              .postRequest("/register/first", params)
              .then(res => {
                if (res.status === 200) {
                  this.flag = 1;
                  this.btn_nextStep = "确定";
                } else {
                  this.$message.error("邀请码错误");
                }
              })
              .catch(err => {
                err;
                this.$message.error("邀请码错误");
              });
          }
        });
      } else {
        this.$refs["registerRef"].validate(valid => {
          if (valid) {
            let params = "";
            for (var key in this.registerForm) {
              params += key + "=" + this.registerForm[key] + "&";
            }
            params = params.slice(0, -1);
            hrApi
              .postRequest("/register/second", params)
              .then(res => {
                if (res.status === 200) {
                  this.$message.success("注册成功！");
                  setTimeout(() => {
                    this.$message.success("正在跳转到登录页面...");
                  }, 1500);
                  setTimeout(() => {
                    this.$router.push({ path: "/login" });
                  }, 3000);
                }
              })
              .catch(err => {
                err;
                this.$message.error("注册失败");
              });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
body {
  background-color: #f8f8f8;
}
.container {
  width: 700px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 10px 30px;
}
.half {
  width: 50%;
  height: 100%;
  float: left;
}
.container .left {
  padding: 0 40px;
  font-size: 18px;
  position: relative;
  box-sizing: border-box;

  h4 {
    margin-top: 60px;
    text-align: center;
    letter-spacing: 7px;
    text-transform: uppercase;
  }
}
.registerForm {
  height: 250px;
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.btn_nextStep {
  width: 100%;
  height: 42px;
  bottom: 80px;
  text-align: center;
  line-height: 42px;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 2px;
  background-color: #ffffff;
  border: 1px solid #263238;
  color: #263238;
  border-radius: 2px;
}
.btn_nextStep:hover {
  background-color: rgba(26, 32, 38, 0.7);
  color: #ffffff;
  transition: all 0.2s;
}
.container .right {
  background-color: pink;
  background: url("../assets/hrRegisterBg.jpg") top center no-repeat;
  background-size: cover;
}
</style>