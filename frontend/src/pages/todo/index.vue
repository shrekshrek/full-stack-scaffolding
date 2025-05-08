<template>
  <div class="todo-view">
    <el-row justify="center">
      <el-col :xs="24" :sm="24" :md="20" :lg="16" :xl="14">
        <h1 class="view-title">我的待办事项</h1>

        <el-card class="todo-form-card">
          <el-form :model="newTodo" @submit.prevent="createTodo">
            <el-form-item>
              <el-input v-model="newTodo.title" placeholder="添加新待办事项..." size="large" />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="newTodo.description"
                type="textarea"
                placeholder="详细描述（可选）"
                :rows="3"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit">添加</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>

        <el-alert v-if="error" type="error" :title="error" class="error-alert" show-icon />

        <el-empty
          v-if="!loading && todos.length === 0"
          description="暂无待办事项"
          class="empty-placeholder"
        />

        <div v-else-if="todos.length > 0" class="todo-list">
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @completed="handleToggleCompleted"
            @edit="openEditDialog"
            @delete="handleDelete"
          />
        </div>

        <el-dialog v-model="dialogVisible" title="编辑待办事项" width="500px">
          <el-form v-if="editingTodo" :model="editingTodo" label-position="top">
            <el-form-item label="标题">
              <el-input v-model="editingTodo.title" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="editingTodo.description" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="状态">
              <el-switch
                v-model="editingTodo.completed"
                active-text="已完成"
                inactive-text="未完成"
                style="margin-left: 8px"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveTodo">保存</el-button>
            </div>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTodos } from '@/composables/useTodos'
import TodoItem from './components/TodoItem.vue'
import type { Todo, TodoCreateData } from '@/types/todo'

const {
  todos,
  loading,
  error,
  fetchTodos,
  createTodo: createTodoAction,
  updateTodo: updateTodoAction,
  deleteTodo: deleteTodoAction
} = useTodos()

const dialogVisible = ref(false)
const editingTodo = ref<Todo | null>(null)
const editingTodoId = ref<number | null>(null)

const newTodo = reactive<TodoCreateData>({
  title: '',
  description: ''
})

onMounted(() => {
  fetchTodos()
})

async function createTodo() {
  if (!newTodo.title.trim()) {
    ElMessage.warning('请输入待办事项标题')
    return
  }

  try {
    await createTodoAction(newTodo.title, newTodo.description || '')

    // 重置表单
    newTodo.title = ''
    newTodo.description = ''

    ElMessage.success('待办事项已添加')
  } catch (error) {
    // 错误已在store中处理
  }
}

async function handleToggleCompleted(id: number, completed: boolean) {
  try {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      const updatedTodo = { ...todo, completed }
      await updateTodoAction(updatedTodo)
    }
  } catch (error) {
    // 错误已在store中处理
  }
}

function openEditDialog(todo: Todo) {
  editingTodoId.value = todo.id
  editingTodo.value = { ...todo }
  dialogVisible.value = true
}

async function saveTodo() {
  if (!editingTodo.value || editingTodoId.value === null) return

  try {
    await updateTodoAction(editingTodo.value)
    dialogVisible.value = false
    ElMessage.success('待办事项已更新')
  } catch (error) {
    // 错误已在store中处理
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除此待办事项吗？', '确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteTodoAction(id)
    ElMessage.success('待办事项已删除')
  } catch (error: any) {
    if (error !== 'cancel') {
      // 用户取消不算错误
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style scoped>
.todo-view {
  padding: 1.5rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--el-text-color-primary);
}

.todo-form-card {
  margin-bottom: 1.5rem;
}

.loading-container {
  margin: 2rem 0;
  text-align: center;
}

.error-alert {
  margin-bottom: 1rem;
}

.empty-placeholder {
  margin: 3rem 0;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 767px) {
  .todo-view {
    padding: 1rem 0.5rem;
  }

  .view-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
}
</style>
