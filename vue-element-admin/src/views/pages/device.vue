<template>
  <div class="app-container calendar-list-container">
    <!--查询条件-->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" title="查询">查询</el-button>
      <el-button class="filter-item" type="primary" icon="plus" v-if="device_btn_add" title="新增"
                 style="margin-left:10px;" @click="handleCreate">新增</el-button>
    </div>
    <!--表格-->
    <el-table :key="tableKey" :data="list" stripe v-loading.body="listLoading" fit highlight-current-row
              style="width: 100%" :default-sort = "sortDefault" @sort-change="handleSort">
      <el-table-column align="center" label="序号" type="index" width="50" :index="start"></el-table-column>
      <el-table-column align="center" label="设备名称" sortable="custom" prop="number"></el-table-column>
      <el-table-column align="center" label="位置" sortable="custom" prop="location"></el-table-column>
      <el-table-column align="center" label="备注" sortable="custom" prop="comment"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="device_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="device_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form :model="form" :inline="true" :rules="rules" ref="form" label-width="90px">
        <el-row>
          <el-col>
            <el-form-item label="设备编号" prop="number">
              <el-input v-if="dialogStatus=='create'" v-model="form.number" placeholder="请输入设备名称" class="input-selects-width"></el-input>
              <el-input v-else v-model="form.number" placeholder="请输入设备名称" readonly class="input-selects-width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="设备位置" prop="location">
              <el-input v-model="form.location" placeholder="请输入设备位置" class="input-selects-width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="设备备注" prop="comment">
              <el-input v-model="form.comment" placeholder="请输入设备备注" class="input-selects-width"></el-input>
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
  import {pageDevice, getDevice, delDevice, saveDevice} from 'api/device'
  import {mapGetters} from 'vuex'
  import {isvalidDate} from '@/utils/validate'
  export default {
    name: 'device',
    data() {
      return {
        start: 1,
        sortDefault: {
          prop: 'number', 
          order: 'descending'
        },
        form: this.init(),
        rules: {
          number: [{
              required: true,
              message: '请输入设备编号',
              trigger: 'blur'
            },{
              min: 3,
              max: 20,
              message: '长度在3到20个字符',
              trigger: 'blur'
            }],
          location: [{
              message: '请输入设备位置',
              trigger: 'blur'
          }],
          comment: {
            required: true,
            message: '请输入设备备注',
            trigger: 'blur'
          }
        },
        list: null,
        total: null,
        listLoading: true,  // 表格加载效果
        listQuery: {
          page: 1,
          limit: 10
        },
        // 弹出窗口是否显示
        dialogVisible: false,
        dialogStatus: '',
        device_btn_edit: false,
        device_btn_add: false,
        device_btn_del: false,
        textMap: {
          update: '更新',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.device_btn_edit = true
      this.device_btn_add = true
      this.device_btn_del = true
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      init() {
        return {
          number: undefined,
          location: undefined,
          comment: undefined
        }
      },
      getList(sort) {
        this.listLoading = true
        pageDevice(this.listQuery, sort).then(response => {
          const tableData = response.data
          this.list = tableData.list
          this.total = tableData.total
          this.listLoading = false
        })
      },
      handleClose(done) {
        this.cancel('form');
        done();
      },
      handleFilter() {
        this.getList(this.sortDefault)
      },
      handleSort({ column, prop, order }){
        this.getList({prop, order})
      },
      // 每页显示条目变化
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList(this.sortDefault)
      },
      // 上一页、下一页或者某一页跳转
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList(this.sortDefault)
      },
      handleCreate() {
        this.reset()
        this.dialogStatus = 'create'
        this.dialogVisible = true
      },
      handleUpdate(row) {
        getDevice(row.id).then(response => {
          this.form = response.data
          this.dialogVisible = true
          this.dialogStatus = 'update'
        })
      },
      handleDelete(row) {
        this.$confirm('是否刪除该记录？', '记录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDevice(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList(this.sortDefault)
            /*const index = this.list.indexOf(row)
            this.list.splice(index, 1)*/
          })
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            saveDevice(this.form, this.dialogStatus).then(() => {
              this.dialogVisible = false
              this.getList(this.sortDefault)
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
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogVisible = false
            saveDevice(this.form, this.dialogStatus).then(() => {
              this.dialogVisible = false
              this.getList(this.sortDefault)
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