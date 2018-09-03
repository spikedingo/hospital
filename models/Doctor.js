/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shortid = require('shortid');
var AdminUser = require('./AdminUser');
var DoctorSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    doctor:  String,
    department: String,
    sort: { type: String, default: '0' },
    professional : String,
    sImg : { type: String, default: "/upload/images/defaultDoctor.jpg" }, // 文章小图
    description : String,
    updateDate: { type: Date, default: Date.now } // 更新时间
});

var Doctor = mongoose.model("Doctor",DoctorSchema);

module.exports = Doctor;

