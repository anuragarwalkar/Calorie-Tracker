//Stroage Controller
const StorageCtrl = (function(){

    return{
        storeItem: function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
        }, 
        getItemsFromStorage: function(){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage:function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item,index)=>{
                if(updatedItem.id === item.id){
                    items.splice(index,1,updatedItem);
                }
            })

            localStorage.setItem('items',JSON.stringify(items))
        },
        deleteFromStorage:function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index)=>{
                if(item.id === id){
                    items.splice(index,1);
                };
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAllFromStorage:function(){
            localStorage.removeItem('items')

        }
        
    }

})();
//Item Controller 
const ItemCtrl = (function(){

    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: StorageCtrl.getItemsFromStorage(), 
        currentItem: null,
        totalCalories:0
    }
        return {
            addItem:function(name, calories){
                
               let ID = 0;
               if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1
               }else{
                ID= 0;
               }

               calories = parseInt(calories);

               newItem = new Item(ID,name,calories);

               data.items.push(newItem);
               return newItem;
            },
            getItems: function(){
                return data.items;
            },
            logData: function(){
                return data;
            },
            getTotalCalories:function(){
                let total = 0;

                data.items.forEach(element=>{
                    total += element.calories;
                });

                data.totalCalories = total;

                return data.totalCalories;
            },
            getItemById: function(id){
                let found = null;

                data.items.forEach(element=>{
                    if(element.id === id ){
                        found = element
                    }
                })
            
            return found;
            
            
            }, setCurrentItem:function(item){
                data.currentItem = item;
            },

            getCurrentItem: function(){
                return data.currentItem;
            },
            updateItem: function(name,calories){
                calories = parseInt(calories);
                let found = null;

                data.items.forEach(item=>{
                    if(item.id === data.currentItem.id){
                        item.name = name;
                        item.calories = calories;
                        found = item;
                    }

                })
                return found;
            },
            deleteItem : function(id){
                const ids = data.items.map(item=>{
                    return item.id;
                })

                const index = ids.indexOf(id);

                data.items.splice(index,1);

               
            }, clearAllItems: function(){
                data.items = [];
            }
            






        }
        
        
})();
//UI Controller
const UICtrl = (function(){

    const UISelectros = {
        itemList: '#item-list',
        listItems:'#item-list li',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories: '.total-calories'
    }

    return{
    populateItemsList: function(items){
        let html = ''
        items.forEach(function(item) {
            html += `
            <li class="collection-item" id="item-${item.id}">
       <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
       <a href="#" class="edit-item secondary-content"><i class="fa fa-pencil"></i></a> </li>
            `
        });

        document.querySelector(UISelectros.itemList).innerHTML = html
    }, 

    
    addListItem: function(item){
        document.querySelector(UISelectros.itemList).style.display = 'block';
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.id = `item-${item.id}`
        li.innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="edit-item secondary-content"><i class="fa fa-pencil"></i></a>`

        document.querySelector(UISelectros.itemList).insertAdjacentElement('beforeend',li)
            },

    clearInput:function(){
        document.querySelector(UISelectros.itemNameInput).value = '';
        document.querySelector(UISelectros.itemCaloriesInput).value = '';

    },

    hideList: function(){
        document.querySelector(UISelectros.itemList).style.display = 'none';
    },
    getSelectors: function(){
        return UISelectros
    },
    getItemInput: function(){
        return{
            name:document.querySelector(UISelectros.itemNameInput).value,
            calories:document.querySelector(UISelectros.itemCaloriesInput).value
        }
    },
    showTotalCalories: function(total){
        document.querySelector(UISelectros.totalCalories).textContent = total
    },
    clearEditState:function(){
        UICtrl.clearInput();
        document.querySelector(UISelectros.addBtn).style.display = 'inline';
        document.querySelector(UISelectros.updateBtn).style.display = 'none';
        document.querySelector(UISelectros.deleteBtn).style.display = 'none';
        document.querySelector(UISelectros.backBtn).style.display = 'none';

    },

    showEditState: function(){
        document.querySelector(UISelectros.addBtn).style.display = 'none';
        document.querySelector(UISelectros.updateBtn).style.display = 'inline';
        document.querySelector(UISelectros.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectros.backBtn).style.display = 'inline';

    },

    addItemToForm: function(){
        UICtrl.showEditState();
        document.querySelector(UISelectros.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectros.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },

    updateListItem: function(item){
        let listItems = document.querySelectorAll(UISelectros.listItems)
        listItems = Array.from(listItems);

        listItems.forEach(listItem=>{
            const itemId = listItem.getAttribute('id');
            if(itemId === `item-${item.id}`){
                document.querySelector(`#${itemId}`).innerHTML=`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="edit-item secondary-content"><i class="fa fa-pencil"></i></a>`
            }
        })
    },
    deleteListItem:function(id){
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
        UICtrl.clearEditState();
        const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);
    },
    removeItems: function(){
        const listItem = document.querySelectorAll(UISelectros.listItems);

        const listArray = Array.from(listItem)

        listArray.forEach(ele=> ele.remove())
    }
}

})();
//App Controller
//Load event listeners
const AppCtrl = (function(ItemCtrl,StorageCtrl, UICtrl){

    const loadEventListners = function(){
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13){
            event.preventDefault()
            return false
        }
    })
    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemupdateSubmit);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDelete);
    document.querySelector(UISelectors.backBtn).addEventListener('click',backBtn);
    document.querySelector(UISelectors.clearBtn).addEventListener('click',onClearBtn);
    }

    const onClearBtn = function(event){
        ItemCtrl.clearAllItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.hideList();
        UICtrl.removeItems();
        StorageCtrl.clearAllFromStorage();
        event.preventDefault();
    }

    const itemDelete = function(e){
        e.preventDefault();
        const currentItem = ItemCtrl.getCurrentItem();
        
        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);

        StorageCtrl.deleteFromStorage(currentItem.id);
    }

    const backBtn = function(e){
        e.preventDefault()
        UICtrl.clearEditState()
    }

    const itemEditClick = function(event){
        if(event.target.classList.contains('fa-pencil')){
            const listId = event.target.parentElement.parentElement.id

            const listIdArr = listId.split('-');

            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }

        event.preventDefault();
    }

    const itemAddSubmit = function(event){
        event.preventDefault();
        const input = UICtrl.getItemInput();
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem);
            
            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            StorageCtrl.storeItem(newItem);
            UICtrl.clearInput();
        }else{
            window.alert('Please Provide Input')
        }
    }

    const itemupdateSubmit = function(event){
        event.preventDefault();
        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearEditState();

            StorageCtrl.updateItemStorage(updatedItem);



    }
    
    return {
        init : function(){
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            }else{
                UICtrl.populateItemsList(items);
            }
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            loadEventListners();
            
        }
    }
})(ItemCtrl,StorageCtrl,UICtrl);

AppCtrl.init();