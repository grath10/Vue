<template>
  <div class="app-container calendar-list-container">
    <!--查询条件-->
    <!-- <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" title="查询">查询</el-button>
      <el-button class="filter-item" type="primary" icon="plus" v-if="entity_btn_add" title="新增"
                 style="margin-left:10px;" @click="handleCreate">新增</el-button>
    </div> -->
    <!--表格-->
    <el-table :key="tableKey" :data="list" stripe v-loading.body="listLoading" fit style="width: 100%" @sort-change="handleSort" :default-sort="sortDefault">
      <el-table-column align="center" label="序号" type="index" width="70" :index="start"></el-table-column>
      <el-table-column align="center" label="参数类型" sortable="custom" prop="type"></el-table-column>
      <el-table-column align="center" label="上限阈值" sortable="custom" prop="high"></el-table-column>
      <el-table-column align="center" label="下限阈值" sortable="custom" prop="low"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="entity_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <!-- <el-button v-if="entity_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button> -->
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
            <el-form-item label="参数类型" prop="type">
              <el-input v-if="dialogStatus=='create'" v-model="form.type" placeholder="请输入参数类型" class="input-selects-width"></el-input>
              <el-input v-else v-model="form.type" placeholder="请输入参数类型" readonly class="input-selects-width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="上限阈值" prop="high">
              <el-input v-model.number="form.high" placeholder="请输入上限阈值" class="input-selects-width"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="下限阈值" prop="low">
              <el-input v-model.number="form.low" placeholder="请输入下限阈值" class="input-selects-width"></el-input>
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
  import {pageEntity, getEntityByName, delEntity, saveEntity} from 'api/entity'
  import {mapGetters} from 'vuex'
  export default {
    name: 'parameter',
    data() {
      return {
        start: 1,
        form: this.init(),
        rules: {
          type: [{
              required: true,
              message: '请输入参数类型',
              trigger: 'blur'
            },{
              min: 2,
              max: 5,
              message: '长度在2到5个字符',
              trigger: 'blur'
            }],
          high: [{
              required: true,
              message: '请输入上限阈值',
              trigger: 'blur',
              type: 'number'
          }],
          low: [{
            required: true,
            message: '请输入下限阈值',
            trigger: 'blur',
            type: 'number'
          }]
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
        entity_btn_edit: false,
        entity_btn_add: false,
        entity_btn_del: false,
        textMap: {
          update: '更新',
          create: '创建'
        },
        tableKey: 3,
        bean: 'parameter',
        sortDefault: {
          prop: 'low', 
          order: 'descending'
        }
      }
    },
    created() {
      this.entity_btn_edit = true
      this.entity_btn_add = true
      this.entity_btn_del = true
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      init() {
        return {
          type: undefined,
          high: undefined,
          low: undefined
        }
      },
      handleSort({ column, prop, order }){
        this.getList({prop, order})
      },
      getList(sort) {
        this.listLoading = true
        pageEntity(this.listQuery, this.bean, sort).then(response => {
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
        getEntityByName(row.type, this.bean).then(response => {
          if(response.data.length){
            this.form = response.data[0]
            this.dialogVisible = true
            this.dialogStatus = 'update'
          }
        })
      },
      handleDelete(row) {
        this.$confirm('是否刪除该记录？', '记录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delEntity(row.id, this.bean).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList(this.sortDefault)
          })
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            saveEntity(this.form, this.dialogStatus, this.bean).then(() => {
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
            saveEntity(this.form, this.dialogStatus, this.bean).then(() => {
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