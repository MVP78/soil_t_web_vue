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
            v-for="dict in dict.type.sys_advice_yes_no"
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
      ></right-toolbar> -->
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
        label="土壤编号"
        align="center"
        prop="id"
      />
      <el-table-column
        label="农作物"
        align="center"
        prop="farmCrops"
      />
      <el-table-column
        label="农场尺寸/公亩"
        align="center"
        prop="farmSize"
      />
      <el-table-column
        label="农场地址"
        align="center"
        prop="farmAddress"
      />
      <el-table-column
        label="采土照片"
        align="center"
        prop="soilPhoto"
      >
        <template slot-scope="scope">
          <!-- 使用 scoped 插槽渲染图片 -->
          <img
            :src="scope.row.soilPhoto"
            style="width: 190px;"
          />
        </template>

      </el-table-column>
      <el-table-column
        label="采土定位"
        align="center"
        prop="dtAddress"
      />
      <el-table-column
        label="订单状态"
        align="center"
        prop="state"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_advice_yes_no"
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
            @click="openReport(scope.row)"
            v-hasPermi="['system:report:query']"
          >查看检测报告</el-button>
          <el-button
            v-if="scope.row.state === '4'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openFormula(scope.row)"
            v-hasPermi="['system:advice:add']"
          >上传专家配方</el-button>
          <el-button
            v-if="scope.row.state === '5'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="lookFormula(scope.row)"
            v-hasPermi="['system:advice:query']"
          >查看专家配方</el-button>
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
    <!-- 查看检测报告对话框 -->
    <el-dialog
      :visible.sync="open"
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
    </el-dialog>
    <!-- 上传专家配方对话框 -->
    <el-dialog
      :visible.sync="open1"
      title="专家配方"
      width="600px"
    >
      <el-form
        ref="adviceForm"
        :model="adviceFormData"
        :rules="rules"
        size="medium"
        label-width="80px"
      >

        <el-form-item
          label="种植建议"
          prop="plantAdvice"
        >
          <el-input
            v-model="adviceFormData.plantAdvice"
            type="textarea"
            placeholder="请输入种植建议"
            :autosize="true"
            maxlength="450"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item
          label="土壤建议"
          prop="soilAdvice"
        >
          <el-input
            v-model="adviceFormData.soilAdvice"
            type="textarea"
            placeholder="请输入土壤建议"
            :autosize="true"
            maxlength="450"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item
          label="施肥建议"
          prop="fertilizationAdvice"
        >
          <el-input
            v-model="adviceFormData.fertilizationAdvice"
            type="textarea"
            placeholder="请输入施肥建议"
            :autosize="true"
            maxlength="450"
            show-word-limit
          ></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer">
        <el-button @click="closeFormula()">取消</el-button>
        <el-button
          type="primary"
          @click="submitFormulaForm()"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 查看专家配方对话框 -->
    <el-dialog
      :visible.sync="open2"
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
    </el-dialog>
  </div>
</template>

<script>
import {
  listOrderAdvice,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
} from "@/api/system/order";
import { getReport } from "@/api/system/report";
import { addAdvice, getAdvice } from "@/api/system/advice";

export default {
  name: "Order",
  dicts: ["sys_advice_yes_no"],
  components: {},
  props: [],
  data() {
    return {
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
      // 建议表单数据
      reportData: [],
      adviceFormData: {
        plantAdvice: "",
        soilAdvice: "",
        fertilizationAdvice: "",
      },
      rules: {
        plantAdvice: [
          {
            required: true,
            message: "请输入种植建议种植建议",
            trigger: "blur",
          },
        ],
        soilAdvice: [
          {
            required: true,
            message: "请输入土壤建议",
            trigger: "blur",
          },
        ],
        fertilizationAdvice: [
          {
            required: true,
            message: "请输入施肥建议",
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
    /** 查询订单信息列表 */
    getList() {
      this.loading = true;
      listOrderAdvice(this.queryParams).then((response) => {
        let arr = response.list.map((obj) => {
          obj.soilPhoto =
            "http:" + process.env.VUE_APP_BASE_API + obj.soilPhoto;
          return obj;
        });
        this.orderList = arr;
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
    //查看检测报告
    openReport(row) {
      let id = row.id;

      getReport(id).then((response) => {
        console.log(response);
        this.reportData = response.data;
        this.open = true;
      });
    },
    //查看专家配方
    lookFormula(row) {
      let id = row.id;
      getAdvice(id).then((response) => {
        console.log(response);
        this.adviceFormData = response.data;
        this.open2 = true;
      });
    },
    //上传专家建议
    openFormula(row) {
      this.resetForm("adviceForm");
      this.adviceFormData.orderId = row.id;
      this.adviceFormData.sysUserId = this.$store.state.user.id;
      this.open1 = true;
    },
    submitFormulaForm() {
      this.$refs["adviceForm"].validate((valid) => {
        if (valid) {
          addAdvice(this.adviceFormData).then((response) => {
            this.$modal.msgSuccess("上传成功");
            this.open1 = false;
            this.getList();
          });
        }
      });
    },

    closeFormula() {
      this.open1 = false;
      this.adviceFormData = {};
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
