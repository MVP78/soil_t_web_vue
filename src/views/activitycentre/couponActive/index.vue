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
        label="优惠券活动名"
        prop="acName"
      >
        <el-input
          v-model="queryParams.acName"
          placeholder="请输入优惠券活动名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-select
          v-model="queryParams.acState"
          placeholder="活动状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_event_status"
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
          v-hasPermi="['system:active:add']"
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
          v-hasPermi="['system:active:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:active:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="activeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="活动编号"
        align="center"
        prop="id"
      />
      <el-table-column
        label="优惠券活动名"
        align="center"
        prop="acName"
      />
      <el-table-column
        label="优惠券活动海报"
        align="center"
        prop="acPoster"
      >
        <template slot-scope="scope">
          <!-- 使用 scoped 插槽渲染图片 -->
          <img
            :src="scope.row.acPoster"
            style="width: 190px;"
          />
        </template>

      </el-table-column>
      <el-table-column
        label="优惠券活动内容"
        width="300px"
        align="center"
        prop="acContent"
      />
      <el-table-column
        label="活动状态"
        align="center"
        prop="acState"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_event_status"
            :value="scope.row.acState"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
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
            v-hasPermi="['system:active:edit']"
          >修改</el-button>

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

    <!-- 添加或修改优惠券活动对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-row>
          <el-col span="12">
            <el-form-item
              label="优惠券活动名称"
              prop="acName"
            >
              <el-input
                v-model="form.acName"
                placeholder="请输入优惠券活动名"
                style="width:226px"
              />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item
              label="优惠券活动状态"
              prop="acState"
            >
              <el-radio-group v-model="form.acState">
                <el-radio
                  v-for="dict in dict.type.sys_event_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item
              label="活动开始时间"
              prop="startTime"
            >
              <el-date-picker
                clearable
                v-model="form.startTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择活动开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="活动结束时间"
              prop="endTime"
            >
              <el-date-picker
                clearable
                v-model="form.endTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择活动结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="优惠券活动海报"
          prop="acPoster"
        >
          <ImageUpload v-model="form.acPoster" />
        </el-form-item>

        <el-form-item
          label="优惠券活动内容"
          prop="acContent"
        >
          <editor
            v-model="form.acContent"
            :min-height="192"
          />
        </el-form-item>

        <el-form-item
          label="优惠券绑定选择"
          prop="acCouponUuid"
        >
          <el-input
            v-model="form.acCouponUuid"
            placeholder="点击以下列表选择优惠券"
            disabled
          />
          <el-table
            v-loading="loading"
            :data="couponList"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              label="优惠券编码"
              align="center"
              prop="couponUuid"
              width="160"
            />
            <el-table-column
              label="优惠券金额/元"
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
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="优惠券过期时间"
              align="center"
              prop="endTime"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
          </el-table>

        </el-form-item>
      </el-form>

      <pagination
        v-show="couponTotal>0"
        :total="couponTotal"
        :page.sync="queryParamsCoupon.pageNum"
        :limit.sync="queryParamsCoupon.pageSize"
        @pagination="getCouponList"
      />
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
  listCouponActive,
  getCouponActive,
  delCouponActive,
  addCouponActive,
  updateCouponActive,
} from "@/api/system/couponActive";
import { listCoupon, grantCoupon } from "@/api/system/coupon";

export default {
  name: "Active",
  dicts: ["sys_event_status"],
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
      // 优惠券活动表格数据
      activeList: [],
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
        acName: null,
        acPoster: null,
        acContent: null,
        acState: null,
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        acName: [
          {
            required: true,
            message: "优惠券活动名称不能为空",
            trigger: "blur",
          },
        ],
        acPoster: [
          {
            required: true,
            message: "优惠券活动海报不能为空",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "活动开始时间不能为空",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "活动结束时间不能为空",
            trigger: "blur",
          },
        ],
        acContent: [
          {
            required: true,
            message: "优惠券活动内容不能为空",
            trigger: "blur",
          },
        ],
        acState: [
          {
            required: true,
            message: "请选择优惠券活动状态",
            trigger: "blur",
          },
        ],
        acCouponUuid: [
          {
            required: true,
            message: "优惠券不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getCouponList();
  },
  methods: {
    /** 查询优惠券活动列表 */
    getList() {
      this.loading = true;
      listCouponActive(this.queryParams).then((response) => {
        let arr = response.rows.map((obj) => {
          obj.acPoster = "http:" + process.env.VUE_APP_BASE_API + obj.acPoster;
          return obj;
        });
        this.activeList = arr;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询优惠券列表 */
    getCouponList() {
      this.loading = true;
      listCoupon(this.queryParamsCoupon).then((response) => {
        this.couponList = response.rows;
        this.couponTotal = response.total;
        this.loading = false;
      });
    },
    //单选优惠券
    handleCurrentChange(val) {
      this.form.acCouponUuid = val.couponUuid;
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
        acName: null,
        acPoster: null,
        acContent: null,
        acState: null,
        createdAt: null,
        updatedAt: null,
        acCouponUuid: null,
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
      this.title = "添加优惠券活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCouponActive(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改优惠券活动";
      });
    },
    /** 提交按钮 */
    submitForm(row) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCouponActive(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.getCouponList();
            });
          } else {
            addCouponActive(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              this.getCouponList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除优惠券活动编号为"' + ids + '"的数据项？')
        .then(function () {
          return delCouponActive(ids);
        })
        .then(() => {
          this.getList();
          this.getCouponList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/active/export",
        {
          ...this.queryParams,
        },
        `active_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
