class List{
    constructor(name, parentId){
        this.name = name;
        this.items = [];
        this.id = ID();
        this.dataType = 'collection';
        this.parentId = parentId;
        this.deleted = false; 
    }
}

class Item {
    constructor(title, date, content, parentId){
        this.title = title;
        this.date = date;
        this.content = content;
        this.id = ID();
        this.dataType = 'item';
        this.parentId = parentId;
        this.isDone = false;
        this.deleted = false;
    }
}



class StatusKeeper {
    constructor(){
        this.selectedFileData = undefined;
        this.selectedFileDOM = undefined;
        this.waitingInput = false; 
    }
}


