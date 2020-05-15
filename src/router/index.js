import Vue from 'vue'
import Router from 'vue-router' //可通过提示导入
import Login from "@/components/Login";
import Hr_Index from "@/components/Hr_Index";
import Position from "@/components/hr/Position";
import Resume from "@/components/hr/Resume";
import Person_Info from "@/components/hr/Person_Info";

Vue.use(Router)
export default new Router({
    /*mode:'history',*/
    routes: [{
            path: '/',
            name: 'Login',
            component: Login,

        },

        //  为了显示首页方便调试
        {
            path: '/',
            name: 'Login',
            component: Hr_Index,

        },
        {
            path: '/hr_index',
            name: ' Hr_Index',
            component: Hr_Index,
            children: [{
                    // 职位管理
                    path: '/position',
                    name: 'position',
                    component: Position,
                },
                {
                    // 简历管理
                    path: '/resume',
                    name: 'resume',
                    component: Resume,
                },
                {
                    // 个人信息
                    path: '/person_info',
                    name: 'person_info',
                    component: Person_Info,
                },
            ]
        },
    ]
})