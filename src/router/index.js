import Vue from 'vue'
import Router from 'vue-router' //可通过提示导入
import Login from "@/components/Login";
import Hr_Index from "@/components/Hr_Index";
import Position from "@/components/hr/Position";
import Resume from "@/components/hr/Resume";
import Person_Info from "@/components/hr/Person_Info";
import Interview from "@/components/hr/Interview";
import Employ from "@/components/hr/Employ";
import Talent from "@/components/hr/Talent";
import Root from "@/components/hr/Root"
import HR_Register from "@/components/Hr_register";

Vue.use(Router)
export default new Router({
    // mode: 'history',
    routes: [{
            path: '/',
            name: 'Login',
            component: Login,

        },
        {
            path: '/login',
            name: 'Login',
            component: Login,

        },
        //  为了显示首页方便调试
        {
            path: '/hr_register',
            name: 'HRRegister',
            component: HR_Register,

        },
        {
            path: '/hr_index',
            name: 'Hr_Index',
            component: Hr_Index,
            children: [{
                    // 个人信息
                    path: '/person_info',
                    name: 'person_info',
                    component: Person_Info,
                    meta: {
                        keepAlive: true,
                        scollTopPosition: 0
                    }
                },
                {
                    // ROOT管理板块
                    path: '/root',
                    name: 'root',
                    component: Root,
                    meta: {
                        keepAlive: true,
                        scollTopPosition: 0
                    }
                },
                {
                    // 职位管理
                    path: '/position',
                    name: 'position',
                    component: Position,
                    meta: {
                        keepAlive: true,
                        scollTopPosition: 0
                    }
                },
                {
                    // 简历管理
                    path: '/resume',
                    name: 'resume',
                    component: Resume,
                    meta: {
                        keepAlive: true,
                        scollTopPosition: 0
                    }
                },

                {
                    // 面试管理
                    path: '/interview',
                    name: 'interview',
                    component: Interview,
                    meta: {
                        keepAlive: true,
                        scollTopPosition: 0
                    }
                },
                {
                    // 录用管理
                    path: '/employ',
                    name: 'employ',
                    component: Employ,
                    meta: {
                        keepAlive: true,
                        scollTopPosition: 0
                    }
                },
                {
                    // 人才库
                    path: '/talent',
                    name: 'talent',
                    component: Talent,
                    meta: {
                        keepAlive: true,
                        scollTopPosition: 0
                    }
                },
            ]
        },
    ]
})