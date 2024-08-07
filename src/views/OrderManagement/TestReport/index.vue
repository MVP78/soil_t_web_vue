<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >

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
        label="订单状态"
        prop="state"
      >
        <el-select
          v-model="queryParams.state"
          placeholder="订单状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_report_yes_no"
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

    <!-- <el-row
      :gutter="10"
      class="mb8"
    > -->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="primary"-->
    <!--          plain-->
    <!--          icon="el-icon-plus"-->
    <!--          size="mini"-->
    <!--          @click="handleAdd"-->
    <!--          v-hasPermi="['system:order:add']"-->
    <!--        >新增</el-button>-->
    <!--      </el-col>-->
    <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:order:edit']"
        >修改</el-button>
      </el-col> -->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="danger"-->
    <!--          plain-->
    <!--          icon="el-icon-delete"-->
    <!--          size="mini"-->
    <!--          :disabled="multiple"-->
    <!--          @click="handleDelete"-->
    <!--          v-hasPermi="['system:order:remove']"-->
    <!--        >删除</el-button>-->
    <!--      </el-col>-->
    <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->

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
            :options="dict.type.sys_report_yes_no"
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
            v-if="scope.row.state === '4'||scope.row.state === '5'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="lookReport(scope.row)"
            v-hasPermi="['system:report:query']"
          >查看检测报告</el-button>
          <el-button
            v-if="scope.row.state === '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openReport(scope.row)"
            v-hasPermi="['system:report:add']"
          >上传检测报告</el-button>
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

    <!-- 上传检测报告对话框 -->
    <el-dialog
      :visible.sync="open"
      title="检测表单"
      width="710px"
    >
      <el-form
        :model="dynamicValidateForm"
        ref="dyFrom"
        label-width="120px"
      >
        <!-- 默认检测项 -->
        <el-row>
          <el-col
            :span="12"
            v-for="(item,index) in dynamicValidateForm.defaultDomains"
          >
            <el-form-item
              :label="item.itemName"
              :key="index"
              :prop="'defaultDomains.' + index + '.itemValue'"
              :rules=" [{ required: true, message: '值不能为空',trigger: 'blur' }]"
            >
              <el-input
                v-model="item.itemValue"
                style="width:150px;margin-right: 10px;"
              ></el-input>
              <i>{{item.itemUnit}}</i>
            </el-form-item>
          </el-col>

        </el-row>

        <!-- 动态检测项 -->
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'新增检测项' + index"
          :key="domain.key"
          :prop="'domains.' + index + '.itemValue'"
          :rules="[{required: true, message: '值不能为空', trigger: 'blur' }]"
        >
          <el-select
            filterable
            v-model="domain.reportId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.itemName +'：'+item.itemUnit"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <!-- 输入检测项值 -->
          <el-input
            v-model="domain.itemValue"
            style="width: 150px; margin-left: 10px;"
          ></el-input>
          <el-button
            @click.prevent="removeDomain(domain)"
            style=" margin-left: 10px;"
          >删除</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="addDomain">新增检测项</el-button>
        <el-button
          type="primary"
          @click="submitForm('dynamicValidateForm')"
        >提交</el-button>
      </div>
    </el-dialog>
    <!-- 检测报告对话框 -->
    <el-dialog
      :visible.sync="open1"
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
          @click="closeReport()"
        >返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOrderReport,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
} from "@/api/system/order";
import { listItem } from "@/api/system/item";
import { addReport, getReport } from "@/api/system/report";
export default {
  name: "Order",
  dicts: ["sys_report_yes_no"],
  components: {},
  props: [],
  data() {
    return {
      dynamicValidateForm: {
        domains: [],
        defaultDomains: [],
      },

      orderId: null,
      unitData: {},
      itemUnit: "",
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
      reportData: [],
      options: [],
    };
  },
  created() {
    this.getList();
    this.getSelect();
  },
  methods: {
    /** 查询订单信息列表 */
    getList() {
      this.loading = true;
      listOrderReport(this.queryParams).then((response) => {
        this.orderList = response.list;
        // this.total = filteredArray.length;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取检测项下拉条和默认
    getSelect() {
      listItem().then((response) => {
        console.log(response);
        let filterArr1 = [];
        let filterArr2 = [];
        response.rows.forEach((item) => {
          if (item.itemState === "0") {
            filterArr1.push(item);
          } else if (item.itemState === "1") {
            filterArr2.push(item);
          }
        });
        this.options = filterArr1;
        this.dynamicValidateForm.defaultDomains = filterArr2;
        console.log(this.options);
      });
    },
    lookReport(row) {
      console.log(row);
      let id = row.id;
      getReport(id).then((response) => {
        this.reportData = response.data;
        console.log(this.reportData);
        this.open1 = true;
      });
    },
    closeReport() {
      this.open1 = false;
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

    openReport(row) {
      this.resetForm("dyFrom");
      this.getSelect();
      this.dynamicValidateForm.domains = [];
      this.open = true;
      this.orderId = row.id;
    },
    submitForm() {
      console.log(this.dynamicValidateForm);
      this.$refs.dyFrom.validate((valid) => {
        if (valid) {
          let arr1 = this.dynamicValidateForm.defaultDomains.map((obj) => {
            obj.reportId = obj.id;
            return obj;
          });
          let arr2 = this.dynamicValidateForm.domains;
          arr1.push(...arr2);
          let arr = arr1.map((obj) => {
            obj.orderId = this.orderId;
            return obj;
          });
          addReport(arr).then((response) => {
            this.$modal.msgSuccess("上传成功");
            this.open = false;
            this.getList();
          });
          console.log(arr);
        }
      });
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        itemValue: "",
        id: "",
        key: Date.now(),
      });
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
}
.report .el-form-item .el-input {
  margin-right: 10px;
} */
</style>

