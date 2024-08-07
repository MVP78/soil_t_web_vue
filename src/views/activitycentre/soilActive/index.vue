<template>
  <div class="app-container">
    <el-row
      :gutter="10"
      class="mb8"
    >

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
        label="小程序活动名"
        align="center"
        prop="atName"
      />
      <el-table-column
        label="小程序活动描述"
        align="center"
        prop="atDescription"
        width="500px"
      />
      <el-table-column
        label="活动价格/元"
        align="center"
        prop="atPrice"
      />
      <el-table-column
        label="活动开始时间"
        align="center"
        prop="startTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="活动结束时间"
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

    <!-- 添加或修改小程序活动对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="442px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="小程序活动名"
          prop="atName"
        >
          <el-input
            v-model="form.atName"
            placeholder="请输入小程序活动名"
            style="width: 220px;"
          />
        </el-form-item>
        <el-form-item
          label="小程序活动描述"
          prop="atDescription"
        >
          <el-input
            v-model="form.atDescription"
            type="textarea"
            maxlength="200"
            show-word-limit
            :autosize="true"
            placeholder="请输入内容"
            style="width: 220px;"
          />
        </el-form-item>
        <!-- <el-form-item
          label="小程序海报"
          prop="atPlacard"
        >
          <el-input
            v-model="form.atPlacard"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item> -->
        <el-form-item
          label="活动价格/元"
          prop="atPrice"
        >
          <el-input
            v-model="form.atPrice"
            placeholder="请输入活动价格"
            style="width: 220px;"
          />
        </el-form-item>
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
  listActive,
  getActive,
  delActive,
  addActive,
  updateActive,
} from "@/api/system/active";

export default {
  name: "Active",
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
      // 小程序活动表格数据
      activeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        atName: null,
        atDescription: null,
        atPlacard: null,
        atPrice: null,
        startTime: null,
        endTime: null,
        createdAt: null,
        updatedAt: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        atName: [
          { required: true, message: "活动名称不能为空", trigger: "blur" },
        ],
        atDescription: [
          { required: true, message: "活动描述不能为空", trigger: "blur" },
        ],
        atPrice: [
          { required: true, message: "活动价格不能为空", trigger: "blur" },
          { type: "number", message: "活动价格必须为数字", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "活动开始时间不能为空", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "活动结束时间不能为空", trigger: "blur" },
        ],
        // createdAt: [
        //   { required: true, message: "插入时间不能为空", trigger: "blur" },
        // ],
        // updatedAt: [
        //   { required: true, message: "更新时间不能为空", trigger: "blur" },
        // ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询小程序活动列表 */
    getList() {
      this.loading = true;
      listActive(this.queryParams).then((response) => {
        this.activeList = response.rows;
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
        atName: null,
        atDescription: null,
        atPlacard: null,
        atPrice: null,
        startTime: null,
        endTime: null,
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
      this.title = "添加小程序活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;

      getActive(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改小程序活动";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateActive(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addActive(this.form).then((response) => {
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
        .confirm('是否确认删除小程序活动编号为"' + ids + '"的数据项？')
        .then(function () {
          return delActive(ids);
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
