<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item
        label="用户名称"
        prop="nickname"
      >
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item
        label="用户手机号码"
        prop="mobile"
      >
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入用户手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:user:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="微信用户编号"
        align="center"
        prop="id"
      />
      <el-table-column
        label="用户昵称"
        align="center"
        prop="nickname"
      />
      <el-table-column
        label="用户头像"
        align="center"
        prop="avatarUrl"
      >
        <template slot-scope="scope">
          <!-- 使用 scoped 插槽渲染图片 -->
          <img
            :src="scope.row.avatarUrl"
            style="width: 100px; height: 100px;"
          />
        </template>

      </el-table-column>
      <el-table-column
        label="手机号码"
        align="center"
        prop="mobile"
      />

      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:user:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:user:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改小程序用户对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="用户昵称"
          prop="nickname"
        >
          <el-input
            v-model="form.nickname"
            placeholder="请输入用户昵称"
          />
        </el-form-item>
        <el-form-item
          label="用户头像"
          prop="avatarUrl"
        >
          <el-input
            v-model="form.avatarUrl"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item
          label="性别  0-未知、1-男性、2-女性"
          prop="gender"
        >
          <el-input
            v-model="form.gender"
            placeholder="请输入性别  0-未知、1-男性、2-女性"
          />
        </el-form-item>
        <el-form-item
          label="最后一次登录时间"
          prop="lastLoginTime"
        >
          <el-date-picker
            clearable
            v-model="form.lastLoginTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择最后一次登录时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="mobile"
        >
          <el-input
            v-model="form.mobile"
            placeholder="请输入手机号码"
          />
        </el-form-item>
        <el-form-item
          label="小程序openId"
          prop="openId"
        >
          <el-input
            v-model="form.openId"
            placeholder="请输入小程序openId"
          />
        </el-form-item>
        <el-form-item
          label="小程序unionId"
          prop="unionId"
        >
          <el-input
            v-model="form.unionId"
            placeholder="请输入小程序unionId"
          />
        </el-form-item>
        <el-form-item
          label="用户真名"
          prop="userName"
        >
          <el-input
            v-model="form.userName"
            placeholder="请输入用户真名"
          />
        </el-form-item>
        <el-form-item
          label="保留字段2"
          prop="tempTwo"
        >
          <el-input
            v-model="form.tempTwo"
            placeholder="请输入保留字段2"
          />
        </el-form-item>
        <el-form-item
          label="保留字段3"
          prop="tempThree"
        >
          <el-input
            v-model="form.tempThree"
            placeholder="请输入保留字段3"
          />
        </el-form-item>
        <el-form-item
          label="保留字段4"
          prop="tempFour"
        >
          <el-input
            v-model="form.tempFour"
            placeholder="请输入保留字段4"
          />
        </el-form-item>
        <el-form-item
          label="保留字段5"
          prop="tempFive"
        >
          <el-input
            v-model="form.tempFive"
            placeholder="请输入保留字段5"
          />
        </el-form-item>
        <el-form-item
          label="是否可用，默认为0，1为不可用"
          prop="disable"
        >
          <el-input
            v-model="form.disable"
            placeholder="请输入是否可用，默认为0，1为不可用"
          />
        </el-form-item>
        <el-form-item
          label="是否逻辑删除，默认为0，1为逻辑删除状态"
          prop="deleted"
        >
          <el-input
            v-model="form.deleted"
            placeholder="请输入是否逻辑删除，默认为0，1为逻辑删除状态"
          />
        </el-form-item>
        <el-form-item
          label="插入时间"
          prop="createdAt"
        >
          <el-date-picker
            clearable
            v-model="form.createdAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择插入时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="更新时间"
          prop="updatedAt"
        >
          <el-date-picker
            clearable
            v-model="form.updatedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择更新时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="删除时间"
          prop="deletedAt"
        >
          <el-date-picker
            clearable
            v-model="form.deletedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择删除时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm"
        >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
} from "@/api/soil/user";

export default {
  name: "User",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 小程序用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickname: null,
        avatarUrl: null,
        gender: null,
        lastLoginTime: null,
        mobile: null,
        openId: null,
        unionId: null,
        userName: null,
        tempTwo: null,
        tempThree: null,
        tempFour: null,
        tempFive: null,
        disable: null,
        deleted: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        openId: [
          { required: true, message: "小程序openId不能为空", trigger: "blur" },
        ],
        createdAt: [
          { required: true, message: "插入时间不能为空", trigger: "blur" },
        ],
        updatedAt: [
          { required: true, message: "更新时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询小程序用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        let arr = response.rows.map((obj) => {
          obj.avatarUrl =
            "http:" + process.env.VUE_APP_BASE_API + obj.avatarUrl;
          return obj;
        });
        this.userList = arr;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        nickname: null,
        avatarUrl: null,
        gender: null,
        lastLoginTime: null,
        mobile: null,
        openId: null,
        unionId: null,
        userName: null,
        tempTwo: null,
        tempThree: null,
        tempFour: null,
        tempFive: null,
        disable: null,
        deleted: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加小程序用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getUser(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改小程序用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除小程序用户编号为"' + ids + '"的数据项？')
        .then(function () {
          return delUser(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
