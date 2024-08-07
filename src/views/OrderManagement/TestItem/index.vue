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
        label="检测项名称"
        prop="itemName"
      >
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入检测项名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="是否默认"
        prop="itemState"
      >
        <el-select
          v-model="queryParams.state"
          placeholder="选择状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.default_yes_no"
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
          v-hasPermi="['system:item:add']"
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
          v-hasPermi="['system:item:edit']"
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
          v-hasPermi="['system:item:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:item:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="itemList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="检测项名称"
        align="center"
        prop="itemName"
      />
      <el-table-column
        label="数据标准最低值"
        align="center"
        prop="beginValue"
      />
      <el-table-column
        label="数据标准最高值"
        align="center"
        prop="endValue"
      />
      <el-table-column
        label="检测项目单位"
        align="center"
        prop="itemUnit"
      />

      <el-table-column
        label="是否默认"
        align="center"
        prop="itemState"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.default_yes_no"
            :value="scope.row.itemState"
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
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:item:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:item:remove']"
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

    <!-- 添加或修改机构报标准对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="检测项名称"
              prop="itemName"
            >
              <el-input
                v-model="form.itemName"
                placeholder="请输入检测项名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="数据标准最低值"
              prop="beginValue"
            >
              <el-input
                v-model="form.beginValue"
                placeholder="请输入数据标准最低值"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="数据标准最高值"
              prop="endValue"
            >
              <el-input
                v-model="form.endValue"
                placeholder="请输入数据标准最高值"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="检测项目单位"
              prop="itemUnit"
            >
              <el-input
                v-model="form.itemUnit"
                placeholder="请输入检测项目单位"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否默认"
              prop="itemState"
            >
              <el-radio-group v-model="form.itemState">
                <el-radio
                  v-for="dict in dict.type.default_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

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
  listItem,
  getItem,
  delItem,
  addItem,
  updateItem,
} from "@/api/system/item";

export default {
  name: "Item",
  dicts: ["default_yes_no"],
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
      // 机构报标准表格数据
      itemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemName: null,
        beginValue: null,
        endValue: null,
        itemUnit: null,
        itemState: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemName: [
          { required: true, message: "检测项名称不能为空", trigger: "blur" },
        ],
        beginValue: [
          {
            required: true,
            message: "数据标准最低值不能为空",
            trigger: "blur",
          },
          {
            type: "number",
            message: "数据标准最低值必须为数字",
            trigger: "blur",
          },
        ],
        endValue: [
          {
            required: true,
            message: "数据标准最高值不能为空",
            trigger: "blur",
          },
          {
            type: "number",
            message: "数据标准最高值必须为数字",
            trigger: "blur",
          },
        ],
        itemUnit: [
          { required: true, message: "检测项目单位不能为空", trigger: "blur" },
        ],
        itemState: [
          { required: true, message: "请选择是否默认", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询机构报标准列表 */
    getList() {
      this.loading = true;
      listItem(this.queryParams).then((response) => {
        this.itemList = response.rows;
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
        itemName: null,
        beginValue: null,
        endValue: null,
        itemUnit: null,
        itemState: null,
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
      this.title = "添加机构报标准";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getItem(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改机构报标准";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateItem(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addItem(this.form).then((response) => {
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
        .confirm('是否确认删除机构报标准编号为"' + ids + '"的数据项？')
        .then(function () {
          return delItem(ids);
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
        "system/item/export",
        {
          ...this.queryParams,
        },
        `item_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
