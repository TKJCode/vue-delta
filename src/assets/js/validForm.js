import { Toast } from 'vant'

// 表单验证
class ValidForm {
    constructor() {
        this.validUserFormReg = {
            // 手机号
            phone: {
                reg: /^1[3-9]\d{9}$/,
                msg: '手机号格式错误'
            },

            // 昵称(1-8个字符 => 汉字字母数字下划线组合)
            nickName: {
                reg: /^[\u4e00-\u9fa50\w]{1,8}$/,
                msg: '昵称格式不正确'
            },

            // 密码(首字符为字母,其他字符为数字字母下划线组合,8-16个字符)
            password: {
                reg: /^[a-zA-Z]\w{7,15}$/,
                msg: '密码格式错误'
            }
        }
    }

    validUserForm(obj) {
        // obj：验证表单数据(类型：object)

        for(let key in obj) {
            // 表单验证不通过
            if(!this.validUserFormReg[key].reg.test(obj[key])) {
                console.log(this.validUserFormReg[key].msg);
                
                // 弹出提示
                Toast(this.validUserFormReg[key].msg);

                return false;
            }
        }

        // 表单验证通过
        return true;
    }

}

// 导出
export default new ValidForm();