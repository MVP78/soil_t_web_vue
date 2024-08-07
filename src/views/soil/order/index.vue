<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="orderCode">
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="优惠券id" prop="couponId">
        <el-input
          v-model="queryParams.couponId"
          placeholder="请输入优惠券id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入微信用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="农场id" prop="farmId">
        <el-input
          v-model="queryParams.farmId"
          placeholder="请输入农场id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="寄土表ID" prop="sendSoilId">
        <el-input
          v-model="queryParams.sendSoilId"
          placeholder="请输入寄土表ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际付款" prop="acPaid">
        <el-input
          v-model="queryParams.acPaid"
          placeholder="请输入实际付款"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下单时间" prop="orderTime">
        <el-date-picker clearable
          v-model="queryParams.orderTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择下单时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单初始价格" prop="orderPrice">
        <el-input
          v-model="queryParams.orderPrice"
          placeholder="请输入订单初始价格"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检测报告id" prop="reportId">
        <el-input
          v-model="queryParams.reportId"
          placeholder="请输入检测报告id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专家建议表的id" prop="adviceId">
        <el-input
          v-model="queryParams.adviceId"
          placeholder="请输入专家建议表的id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="订单状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="经度数据" prop="longitude">
        <el-input
          v-model="queryParams.longitude"
          placeholder="请输入经度数据"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维度数据" prop="wildhood">
        <el-input
          v-model="queryParams.wildhood"
          placeholder="请输入维度数据"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="dtAddress">
        <el-input
          v-model="queryParams.dtAddress"
          placeholder="请输入详细地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="插入时间" prop="createdAt">
        <el-date-picker clearable
          v-model="queryParams.createdAt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择插入时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="updatedAt">
        <el-date-picker clearable
          v-model="queryParams.updatedAt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:order:add']"
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
          v-hasPermi="['system:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单id" align="center" prop="id" />
      <el-table-column label="订单编号" align="center" prop="orderCode" />
      <el-table-column label="优惠券id" align="center" prop="couponId" />
      <el-table-column label="微信用户id" align="center" prop="userId" />
      <el-table-column label="农场id" align="center" prop="farmId" />
      <el-table-column label="寄土表ID" align="center" prop="sendSoilId" />
      <el-table-column label="实际付款" align="center" prop="acPaid" />
      <el-table-column label="下单时间" align="center" prop="orderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单初始价格" align="center" prop="orderPrice" />
      <el-table-column label="检测报告id" align="center" prop="reportId" />
      <el-table-column label="专家建议表的id" align="center" prop="adviceId" />
      <el-table-column label="订单状态" align="center" prop="state" />
      <el-table-column label="经度数据" align="center" prop="longitude" />
      <el-table-column label="维度数据" align="center" prop="wildhood" />
      <el-table-column label="详细地址" align="center" prop="dtAddress" />
      <el-table-column label="打卡的照片" align="center" prop="soilPhoto" />
      <el-table-column label="插入时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:order:remove']"
          >删除</el-button>
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

    <!-- 添加或修改订单信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单编号" prop="orderCode">
          <el-input v-model="form.orderCode" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="优惠券id" prop="couponId">
          <el-input v-model="form.couponId" placeholder="请输入优惠券id" />
        </el-form-item>
        <el-form-item label="微信用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入微信用户id" />
        </el-form-item>
        <el-form-item label="农场id" prop="farmId">
          <el-input v-model="form.farmId" placeholder="请输入农场id" />
        </el-form-item>
        <el-form-item label="寄土表ID" prop="sendSoilId">
          <el-input v-model="form.sendSoilId" placeholder="请输入寄土表ID" />
        </el-form-item>
        <el-form-item label="实际付款" prop="acPaid">
          <el-input v-model="form.acPaid" placeholder="请输入实际付款" />
        </el-form-item>
        <el-form-item label="下单时间" prop="orderTime">
          <el-date-picker clearable
            v-model="form.orderTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择下单时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单初始价格" prop="orderPrice">
          <el-input v-model="form.orderPrice" placeholder="请输入订单初始价格" />
        </el-form-item>
        <el-form-item label="检测报告id" prop="reportId">
          <el-input v-model="form.reportId" placeholder="请输入检测报告id" />
        </el-form-item>
        <el-form-item label="专家建议表的id" prop="adviceId">
          <el-input v-model="form.adviceId" placeholder="请输入专家建议表的id" />
        </el-form-item>
        <el-form-item label="订单状态" prop="state">
          <el-input v-model="form.state" placeholder="订单状态" />
        </el-form-item>
        <el-form-item label="经度数据" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度数据" />
        </el-form-item>
        <el-form-item label="维度数据" prop="wildhood">
          <el-input v-model="form.wildhood" placeholder="请输入维度数据" />
        </el-form-item>
        <el-form-item label="详细地址" prop="dtAddress">
          <el-input v-model="form.dtAddress" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="打卡的照片" prop="soilPhoto">
          <el-input v-model="form.soilPhoto" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="插入时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择插入时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedAt">
          <el-date-picker clearable
            v-model="form.updatedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/system/order";

export default {
  name: "Order",
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
      // 订单信息表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderCode: null,
        couponId: null,
        userId: null,
        farmId: null,
        sendSoilId: null,
        acPaid: null,
        orderTime: null,
        orderPrice: null,
        reportId: null,
        adviceId: null,
        state: null,
        longitude: null,
        wildhood: null,
        dtAddress: null,
        soilPhoto: null,
        createdAt: null,
        updatedAt: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderCode: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "微信用户id不能为空", trigger: "blur" }
        ],
        orderTime: [
          { required: true, message: "下单时间不能为空", trigger: "blur" }
        ],
        createdAt: [
          { required: true, message: "插入时间不能为空", trigger: "blur" }
        ],
        updatedAt: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单信息列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
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
        orderCode: null,
        couponId: null,
        userId: null,
        farmId: null,
        sendSoilId: null,
        acPaid: null,
        orderTime: null,
        orderPrice: null,
        reportId: null,
        adviceId: null,
        state: null,
        longitude: null,
        wildhood: null,
        dtAddress: null,
        soilPhoto: null,
        createdAt: null,
        updatedAt: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
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
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除订单信息编号为"' + ids + '"的数据项？').then(function() {
        return delOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
