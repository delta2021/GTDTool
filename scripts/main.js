//init
let data; 
if (localStorage.getItem('data')){
    data = JSON.parse(localStorage.getItem('data'));
} else {
    data = new List('entry', 'Noparent');

    const defaultList = new List('默认分类', data.id);
    data.items.push(defaultList);

    const testItem1 = new Item('看医生', '2020-06-17', '下午四点钟， 陈医生， 广医二院', defaultList.id);
    const testItem2 = new Item('跑步', '2020-06-18', '上午八点钟， 公园', defaultList.id);
    const testItem3 = new Item('写论文', '2020-09-01', '晚上12点之前发终稿给导师', defaultList.id);
    defaultList.items.push(testItem1);
    defaultList.items.push(testItem2);
    defaultList.items.push(testItem3);

    localStorage.setItem('data', JSON.stringify(data));
}

const allTaskEl = document.querySelector('#allTask');
const filesEl = document.querySelector('#files');
let statusKeeper = new StatusKeeper();
statusKeeper.selectedFileData = data;

//get dom elements 
const addFileBtn = document.querySelector('#addFile');
const submitFileBtn = document.querySelector('#submitNewList');
const addTaskBtn = document.querySelector('#addTask');
const cancelTaskBtn = document.querySelector('#cancelNewTask');
const submitTaskBtn = document.querySelector('#submitNewTask');
const closeAllFileBtn = document.querySelector('#closeAllFile');
const detailBoardContainer = document.querySelector('#detailBoard');
const listItemsContainer = document.querySelector('#listItems');


const statusBtnContainer = document.querySelector('#manageStatus');
const doneBtn = document.querySelector('#tagDone');
const toDoBtn = document.querySelector('#tagToDo');
const deleteTaskBtn = document.querySelector('#tagDelete');
const statusOptionBtn = document.querySelector('#statusOption');
const statusConfirmContainer = document.querySelector('#statusConfirm');
const filterBtn = document.querySelector('#filter');
const root = document.querySelector('#root'); 

const allTasks = collectTask(data.items);


allTasks.forEach(el => {
   renderTask(el, allTaskEl);
})


data.items.forEach(el => {
    if (el.dataType === 'collection'){
        renderFile(el, filesEl, statusKeeper, listItemsContainer);
    } else if (el.dataType === 'item'){
        renderTask(el, filesEl)
    }
    
})







//eventListeners

  //for file

closeAllFileBtn.addEventListener('click', () => {
    filesEl.innerHTML = '';
    data.items.forEach(el => {
        if (el.dataType === 'collection'){
            renderFile(el, filesEl, statusKeeper, listItemsContainer);
        } else if (el.dataType === 'item'){
            renderTask(el, filesEl)
        }
        
    })
})


addFileBtn.addEventListener('click', () => {
   toggleDomElement(document.querySelector('#newEntry'));
})

submitFileBtn.addEventListener('click', (e) => {
    const input = document.querySelector('#newEntryName');
    const entryName = input.value.trim();
    if ( entryName === ''){
        alert('分类名称不能为空');
    } else {
       
        let parentData = statusKeeper.selectedFileData;
        let parentDom = statusKeeper.selectedFileDOM;
      
      
        if (parentData === undefined || parentData === data){
            parentData = data;  // 没有选中子文件夹， 新文件夹添加在根目录。
            parentDom = document.querySelector('#files');
      
            let newFile = addEntry(entryName, parentData, parentData.id, data);
            renderFile(newFile, parentDom, statusKeeper, listItemsContainer);

        }

        else {
            if (parentData.items.length === 0){
                parentDom.querySelector('#itemsContainer').innerHTML = '';  //为了删掉'该分类没有项目的提示
            }
            let newFile = addEntry(entryName, parentData, parentData.id, data);
            renderFile(newFile, parentDom.querySelector('#itemsContainer'), statusKeeper, listItemsContainer);
            
        }
       
        input.value = '';
        toggleDomElement(document.querySelector('#newEntry')); 
     
    }
    
})




    //for task 




addTaskBtn.addEventListener('click', () => {
    if (statusKeeper.waitingInput){

        return; 
    }
    renderDetailBoard(document.querySelector('#detailBoard'), true);
    detailBoardContainer.classList.add('appear');
    toggleDomElement(cancelTaskBtn);
    toggleDomElement(submitTaskBtn);
    statusKeeper.waitingInput = true; 
    
})

cancelTaskBtn.addEventListener('click', () => {
    detailBoardContainer.classList.remove('appear');
    statusKeeper.waitingInput = false; 
    toggleDomElement(cancelTaskBtn);
    toggleDomElement(submitTaskBtn);
})


