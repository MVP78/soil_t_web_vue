<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item
        label="优惠券金额/元"
        prop="couponValue"
      >
        <el-input
          v-model="queryParams.couponValue"
          style="width: 152px;"
          placeholder="请输入优惠券金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item
        label="优惠券开始时间"
        prop="startTime"
      >
        <el-date-picker
          clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择优惠券开始时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="优惠券过期时间"
        prop="endTime"
      >
        <el-date-picker
          clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择优惠券过期时间"
        >
        </el-date-picker>
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:coupon:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:coupon:edit']"
        >修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:coupon:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:coupon:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="couponList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="优惠券编码"
        align="center"
        prop="couponUuid"
      />
      <el-table-column
        label="优惠券金额/元"
        align="center"
        prop="couponValue"
      />
      <el-table-column
        label="优惠券数量"
        align="center"
        prop="couponNumber"
      />
      <el-table-column
        label="优惠券开始时间"
        align="center"
        prop="startTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="优惠券过期时间"
        align="center"
        prop="endTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:coupon:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:coupon:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改优惠券管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="420px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="126px"
      >
        <el-form-item
          label="优惠券金额/元"
          prop="couponValue"
        >
          <el-input
            v-model.number="form.couponValue"
            style="width: 220px;"
            placeholder="请输入优惠券金额"
          />
        </el-form-item>
        <el-form-item
          label="优惠券数量"
          prop="couponNumber"
        >
          <el-input
            v-model.number="form.couponNumber"
            style="width: 220px;"
            placeholder="请输入优惠券数量"
          />
        </el-form-item>
        <el-form-item
          label="优惠券开始时间"
          prop="startTime"
        >
          <el-date-picker
            clearable
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择优惠券开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="优惠券过期时间"
          prop="endTime"
        >
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择优惠券过期时间"
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
  listCoupon,
  getCoupon,
  delCoupon,
  addCoupon,
  updateCoupon,
} from "@/api/system/coupon";

export default {
  name: "Coupon",
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
      // 优惠券管理表格数据
      couponList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        couponUuid: null,
        couponValue: null,
        couponNumber: null,
        startTime: null,
        endTime: null,
        tempOne: null,
        tempTwo: null,
        deleted: null,
        createdAt: null,
        updatedAt: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        couponValue: [
          {
            required: true,
            message: "优惠券金额不能为空",
            trigger: "blur",
          },
          { type: "number", message: "优惠券金额必须为数字", trigger: "blur" },
        ],

        couponNumber: [
          {
            required: true,
            message: "优惠券数量不能为空",
            trigger: "blur",
          },
          { type: "number", message: "优惠券数量必须为数字", trigger: "blur" },
        ],
        startTime: [
          {
            required: true,
            message: "优惠券开始时间不能为空",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "优惠券过期时间不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询优惠券管理列表 */
    getList() {
      this.loading = true;
      listCoupon(this.queryParams).then((response) => {
        this.couponList = response.rows;
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
        couponValue: null,
        couponNumber: null,
        startTime: null,
        endTime: null,
        tempOne: null,
        tempTwo: null,
        deleted: null,
        createdAt: null,
        updatedAt: null,
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
      this.title = "添加优惠券";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCoupon(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改优惠券";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCoupon(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCoupon(this.form).then((response) => {
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
      const couponUuid = row.couponUuid;
      this.$modal
        .confirm('是否确认删除优惠券编码为"' + couponUuid + '"的数据项？')
        .then(function () {
          return delCoupon(ids);
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
        "system/coupon/export",
        {
          ...this.queryParams,
        },
        `coupon_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
