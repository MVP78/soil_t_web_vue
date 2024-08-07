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
        label="土壤编号"
        prop="id"
      >
        <el-input
          v-model="queryParams.id"
          placeholder="请输入土壤编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="订单编号"
        prop="orderCode"
      >
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item
        label="实付金额/元"
        prop="acPaid"
      >
        <el-input
          v-model="queryParams.acPaid"
          placeholder="请输入实付金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item
        label="订单状态"
        prop="state"
      >
        <el-select
          v-model="queryParams.state"
          placeholder="订单状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        label="下单时间"
        prop="createdAt"
      >
        <el-date-picker
          clearable
          v-model="queryParams.createdAt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择下单时间"
        >
        </el-date-picker>
      </el-form-item> -->

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
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="orderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="订单编号"
        align="center"
        prop="orderCode"
      />
      <el-table-column
        label="土壤编号"
        align="center"
        prop="id"
      />
      <el-table-column
        label="用户名称"
        align="center"
        prop="nickname"
      />
      <el-table-column
        label="用户电话"
        align="center"
        prop="mobile"
      />

      <el-table-column
        label="下单时间"
        align="center"
        prop="orderTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实付金额/元"
        align="center"
        prop="acPaid"
      />
      <el-table-column
        label="订单状态"
        align="center"
        prop="state"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_order_status"
            :value="scope.row.state"
          />
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
            @click="getOrderDetail(scope.row)"
            v-hasPermi="['system:order:edit']"
          >查看详情</el-button>
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

    <!-- 订单信息对话框 -->

    <el-dialog
      :visible.sync="open"
      title="订单详情"
    >
      <el-descriptions
        class="margin-top"
        title="订单信息"
        :column="2"
        size="medium"
        border
      >
        <el-descriptions-item>
          <template slot="label">

            订单编号
          </template>
          {{orderData.orderCode}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            订单时间
          </template>
          {{orderData.orderTime}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            订单金额
          </template>
          {{orderData.orderPrice}}元
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            优惠券金额
          </template>
          <div v-if="orderData.couponValue">{{orderData.couponValue}}</div>
          <div v-else>未使用优惠券</div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            实付金额
          </template>
          {{orderData.acPaid}}元
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions
        class="margin-top"
        title="个人信息"
        :column="2"
        size="medium"
        border
      >
        <el-descriptions-item>
          <template slot="label">

            用户名称
          </template>
          {{orderData.nickname}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            用户电话
          </template>
          {{orderData.mobile}}
        </el-descriptions-item>

      </el-descriptions>
      <el-descriptions
        class="margin-top"
        title="农场信息"
        :column="2"
        size="medium"
        border
      >
        <el-descriptions-item>
          <template slot="label">

            农场名称
          </template>
          {{orderData.farmName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            农场作物
          </template>
          {{orderData.farmCrops}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            农场尺寸
          </template>
          {{orderData.farmSize}}公亩
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            农场地址
          </template>
          {{orderData.farmAddress}}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        class="margin-top"
        title="采土信息"
        :column="2"
        size="medium"
        border
        v-if="orderData.state ==='2' ||orderData.state ==='3'||orderData.state ==='4'||orderData.state ==='5'"
      >
        <el-descriptions-item>
          <template slot="label">
            经度
          </template>
          {{orderData.longitude}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            纬度
          </template>
          {{orderData.wildhood}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            详细地址
          </template>
          {{orderData.dtAddress}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">

            采土照片
          </template>
          <img
            :src="orderData.soilPhoto"
            style="width: 190px;"
          />

        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        class="margin-top"
        title="寄土信息"
        :column="2"
        size="medium"
        border
        v-if="orderData.state ==='3'||orderData.state ==='4'||orderData.state ==='5'"
      >
        <el-descriptions-item>
          <template slot="label">
            寄土方式
          </template>
          {{orderData.deliveryMethod}}
        </el-descriptions-item>
        <el-descriptions-item v-if="orderData.trackingNumber">
          <template slot="label">

            快递单号
          </template>
          {{orderData.trackingNumber}}
        </el-descriptions-item>
        <el-descriptions-item v-if="orderData.arrivalTime">
          <template slot="label">
            送达时间
          </template>
          {{orderData.arrivalTime}}
        </el-descriptions-item>

      </el-descriptions>
      <div slot="footer">
        <el-button
          v-if="orderData.state ==='3'"
          type="primary"
        >等待检测报告</el-button>
        <el-button
          v-if="orderData.state ==='4'||orderData.state ==='5'"
          type="primary"
          @click="openReport()"
        >查看检测报告</el-button>
        <el-button
          v-if="orderData.state ==='4'"
          type="primary"
        >等待专家配方</el-button>
        <el-button
          v-if="orderData.state ==='5'"
          type="primary"
          @click="openFormula()"
        >查看专家配方</el-button>
      </div>
      <!-- 检测报告对话框 -->
      <el-dialog
        :visible.sync="open1"
        append-to-body
        title="检测报告详情"
      >
        <el-descriptions
          class="margin-top"
          title=""
          :column="3"
          size="medium"
          border
        >

          <el-descriptions-item
            v-for="(item,index) in reportData"
            :key="key"
          >
            <template slot="label">
              {{item.itemName}}
            </template>
            {{item.itemValue+item.itemUnit}}
            <div
              style="float: right; color: #ff5050; "
              v-if="item.itemLevel === '偏高'"
            >
              {{item.itemLevel}}
            </div>
            <div
              style="float: right; color: #00aaff; "
              v-if="item.itemLevel === '标准'"
            >
              {{item.itemLevel}}
            </div>
            <div
              style="float: right; color: #fbc000; "
              v-if="item.itemLevel === '偏低'"
            >
              {{item.itemLevel}}
            </div>
          </el-descriptions-item>

        </el-descriptions>
        <div slot="footer">

          <el-button
            type="primary"
            @click="open1 = false"
          >返回</el-button>
        </div>
      </el-dialog>
      <!-- 专家建议对话框 -->
      <el-dialog
        :visible.sync="open2"
        append-to-body
        title="专家配方"
      >
        <el-descriptions
          class="margin-top"
          title=""
          :column="1"
          size="medium"
          border
        >
          <el-descriptions-item>
            <template slot="label">
              种植建议
            </template>
            {{adviceFormData.plantAdvice}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              土壤建议
            </template>
            {{adviceFormData.soilAdvice}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              施肥建议
            </template>
            {{adviceFormData.fertilizationAdvice}}
          </el-descriptions-item>
        </el-descriptions>

        <div slot="footer">

          <el-button
            type="primary"
            @click="open2 = false"
          >返回</el-button>
        </div>
      </el-dialog>
    </el-dialog>

  </div>
</template>

<script>
import {
  listOrder,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
} from "@/api/system/order";
import { getReport } from "@/api/system/report";
import { getAdvice } from "@/api/system/advice";

export default {
  name: "Order",
  dicts: ["sys_order_status"],
  components: {},
  props: [],
  data() {
    return {
      orderId: null,
      formData: {
        field101: undefined,
      },
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
      // 订单信息表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      open2: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        couponId: null,
        userId: null,
        farmId: null,
        acPaid: null,
        orderTime: null,
        orderPrice: null,
        reportId: null,
        state: null,
        longitude: null,
        wildhood: null,
        dtAddress: null,
        soilPhoto: null,
        expressSelect: null,
        createdAt: null,
        updatedAt: null,
      },

      // 表单参数
      form: {},
      // 表单校验
      orderData: {
        id: "",
        nickname: "",
        mobile: "",
        farmName: "",
        farmCrops: "",
        farmSize: "",
        farmAddress: "",
        orderCode: "",
        orderTime: "",
        orderPrice: "",
        couponValue: "",
        acPaid: "",
        soilPhoto: "",
        longitude: "",
        wildhood: "",
        dtAddress: "",
        deliveryMethod: "",
        trackingNumber: "",
        arrivalTime: "",
      },
      reportData: [],
      adviceFormData: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单信息列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then((response) => {
        this.orderList = response.list;
        // console.log(response.rows);
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
        couponId: null,
        userId: null,
        farmId: null,
        acPaid: null,
        orderTime: null,
        orderPrice: null,
        reportId: null,
        state: null,
        longitude: null,
        wildhood: null,
        dtAddress: null,
        soilPhoto: null,
        expressSelect: null,
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
      this.title = "添加订单信息";
    },

    // 查看订单详情
    getOrderDetail(row) {
      this.orderId = row.id;
      getOrder(this.orderId).then((response) => {
        this.orderData = response.data.data;
        this.orderData.soilPhoto =
          "http:" + process.env.VUE_APP_BASE_API + this.orderData.soilPhoto;

        console.log(this.orderData);
        this.open = true;
      });
    },
    //查看检测报告
    openReport() {
      getReport(this.orderId).then((response) => {
        this.reportData = response.data;
        console.log(this.reportData);
        this.open1 = true;
      });
    },

    //查看专家建议
    openFormula() {
      getAdvice(this.orderId).then((response) => {
        console.log(response);
        this.adviceFormData = response.data;
        this.open2 = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getOrder(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then((response) => {
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
        .confirm('是否确认删除订单信息编号为"' + ids + '"的数据项？')
        .then(function () {
          return delOrder(ids);
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
        "system/order/export",
        {
          ...this.queryParams,
        },
        `order_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style scoped>
/* .clearfix::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1;
}
.report .el-form-item {
  float: left;
  margin-left: 50px;
}
.report .el-form-item .el-input {
  margin-right: 10px;
} */
</style>
