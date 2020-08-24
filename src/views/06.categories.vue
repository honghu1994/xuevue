<template>
  <div>
    <bread first="商品管理" second="商品分类"></bread>
    <el-button type="success" plain @click="addFormVisible = true">添加分类</el-button>

    <!-- <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="cat_id"
      border
      :tree-props="{children: 'children'}"
    >
    
    <el-table-column prop="cat_name" label="分类名称" sortable width="180"></el-table-column>
    -->

    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border>
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
      ></el-table-tree-column>

      <el-table-column prop="cat_level" label="级别" sortable width="180">
        <template slot-scope="scope">{{ scope.row.cat_level | formatLevel }}</template>
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template slot-scope="scope">{{ scope.row.cat_deleted ? '无效' : '有效' }}</template>
      </el-table-column>

       <el-table-column label="操作">
        <!-- 自定义列 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addFormVisible">
      <el-form :model="addForm">
        <el-form-item label="分类名称" label-width="80px">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" label-width="80px">
          <el-cascader
            v-model="addForm.value"
            :options="level2List"
            :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id', checkStrictly:true }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { categories, addCategories } from "../api/http";

export default {
  name: "categories",
  data() {
    return {
      // 绑定给级联选择器的数据（二级分类）
      level2List: [],

      // 跟表单双向绑定的对象
      addForm: {
        cat_name: "",
        value: []
      },

      addFormVisible: false,

      //跟table绑定的数据源
      tableData: [],
      //总数据
      data: [],
      //页容量
      pageSize: 5,
      //页码
      pageIndex: 1,
      // 总条数
      total: 0
    };
  },

  methods: {
    // 点击确定添加分类的事件
    addCate() {
      // console.log(this.addForm.value);
      // 层级: 其实就是级联选择器的长度
      let length = this.addForm.value.length;
      this.addForm.cat_level = length;

      // 设置它的父id：
      // 如果长度为0.父id就是0
      // 如果长度不为0，就是取长度-1的值作为父id
      if (this.addForm.value.length == 0) {
        this.addForm.cat_pid = 0;
      } else {
        this.addForm.cat_pid = this.addForm.value[length - 1];
      }

      // console.log(this.addForm);

      addCategories(this.addForm).then(res => {
        // console.log(res);

        if (res.data.meta.status == 201) {
          this.$message.success("添加分类成功！");
          this.addFormVisible = false;
          this.loadData();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },

    // 页容量改变事件
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageIndex = 1;

      this.getPageData();
    },
    // 页码点击事件（当前页改变事件）
    handleCurrentChange(page) {
      // 要查出这一页的数据
      /*
       页容量：10

       第1页：下标 0 - 9
       第2页：下标 10 - 19
       第3页：下标 20 - 29
       .....
       总结：
        起始索引 = （页码-1） * 页容量
        结束索引 =  起始索引 + 页容量 - 1  但是截取的时候不用-1，因为截取的时候不包括结束下标
      */
      this.pageIndex = page;

      this.getPageData();
    },

    // 根据最新页码获取出当前页数据
    getPageData() {
      // 算出起始索引
      let start = (this.pageIndex - 1) * this.pageSize;
      // 算出结束索引
      let end = start + this.pageSize;

      // 这个方法截取时不包括结束下标,所以上面就不要-1了
      let arr = this.data.slice(start, end);

      // 赋值给table
      this.tableData = arr;
    },

    loadData() {
      categories(3).then(res => {
        // console.log(res);

        // 总数据
        this.data = res.data.data;

        // 赋值总条数
        this.total = this.data.length;

        this.getPageData();
      });

      categories(2).then(res => {
        this.level2List = res.data.data;
      });
    }
  },

  created() {
    this.loadData();
  },

  filters: {
    formatLevel(val) {
      switch (val) {
        case 0:
          return "一级";
        case 1:
          return "二级";
        case 2:
          return "三级";
      }
    }
  }
};
</script>

<style>
</style>