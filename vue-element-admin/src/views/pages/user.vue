<template>
  <div class="app-container calendar-list-container">
    <!--查询条件-->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" title="查询">查询</el-button>
      <el-button class="filter-item" type="primary" icon="plus" v-if="userManager_btn_add" title="新增"
                 style="margin-left:10px;" @click="handleCreate">新增</el-button>
    </div>
    <!--表格-->
    <el-table :key="tableKey" :data="list" stripe v-loading.body="listLoading" fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号" type="index" :index="start"></el-table-column>
      <el-table-column align="center" label="用户名" prop="name"></el-table-column>
      <el-table-column align="center" label="角色" prop="desc"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10.,20,30,50]" :page-size="listQuery.limit"
                     layout="total,sizes,prev,pager,next,jumper" :total="total">
      </el-pagination>
    </div>
    <!--弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="form" :inline="true" :rules="rules" ref="form" label-width="90px">
        <el-row>
          <el-col>
            <el-form-item label="账户" prop="username">
              <el-input v-if="dialogStatus=='create'" v-model="form.username" placeholder="请输入账户" class="input-selects-width"></el-input>
              <el-input v-else v-model="form.username" placeholder="请输入账户" readonly class="input-selects-width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="form.password" placeholder="请输入密码" class="input-selects-width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="确认密码" prop="password">
              <el-input type="password" v-model="form.password" placeholder="请输入密码" class="input-selects-width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="角色" prop="desc">
              <el-select v-model="form.desc" placeholder="请选择" class="input-selects-width">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {page, getUser, delUser, saveUser} from 'api/user'
  import {mapGetters} from 'vuex'
  import {isvalidDate} from '@/utils/validate'
  export default {
    name: 'user',
    data() {
      return {
        start: 1,
        form: this.init(),
        rules: {
          username: [
            {
              required: true,
              message: '请输入账户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在3到20个字符',
              trigger: 'blur'
            }],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度在1到20个字符',
              trigger: 'blur'
            }
          ],
          roleId: {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        },
        list: null,
        total: null,
        listLoading: true,  // 表格加载效果
        dialogOrgTreeVisible: false,
        listQuery: {
          page: 1,
          limit: 10
        },
        // 弹出窗口是否显示
        dialogFormVisible: false,
        dialogStatus: '',
        userManager_btn_edit: false,
        userManager_btn_add: false,
        userManager_btn_del: false,
        textMap: {
          update: '更新',
          create: '创建'
        },
        tableKey: 0,
        treeNodes: '',
        options: [{
          value: '1',
          label: '系统管理员'
        }, {
          value: '2',
          label: '普通用户'
        }]
      }
    },
    created() {
      this.getList()
      this.userManager_btn_edit = true
      this.userManager_btn_add = true
      this.userManager_btn_del = true
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      init() {
        return {
          username: undefined,
          password: undefined,
          desc: undefined
        }
      },
      handleClose(done) {
        this.cancel('form');
        done();
      },
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          const tableData = response.data
          this.list = tableData.list
          this.total = tableData.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.getList()
      },
      // 每页显示条目变化
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      // 上一页、下一页或者某一页跳转
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleCreate() {
        this.reset()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {
        getUser(row.id).then(response => {
          this.form = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
      },
      handleDelete(row) {
        this.$confirm('是否刪除该记录？', '记录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delUser(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            saveUser(this.form, this.dialogStatus).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
            saveUser(this.form, this.dialogStatus).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      reset() {
        this.form = this.init();
      }
    }
  }
</script>

<style>
.input-selects-width{
  width: 340px;
}
.el-dialog--small{
  width: 40% !important;
}
</style>