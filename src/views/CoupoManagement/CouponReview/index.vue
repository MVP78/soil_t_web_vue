<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="70px"
    >

      <el-form-item
        label="审核状态"
        prop="state"
      >
        <el-select
          v-model="queryParams.state"
          style="width: 142px;"
          placeholder="请选择审核状态"
          clearable
        >

          <el-option
            v-for="dict in dict.type.sys_process_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
        >内推用户</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:apply:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="applyList"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        label="用户名称"
        align="center"
        prop="nickname"
      />
      <el-table-column
        label="优惠券金额/元"
        align="center"
        prop="couponValue"
      />
      <el-table-column
        label="农场名称"
        align="center"
        prop="farmName"
      />
      <el-table-column
        label="农场尺寸/公亩"
        align="center"
        prop="farmSize"
      />
      <el-table-column
        label="农场作物"
        align="center"
        prop="farmCrops"
      />
      <el-table-column
        label="申请原因"
        align="center"
        prop="applyReason"
        width="350px"
      />
      <el-table-column
        label="审核状态"
        align="center"
        prop="state"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_process_status"
            :value="scope.row.state"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="申请时间"
        align="center"
        prop="updatedAt"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审核"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="reviewApplication(scope.row,true)"
            v-hasPermi="['system:apply:edit']"
            v-if="scope.row.state === '0'"
          >通过</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="reviewApplication(scope.row,false)"
            v-hasPermi="['system:apply:edit']"
            v-if="scope.row.state === '0'"
          >不通过</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openCoupon(scope.row)"
            v-hasPermi="['system:apply:edit']"
            v-if="scope.row.state === '1'"
          >发放优惠券</el-button>
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

    <!-- 内推用户对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="914px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="用户手机号"
          prop="mobile"
        >
          <el-input
            v-model.number="form.mobile"
            placeholder="请输入用户手机号"
            style="width:220px;"
          />
        </el-form-item>
        <el-form-item
          label="优惠券"
          prop="couponUuid"
        >
          <el-input
            v-model="form.couponUuid"
            placeholder="点击以下列表选择优惠券"
            disabled
          />
          <el-table
            v-loading="couponLoading"
            :data="couponList"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              label="优惠券编号"
              align="center"
              prop="couponUuid"
            />
            <el-table-column
              label="优惠券数值"
              align="center"
              prop="couponValue"
            />
            <el-table-column
              label="优惠券剩余数量"
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

          </el-table>
          <pagination
            v-show="couponTotal>0"
            :total="couponTotal"
            :page.sync="queryParamsCoupon.pageNum"
            :limit.sync="queryParamsCoupon.pageSize"
            @pagination="getCouponList"
          />
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
  listApply,
  getApply,
  addApply,
  updateApply,
  examine,
} from "@/api/system/apply";
import { listCoupon, grantCoupon } from "@/api/system/coupon";
export default {
  name: "Apply",
  dicts: ["sys_process_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      couponLoading: true,
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
      // 活动申请表格数据
      applyList: [],
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
        userName: null,
        userId: null,
        farmId: null,
        applyReason: null,
        tempOne: null,
        tempTwo: null,
        state: null,
        createdAt: null,
        updatedAt: null,
      },
      queryParamsCoupon: {
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
      //审核数据
      auditData: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mobile: [
          { required: true, message: "用户手机号不能为空", trigger: "blur" },
          { type: "number", message: "用户手机号必须为数字", trigger: "blur" },
        ],
        couponUuid: [
          { required: true, message: "优惠券编码不能为空", trigger: "blur" },
        ],
        // createdAt: [
        //   { required: true, message: "插入时间不能为空", trigger: "blur" }
        // ],
        // updatedAt: [
        //   { required: true, message: "更新时间不能为空", trigger: "blur" }
        // ]
      },
      grantFrom: {
        userId: null,
        sysCouponId: null,
      },
    };
  },
  created() {
    this.getList();
    this.getCouponList();
  },
  methods: {
    /** 查询活动申请列表 */
    getList() {
      this.loading = true;
      listApply(this.queryParams).then((response) => {
        console.log(response);
        this.applyList = response.list;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询优惠券管理列表 */
    getCouponList() {
      this.couponLoading = true;
      listCoupon(this.queryParamsCoupon).then((response) => {
        this.couponList = response.rows;
        this.couponTotal = response.total;
        this.couponLoading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open1 = false;
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userName: null,
        userId: null,
        farmId: null,
        applyReason: null,
        tempOne: null,
        tempTwo: null,
        state: null,
        createdAt: null,
        updatedAt: null,
        couponUuid: null,
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
    //优惠券搜索
    handleQueryCoupon() {
      this.queryParamsCoupon.pageNum = 1;
      this.getCouponList();
    },
    /** 重置按钮操作 */
    resetQueryCoupon() {
      this.resetForm("queryFormCoupon");
      this.handleQueryCoupon();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /**添加内推农户 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加内推农户";
    },
    //单选优惠券
    handleCurrentChange(val) {
      console.log(val);
      this.form.couponUuid = val.couponUuid;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          addApply(this.form).then((response) => {
            console.log(response);
            this.$modal.msgSuccess("内推用户优惠券发放成功");
            this.open = false;
            this.getList();
            this.getCouponList();
          });
        }
      });
    },
    // 发放优惠券弹窗
    openCoupon(row) {
      this.open = true;
      this.title = "发放优惠券";
      this.grantFrom.applyId = row.id;
      this.grantFrom.userId = row.userId;
      console.log(this.grantFrom);
    },
    //选择优惠券发放
    selectCoupon(row) {
      this.grantFrom.sysCouponId = row.couponUuid;
      console.log(this.grantFrom);
      grantCoupon(this.grantFrom).then((response) => {
        this.$modal.msgSuccess("发放成功");
        this.getCouponList();
        this.getList();
        this.open = false;
      });
    },
    //审核
    reviewApplication(row, isPast) {
      let name = row.nickname;
      console.log(row);
      this.auditData.sysCouponId = row.couponUuid;
      this.auditData.userId = row.userId;
      this.auditData.applyId = row.id;
      this.auditData.id = row.id;
      let _this = this;
      if (isPast === true) {
        this.$modal
          .confirm("是否确认通过" + name + "的申请？")
          .then(function () {
            return grantCoupon(_this.auditData);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("申请已通过");
          })
          .catch(() => {});
      } else if (isPast === false) {
        this.auditData.state = "2";
        this.$modal
          .confirm("是否确认退回" + name + "的申请？")
          .then(function () {
            return examine(_this.auditData);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("申请已退回");
          })
          .catch(() => {});
      }
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getApply(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改活动申请";
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除活动申请编号为"' + ids + '"的数据项？')
        .then(function () {
          return delApply(ids);
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
        "system/apply/export",
        {
          ...this.queryParams,
        },
        `apply_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
