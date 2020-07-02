function renderFile(item, container, statusKeeper, taskContainer){
    let div = createFileElement(item, statusKeeper, taskContainer);
    container.appendChild(div);
    div.style.marginLeft = container.style.marginLeft + 10 + 'px';
}


function renderTask(item,container, hasInput){

    container.appendChild(createTaskElement(item, hasInput));
          
}
  

function renderDetailBoard(container, isNewTask, target){

   if (isNewTask){
        container.innerHTML = '';
        container.innerHTML = addTaskTemplate();
        document.getElementById('dueDate').valueAsDate = new Date();
   } else {
        container.innerHTML = '';
        container.innerHTML = showTaskTemplate(); 
        fillDetails(target);
        let editBtn = container.querySelector('#edit');
         
       
        editBtn.addEventListener('click', (e) => {
            container.innerHTML = '';
            container.innerHTML = addTaskTemplate();
            let confirmBtn = container.querySelector('#confirmEdit');
            confirmBtn.classList.remove('hidden');
            document.querySelector('#newTaskName').value = target.title;
            document.querySelector('#content').value = target.content;
            //处理日期字符串， 使它变成new Date()的可用参数
            let dateParam = target.date.split('-');
            dateParam[1] = parseInt(dateParam[1]) - 1; 
            console.log(dateParam)
            console.log(new Date(...dateParam));
            document.querySelector('#dueDate').valueAsDate = new Date(...dateParam, 8);//8， 需要设置一个大于0的时间，否则显示出来的日期会被减掉1


            confirmBtn.addEventListener('click', () => {
                const date = document.querySelector('#dueDate').value;
                const content = document.querySelector('#content').value;
                const title = document.querySelector('#newTaskName').value;
                target.date = date;
                target.content = content;
                target.title = title;
                localStorage.setItem('data', JSON.stringify(data));
                
                //更新detailBoard 
                renderDetailBoard(detailBoardContainer, false, target);

            })
        })
   }


   function fillDetails(){
    document.querySelector('#taskName').innerHTML = `<span>${target.title}<span>`
    document.querySelector('#dueDate').innerHTML =  `<span>${target.date}<span>`
    document.querySelector('#content').innerHTML =  `<span>${target.content}<span>`;
}

}


function renderDate(date, container){
   const div = document.createElement('div');
   div.innerText = date;
   div.classList.add('bg-yellow-center');
   container.appendChild(div);
}
