import {createApp , reactive, ref, watch, computed, onMounted} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.0-beta.7/vue.esm-browser.min.js'

createApp({
  setup(){
    const state = reactive({
        todo:'',
        todoList:[],
        catchId:'',
        edit:false,
        filter:'All',
    })
    const inputFocus = ref(null);
    const getTodo = (id) => {
      const index = state.todoList.findIndex((item)=>{
        return item.id == id
      })
      return state.todoList[index]
    };
    const addTodo = () => {
      if(!state.edit){
        state.todoList.unshift({
          id : Math.floor(Date.now()),
          value : state.todo,
          completed: false
        })
        state.todo = '';
      }
      else{
        const todo = getTodo(state.catchId);
        todo.value = state.todo;
        state.edit = false;
        state.todo = '';
        state.catchId = '';
      }
    };
    const removeTodo = (id) => {
      const item = getTodo(id)
      state.todoList = state.todoList.filter((todo)=>{
        return todo.id !== item.id
      })
    };
    const editTodo = (id) => {
      const item = getTodo(id)
      state.todo = item.value;
      state.edit = true;
      state.catchId = item.id;
      inputFocus.value.focus();
    };
    const cancelEdit = () => {    
      state.edit = false;
      state.todo = '';
      state.catchId = '';
    };
    const handleList = (keyword) => {
      if(keyword == 'completed'){
        state.todoList.forEach((item)=>{
            item.completed = true
        })
      } else {
        if(confirm('確定刪除所有 todo ?')) state.todoList = [] 
      }
    };
    const completedTodo = (id) => {
      const todo = getTodo(id);
      todo.completed = !todo.completed;
    };

    const filterTodoList = computed(()=>{
      switch(state.filter){
        case('completed'):
          return state.todoList.filter((item) => item.completed)
        break;
        case('todo'):
          return state.todoList.filter((item)=> !item.completed)
        break;
        default:
          return state.todoList
        break;  
      }
    })

    watch(
      () => state.todoList,
      () => {
        localStorage.setItem('list',JSON.stringify(state.todoList))
      },
      { deep: true },
    )
    onMounted(
      ()=>{
        state.todoList = JSON.parse(localStorage.getItem('list')) || [];
      },
    )
    return {
      state,
      inputFocus,
      getTodo,
      addTodo,
      removeTodo,
      editTodo,
      cancelEdit,
      handleList,
      completedTodo,
      filterTodoList
    }
  }
}).mount('#app')