<template>
  <div>
    <bread first="商品管理" second="分类参数"></bread>

    <el-alert class="my-alert" title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>

    <!-- 级联 -->
    <div class="block">
      <span class="demonstration">请选择商品分类：</span>
      <el-cascader :props="{ expandTrigger: 'hover' }"></el-cascader>
    </div>

    <!-- tab栏 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="动态参数" name="first">
        <el-button type="primary" size="small" class="my-button">添加动态参数</el-button>

        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag v-for="tag in tags" :key="tag.name" closable class="my-tag">{{tag.name}}</el-tag>

              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model.trim="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品参数" prop="parms"></el-table-column>
          <el-table-column label="操作">
            <!-- 自定义列 -->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      activeName: "first",
      tableData: [{ parms: "版式" }, { parms: "内存" }, { parms: "CPU主频" }],
      tags: [{ name: "aa" }, { name: "bb" }, { name: "cc" }]
    };
  },
  methods: {
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 键盘弹起并且失去焦点都会触发
    handleInputConfirm() {

        if( this.inputValue == '' ){
            this.inputVisible = false;
            return
        }

        // 不为空，就要添加数据
        this.tags.push( { 
            name: this.inputValue
        })
        this.inputValue = ''
        this.inputVisible = false;
    }
  }
};
</script>

<style>
.my-alert {
  margin: 20px auto;
}

.block,
.my-button {
  margin-bottom: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>