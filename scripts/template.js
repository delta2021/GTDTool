//file template 
function createFileElement(item, statusKeeper, taskContainer){
    const div = document.createElement('div');
    const children = getLength(item);
    div.innerHTML = `
     <a href="#" class='btn--expand'><ion-icon id="icon" name="folder-outline"></ion-icon><span>${item.name}(${children})</span></a>
     <input type="radio" name="isSelected" id="isSelected">
     <a href="#" class="btn--delete hidden"><ion-icon class="u-vertical-align u-font-size-medium" name="close-outline"></ion-icon></a>
    ` 
    //给事件处理器使用的变量
    let expanded = false;
    const itemsContainer = document.createElement('div');
    itemsContainer.setAttribute('id', 'itemsContainer')
    div.appendChild(itemsContainer);

    //btns
    const btnSelected = div.querySelector('#isSelected'); 
    const btnExpand = div.querySelector('.btn--expand');
    const btnDelete = div.querySelector('.btn--delete');

    btnDelete.setAttribute('data-id', item.id);
    btnDelete.addEventListener('click', e => {
        console.log(e.target.parentElement.dataset.id);
        let confirm = 
        prompt(`请确认是否删除该分类：${item.name}, 分类包含的任务也将被删除,输入'y'确定`);
        if (confirm === 'y'){
            div.remove();
            deleteFile(item.id, item.parentId, data);
         
        }
    })
   

    btnSelected.addEventListener('click', (e) => {
        const listItems = [];
        //收起任务详情板
        detailBoardContainer.classList.remove('appear');
        //用户重复点击已选中的按钮， 执行取消选择的操作。
       if (statusKeeper.selectedFileDOM === div){
           e.target.checked = false;
           statusKeeper.selectedFileData = undefined; 
           statusKeeper.selectedFileDOM = undefined;
           taskContainer.innerHTML = '';
       } else {
        //重置过滤按钮的值。 
        filterBtn.value = 'all';
        //更新选中的文件夹
        statusKeeper.selectedFileData = item; 
        statusKeeper.selectedFileDOM = div;
        //先清空任务列表， 以展示目前选中的数据。
        taskContainer.innerHTML = '';
        //从文件夹里选出属于任务类型的数据
        item.items.forEach(el => {
        
            if (el.dataType === 'item'){
               
                listItems.push(el);
            }
          
        })
            renderTaskByDate(listItems, renderDate, renderTask, taskContainer);
        
        }
        

    })

    btnExpand.addEventListener('click', (e)=>{
        toggleDomElement(btnDelete);

        if (expanded === false){

       
           
            div.querySelector('#icon').setAttribute('name', "folder-open-outline");
            if (item.items.length === 0){
                itemsContainer.innerHTML = '该分类无项目。'; 
            } else {

                item.items.forEach(el => {
                   
                   if (el.dataType === 'collection') {
                        if (!el.deleted){
                            renderFile(el, itemsContainer, statusKeeper, taskContainer);
                        }
                      
                   }
                  
                })
            }
           
            expanded = true;
            } else {
                div.querySelector('#icon').setAttribute('name', "folder-outline");
                itemsContainer.innerHTML = '';
                expanded = false;  
            }
        })


    return div;

}




//task template
function createTaskElement(item, checkbox = false){
    const div = document.createElement('div')
    const a = document.createElement('a');

    div.classList.add('flex-space-around');
  
    a.setAttribute('href', '#');
    a.innerText = `${item.title}`
    a.addEventListener('click', (e) => {
        detailBoardContainer.classList.add('appear');
       renderDetailBoard(detailBoardContainer, false, item)
    })
    div.appendChild(a);

   
    if (item.isDone){
        a.style.color = 'green';

    } else {
        a.style.color = 'orange';

    }
    if (checkbox){
        let checkboxEl = taskCheckBox(item.id); 
        if (!statusOptionBtn.checked){
            checkboxEl.classList.add('hidden');
        }
        
        div.append(checkboxEl);

    }

    return div;
}




//edit task 
function addTaskTemplate(){
    return `
    <div class="flex-1">
        <input placeholder="给任务起个名字" id="newTaskName">
        <a href="#" id="confirmEdit" class="btn btn--submit hidden" >
            <ion-icon class="u-font-size-medium"
            name="checkmark-outline"></ion-icon>
        </a>
    </div>
    <div class="date-picker-container">
        <input type="date" name="" class="date-picker" id="dueDate">
    </div>
    <textarea type="text" class="details__edit-content" id="content" placeholder="备注..">  
    `
}

//show task 
function showTaskTemplate(){
    return   `
    <div class="details__heading">
    <h2 class="details__name" id="taskName"></h2>
    <div class="details__btn-container">
        <a href="#" id="edit" class="btn--edit u-margin-right-medium">
            <ion-icon  class="u-font-size-medium" name="create-outline"></ion-icon>
        </a> 
     

    </div>
   
    </div>
    <h2 class="details__date" id="dueDate">任务日期：</h2>
    <p class="details__content" id="content"></p>`
    
    
}


//checkbox for task 

function taskCheckBox(id){
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('data-id', id); 
    input.classList.add('u-float-right', 'u-vertical-align');
    return input;
}
