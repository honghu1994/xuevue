<template>
  <div>
    <el-alert title="添加商品信息" type="info" show-icon></el-alert>

    <el-steps :active="+active" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <el-tabs tab-position="left" v-model="active">
      <el-tab-pane label="基本信息" name="0">
        <el-form
          label-position="top"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
      <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="hd"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :list-type="type"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        
        <quillEditor style="height:350px"></quillEditor>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: "addCategory",
  components:{
    quillEditor
  },
  data() {
    return {
      type:'picture',
      hd: { 
          Authorization: window.localStorage.getItem("token") 
          },
      active: 0,
      fileList: []
    };
  },
  methods: {
    // 当移除时触发
    // 参数1：被删除的图片
    // 参数2：剩余的图片数组
    handleRemove(file, fileList) {
      console.log("删除了", file, fileList);
    },
    // 当点击预览时触发
    handlePreview(file) {
      // console.log("点击图片名字", file);

      window.open(file.url)
    }
  }
};
</script>

<style>
</style>