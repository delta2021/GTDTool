
//创建新分类并保存在本地
function addEntry(entryName, selectedFileData, parentId){
    const newFile = new List(entryName, parentId);

    selectedFileData.items.push(newFile);
    localStorage.setItem('data', JSON.stringify(data));
    return newFile;
 }


//创建新任务并保存在本地
 function addItem({taskName, date, content}, selectedFileData){
    const newItem = new Item(taskName, date, content);
    console.log(newItem, selectedFileData)
    selectedFileData.items.push(newItem);
    localStorage.setItem('data', JSON.stringify(data));
    return newItem;
 }

 //隐藏/显示元素
 function toggleDomElement(domElement){
     console.log('running on ' + domElement)
    const classListObj = domElement.classList;
    console.log(classListObj);
    if (classListObj.contains('hidden')) {
        classListObj.remove('hidden');
        console.log('removed')
    } else {
        classListObj.add('hidden');
        console.log('add')
    }
 }

 function renderTaskByDate(listItems, renderDateFn, renderTaskFn, container){
         //按到期日来排序
         if (listItems.length > 0){
            listItems.sort((a,b) => {
                return dateToNum(a.date) - dateToNum(b.date); 
            })
        //用到期日来分类展示任务
            let currentDate = listItems[0].date; 
            renderDateFn(currentDate, container);
            listItems.forEach(el => {
                 if (el.date !== currentDate){
                     currentDate = el.date; 
                    renderDateFn(currentDate, container);
                 }
                 renderTaskFn(el, container, true);
            })
    
           }
 }


 function onCheckedElements(arr, newStatus){
   
        arr.forEach(ele => {
            if (ele.checked){
                if (newStatus === 'toDo'){
                    ele.parentElement.querySelector('a').style.color = 'orange';
                } else if (newStatus === 'done'){

                } else if (newStatus === 'deleted'){

                }
               
            } 
            ele.checked = false;
            toggleDomElement(ele);
            toggleDomElement(statusBtnContainer);
            statusOptionBtn.checked = false;

        })
    
   
 }

