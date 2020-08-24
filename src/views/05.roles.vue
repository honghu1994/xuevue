<template>
  <div>
    <bread first="权限管理" second="角色列表"></bread>
    <el-button>添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <p v-if="scope.row.children.length == 0">没有分配权限</p>

          <!-- 生成一级菜单 -->
          <el-row v-for="tag in scope.row.children">
            <el-col :span="6">
              <el-tag closable @close="delRight(scope.row.id,tag.id,scope.row)">{{tag.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <!-- 一级菜单右边那一列 -->
            <el-col :span="18">
              <el-row v-for="level2 in tag.children">
                <el-col :span="6">
                  <!-- 生成二级权限,tag是一级菜单，菜单里的children就是二级 -->
                  <el-tag
                    @close="delRight(scope.row.id,level2.id,scope.row)"
                    type="success"
                    closable
                  >{{ level2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span="18">
                  <!-- 生成三级菜单，它们都在二级菜单的children里 -->
                  <el-tag
                    class="my-tag"
                    v-for="level3 in level2.children"
                    @close="delRight(scope.row.id,level3.id,scope.row)"
                    closable
                    type="warning"
                  >{{ level3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色名称"></el-table-column>
      <el-table-column property="roleDesc" label="角色描述"></el-table-column>

      <el-table-column label="操作">
        <!-- 自定义列 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>

          <el-button
            type="warning"
            icon="el-icon-check"
            plain
            size="mini"
            @click="showTree(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="权限分配" :visible.sync="dialogVisible">
      <!-- 树形控件用来显示所有权限 -->
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expand-all="true"
        :default-checked-keys="[5,6]"
        :props="defaultProps"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doRoleRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, delRoleRight, rights, roleRight } from "../api/http";
import { setTimeout } from "timers";
export default {
  name: "roles",
  data() {
    return {
      currentId: 0,
      dialogVisible: false,
      //树形组件绑定的数据，是一个数组
      //数组中每个元素又是一个对象
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2",
              children: [
                {
                  id: 9,
                  label: "三级3-1",
                  children: []
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      tableData: []
    };
  },

  methods: {
    doRoleRight() {
      //  console.log(this.$refs.tree.getCheckedKeys());
      // 拿到所有选中的权限id
      let keys = this.$refs.tree.getCheckedKeys();
      // console.log(this.currentId);
      // 拿到半选的id
      let halfKeys = this.$refs.tree.getHalfCheckedKeys();
      // console.log(halfKeys);

      //ES6语法
      // let arr = [ ...keys,...halfKeys ]
      //原来的方法,不会改变原来数组得到的是新数组
      let arr = keys.concat(halfKeys);

      let rids = arr.toString(); //keys.join() 效果一样

      // 第二个可以简写因为名字一样，第一个不可以，因为名字不一样
      roleRight({ roleId: this.currentId, rids }).then(res => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("权限分配成功！");
          //隐藏对话框
          this.dialogVisible = false;
          // 刷新数据
          this.getTableData();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    // 显示树形对话框
    showTree(row) {
      // 把被点击的这一行的角色id存起来
      this.currentId = row.id;

      //  console.log(row);
      // 显示对话框
      this.dialogVisible = true;

      let list = [];
      // 遍历1级权限
      // for (let i = 0; i < row.children.length; i++) {
      //     // list.push( row.children[i].id )

      //   // 遍历2级权限
      //   let level2 = row.children[i].children;
      //   for (let j = 0; j < level2.length; j++) {
      //       // list.push(level2[j].id)

      //     //遍历3级权限
      //     let level3 = level2[j].children;
      //     for (let z = 0; z < level3.length; z++) {
      //       list.push(level3[z].id);
      //     }
      //   }
      // }

      // 递归用来遍历树形结构非常好
      function getChildrenId(item) {
        //如果还有子元素，继续往下遍历子元素
        if (item.children) {
          for (var i = 0; i < item.children.length; i++) {
            //  每个子元素可能还有自己的子元素
            getChildrenId(item.children[i]);
          }
        } else {
          //代表没有子元素了
          list.push(item.id);
        }
      }

      //把这行数据传入，不断递归找最里面的子元素
      getChildrenId(row);

      //   下一次dom更新调用，它相当于就是setTimeout，只不过它的执行时机是下一次dom更新后才调用
      this.$nextTick(() => {
        // console.log(this.$refs.tree);
        this.$refs.tree.setCheckedKeys(list);
      });
    },
    delRight(roleId, rightId, row) {
      //  console.log(roleId,rightId)
      delRoleRight(roleId, rightId).then(res => {
        // 这个接口如果取消权限成功，状态为200
        // 其次，data.data里会返回剩余的权限
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("删除权限成功");
          row.children = res.data.data;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },

    getTableData() {
      //获取所有角色
      getRoles().then(res => {
        // console.log(res);
        this.tableData = res.data.data;
      });
    }
  },

  created() {
    //获取所有角色
    this.getTableData();

    //获取所有的树形结构的权限
    rights("tree").then(res => {
      console.log(res);
      this.data = res.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
.my-tag {
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>