submitTaskBtn.addEventListener('click', () => {
    const input = document.querySelector('#newTaskName');
    const taskName = input.value.trim();
    if ( taskName === ''){
        alert('名称不能为空');
    } else {
        const date = document.querySelector('#dueDate').value;
        const content = document.querySelector('#content').value;
        const newItem = addItem({taskName, date, content}, statusKeeper.selectedFileData);

        const newItemDom = createTaskElement(newItem);

        //把新的任务添加到所有任务列表。

        document.querySelector('#allTask').appendChild(newItemDom);
        //更新detailBoard 
        renderDetailBoard(detailBoardContainer, false, newItem);
        //解锁“新增任务”按钮
        statusKeeper.waitingInput = false;
        //隐藏
        toggleDomElement(cancelTaskBtn); 
        toggleDomElement(submitTaskBtn); 

    }
})



statusOptionBtn.addEventListener('click', (e) => {
    toggleDomElement(statusBtnContainer);
    if (e.target.checked){
        let inputList = listItemsContainer.querySelectorAll('input');
        inputList.forEach(ele => {
        ele.classList.remove('hidden')
        })
    } else {
        let inputList = listItemsContainer.querySelectorAll('input');
        inputList.forEach(ele => {
        ele.classList.add('hidden');
        })
    }
    
 
});


doneBtn.addEventListener('click', () => {
    listItemsContainer.querySelectorAll('input').forEach(
        ele => {
            if (ele.checked){
                changeStatus(statusKeeper.selectedFileData.items, ele.dataset.id, 'isDone', true);
           
                ele.parentElement.querySelector('a').style.color = 'green';
            }
            ele.checked = false;
            toggleDomElement(ele);
        
            statusOptionBtn.checked = false;
        }
    )
    toggleDomElement(statusBtnContainer);
    localStorage.setItem('data', JSON.stringify(data)); 
})


toDoBtn.addEventListener('click', () => {
    listItemsContainer.querySelectorAll('input').forEach(
        ele => {
            if (ele.checked){
                changeStatus(statusKeeper.selectedFileData.items, ele.dataset.id, 'isDone', false);
                ele.parentElement.querySelector('a').style.color = 'orange';
            
            }
            ele.checked = false;
            toggleDomElement(ele);
            statusOptionBtn.checked = false;
        }
    )
    toggleDomElement(statusBtnContainer);
    //更新数据库 
    localStorage.setItem('data', JSON.stringify(data)); 
})


deleteTaskBtn.addEventListener('click', () => {
    let list = []; //保存待删除事项
    listItemsContainer.querySelectorAll('input').forEach(ele => {
        if (ele.checked){
            list.push(ele);
        }
    })
 
    let ans = prompt('是否删除已选中的 '+list.length+ '个事项, 输入y确定');
    if (ans === 'y' && list.length > 0){
       list.forEach(el => {
           let selectedItems = statusKeeper.selectedFileData.items
           selectedItems.forEach((ele, index) => {
               if (ele.id === el.dataset.id){
                selectedItems.splice(index, 1);
               }
           })
           //el是input元素， 要删掉整个div, 所以要选中parentElement
           el.parentElement.remove();
       })

       //更新数据库
       localStorage.setItem('data', JSON.stringify(data)); 
    }
  
})


root.querySelector('#isSelected').addEventListener(
    'click', () => {
        statusKeeper.selectedFileData = data;
        statusKeeper.selectedFileDOM = document.querySelector('#files');
        listItemsContainer.innerHTML = '';
    }
); 


filterBtn.addEventListener('change', e => {
    let value = e.target.value;
    listItemsContainer.innerHTML = '';
    if (value === 'todo'){
        let listItems = [];
        statusKeeper.selectedFileData.items.forEach(ele => {
            if (ele.dataType === 'item' && !ele.isDone){
                listItems.push(ele);
                
            }
        })
        renderTaskByDate(listItems, renderDate, renderTask, listItemsContainer);
    } else if (value === 'completed'){
        let listItems = [];
        statusKeeper.selectedFileData.items.forEach(ele => {
            if (ele.dataType === 'item' && ele.isDone){
                listItems.push(ele);
                
            }
        })
        renderTaskByDate(listItems, renderDate, renderTask, listItemsContainer);
    } else if (value === 'all'){
        let listItems = [];
        statusKeeper.selectedFileData.items.forEach(ele => {
            if (ele.dataType === 'item'){
                listItems.push(ele);
                
            }
        })
        renderTaskByDate(listItems, renderDate, renderTask, listItemsContainer);
    }
})