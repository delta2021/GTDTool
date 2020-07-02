var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };


function collectTask(data){
    let result = [];

    function helper(element){
        if (element.items){
            for (let item of element.items){
                if (item.items){
                    helper(item);
                } else {
                    result.push(item);
                }
            }
        }
    }

    data.forEach((el) => {
        helper(el);
    })

    data.forEach((el) => {
        if (el.dataType === 'item'){
            result.push(el);
        }
    })

    return result;
}


function collectFile(data){
    let result = [];
    

    function helper(element){
        if (element.dataType === 'collection'){
            result.push(element);
            for (let item of element.items){
                if (item.items){
                    helper(item);
                } 
            }
        }
    }

    data.forEach((el) => {
    
        helper(el);
    })

    return result;
}


function deleteFile(targetId, parentId, data){
    let arr = collectFile(data.items);
    arr.push(data);
    for (let i = 0, len = arr.length; i < len; i++){
        let parentArr;
        let p; 
        if (arr[i].id === parentId){
            parentArr = arr[i].items; 
            p; 
            for (let j = 0, len = parentArr.length; j < len; j++){
                if (parentArr[j].id === targetId){
                    parentArr[j] = undefined;
                    p = j;
                };
                
              
            }
            p++;
            for (; p < parentArr.length; j++){
                parentArr[j] = parentArr[j+1];
            }
            parentArr.length = parentArr.length - 1;
            updateLocalStorage(data);
            console.log(`deleted one file.`);
            return;

        }

    }

 
    console.log(`file not found.`); 
    

}

function updateLocalStorage(data){
    localStorage.setItem('data', JSON.stringify(data));

}


function findId(arr, id){
    for (let i = 0, len = arr.length; i < len; i++){
        if (arr[i].id === id){
            return i; 
        }
    }

    return -1; 
}

function getLength(ele){
    let len = 0;
    ele.items.forEach(el => {
        if (el.dataType === 'collection'){
            len++;
        }
    })
    return len;
}


function dateToNum(date){
   return parseInt(date.replace(/-/g, ''));
}


function changeStatus(list, id, property, value){
    console.log(list);
    list.forEach(ele => {
        if (ele.id === id){
            ele[property] = value;  
        }
    })
}


function deleteCollection(){

}