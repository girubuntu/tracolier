//storage controller
const StorageCtrl = (function(){
    //public method
    return{
        storeItem: function(item) {
            let items;
            //check if ls is empty
            if(localStorage.getItem('items') === null) {
                items = [];
                //push new item
                items.push(item);
                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));
                //push new item
                items.push(item);
                //re set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function (updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item , index) {
                if(updatedItem.id === item.id){
                    items.splice(index , 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item , index) {
                if(id === item.id){
                    items.splice(index , 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();

//item controller

const ItemCtrl = (function(){
//item constructor

    const Item = function(id, name, calories) {
        this.id= id;
        this.name= name;
        this.calories= calories;

    }
    //data structure/ state
    const data = {
        items: StorageCtrl.getItemsFromStorage(),  
        currentItem: null,
        totalCalories: 0
    }
    //public method
    return {
        
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories){
            let id;
            //create id
            if(data.items.length > 0){
                id = data.items[data.items.length - 1].id +1;
            } else {
                id = 0;
            }

            //calories to number
             calories = parseInt(calories);

             //create new item
             newItem = new Item(id, name, calories);
             
             //add new item to array items
             data.items.push(newItem);
             
             return newItem;
             
        },
        getItemById: function(id){
            let found = null;
            //loop through item
            data.items.forEach(function(item){
                if(item.id===id){
                    found = item;
                }
            });
            return found;
        },
        getTotalCalories: function() {
            let total = 0;
            //loop through items and add cals
            data.items.forEach(function(item){
                total +=item.calories;
            });
            //set cals in data structure
            data.totalCalories = total;
            //return total
            return data.totalCalories;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        deleteItem: function (id) {
            //get id
            const ids = data.items.map(function(item){
                return item.id;
            });
            //geet index
            const index = ids.indexOf(id);
            //remove item
            data.items.splice(index, 1);
        },
        updateItem: function(name, calories){
            calories = parseInt(calories)
            
            let found;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;

        },
        clearAllItems: function() {
            data.items = [];
        },
        logData: function() {
            return data;
        }
    }
})();

//UI controller

const UICtrl = (function(){
    const UISelector = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        clearBtn:'.clear-btn',
        inputItemName: '#item-name',
        inputItemCalories:'#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        addBtn: '.add-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn'
    }

    //public method

    return {
        populateItemList: function(items) {
            let html='';
            
            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });

            //insert list item in ul
            document.querySelector(UISelector.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelector.inputItemName).value,
                calories: document.querySelector(UISelector.inputItemCalories).value
            }
        },
        addListItem: function(item) {
            //show the list
            document.querySelector(UISelector.itemList).style.display= 'block';
            // create li element
            const li = document.createElement('li');
            //add a class
            li.className = 'collection-item';
            //add id
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //insert item 
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li)


        },
        addItemTOform: function(){
            document.querySelector(UISelector.inputItemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.inputItemCalories).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
      
        },
        clearInput: function(){
            document.querySelector(UISelector.inputItemName).value = '';
            document.querySelector(UISelector.inputItemCalories).value = '';
        },
        showEditState: function(){
           // UICtrl.clearInput();
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },
        deleteListItem: function(id){
            const itemId= `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelector.listItems);
            //TURN node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelector.itemList).style.display = 'none';
        }, 
        showTotalCalories: function(total) {
            document.querySelector(UISelector.totalCalories).textContent = total;
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelector.listItems);
            //turn node list into array
            listItems = Array.from(listItems);
            
            listItems.forEach(function(listItem) {
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = ` </strong>${item.name}: <em>${item.calories} calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        

        getSelectors: function() { 
            return UISelector;
        }
    }

})();

//app controller
const app = (function(ItemCtrl, StorageCtrl, UICtrl){ 
    //load event listeners
    const loadEventListeners = function() {
        //get UIselector
        const UISelector = UICtrl.getSelectors();
        //add event listeners
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);
        //disable enter key
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which ===13){
                e.preventDefault();
                return false;
            }
        });
        //edit  icon click event
        document.querySelector(UISelector.itemList).addEventListener('click', itemUpdateClick);
        //update click event
       document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit);
       document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);
       document.querySelector(UISelector.backBtn).addEventListener('click', UICtrl.clearEditState);
       document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItemsClick );
    }

    //add item submit

    const itemAddSubmit = function(e) {

        const input= UICtrl.getItemInput();

       //check the input emptyness
       if(input.name !== '' && input.calories !== '') {
        
        //add items
        const newItem = ItemCtrl.addItem(input.name, input.calories);
        //add item to ui lis
         UICtrl.addListItem(newItem);
        //get total cals
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total cal in UI
        UICtrl.showTotalCalories(totalCalories);
        //store item to local storage
        StorageCtrl.storeItem(newItem);
        //clear input fields
        UICtrl.clearInput();
       } else {
        alert('please provide name and calorie');
       }
        e.preventDefault();
    }
    //update item submit
    const itemUpdateClick= function(e) {
        if(e.target.classList.contains('edit-item')) {
            //get list item id
            const listId= e.target.parentNode.parentNode.id;
            
            //break into the array
            const listArr = listId.split('-');
            //get actual id
            const id = parseInt(listArr[1]);
            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            //set current  item
            ItemCtrl.setCurrentItem(itemToEdit);
            //add item to form
            UICtrl.addItemTOform();
           
            
            
        }

        e.preventDefault();
    }
    const itemUpdateSubmit = function(e) {
        //get item input
        const input = UICtrl.getItemInput();
        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        UICtrl.updateListItem(updatedItem);
        //get total cals
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total cal in UI
        UICtrl.showTotalCalories(totalCalories);
        //update item in ls
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    const itemDeleteSubmit = function(e){
         //GET Current item
        const currentItem = ItemCtrl.getCurrentItem();
        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        //delete from ui
        UICtrl.deleteListItem(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total cal in UI
        UICtrl.showTotalCalories(totalCalories);
        //delete from ls
        StorageCtrl.deleteFromStorage(currentItem.id);
        UICtrl.clearEditState();

        e.preventDefault();
    }
    
    const clearAllItemsClick = function() {
        //delete all item from data stucture
        ItemCtrl.clearAllItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total cal in UI
        UICtrl.showTotalCalories(totalCalories);
       // UICtrl.clearEditState();
        //remove from UI
        UICtrl.removeItems();
        //Clear all from ls
        StorageCtrl.clearItemsFromStorage();
        UICtrl.hideList();

    }
    
    //public method
    return {
        init: function() {
            //set initail state
            UICtrl.clearEditState();
            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if anny item
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                 //populate list with items
                 UICtrl.populateItemList(items);
            }
           
            //get total cals
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total cal in UI
            UICtrl.showTotalCalories(totalCalories);
 
            //load event listeners
            loadEventListeners();
        }

    }

})(ItemCtrl, StorageCtrl, UICtrl);

app.init();


